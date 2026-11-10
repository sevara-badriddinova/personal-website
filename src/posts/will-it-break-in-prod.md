---
title: Will It Break in Prod?
description: Your app works when you test it alone. Here's how to find out what happens when hundreds of people use it at once, with a free tool called k6.
date: 2026-11-10
tags: performance, testing, k6
cover: /images/writing/will-it-break-in-prod/cover-crowd.webp
coverAlt: Two panels. On the left, your test: one person, and your app answers in 12 ms. On the right, Monday at 9 AM: a crowd of 400 people, and your app gets slow, then throws errors.
---

**Your app works when you test it. But when you test it, you're one person. Real users show up hundreds at a time.**

![Two panels. On the left, your test: one person, and your app answers in 12 ms. On the right, Monday at 9 AM: a crowd of 400 people, and your app gets slow, then throws errors.](/images/writing/will-it-break-in-prod/cover-crowd.webp)

Every elevator has a small metal plate inside that says something like *max 13 people*. Nobody guessed that number. Someone loaded the elevator until they found its limit, then wrote it down with some room to spare.

Most apps don't have that plate. We know the app gives the right answer. We don't know how many people it can handle before it gets slow or stops working. Usually we find out the hard way, on the day a lot of people show up.

This post shows how to find that number before your users do, with a free tool called k6.

### Why Don't My Tests Catch This?

Normal tests check that your code gives the right answer. They do it one request at a time, on a quiet computer, with a small database. That's not what production looks like.

Most things that break under load only break when many requests arrive at the same time:

- **Too many requests wait for the database.** Your app keeps a small set of database connections and shares them. Spring Boot's default is 10. If 50 requests need the database at once, 40 of them wait in line.
- **The server runs out of workers.** A server works on a limited number of requests at once (200 by default in Spring Boot). Everyone else waits.
- **Requests get in each other's way.** A query that takes 5 ms on its own can take much longer when 50 copies of it try to change the same rows.
- **Small waste adds up.** Code that runs one extra database query for every item in a list is fine with one user and painful with a hundred.
- **Memory slowly fills up.** Everything looks fine for a while, then the app starts pausing to clean up memory and responses get slow.

None of these show up in a normal test. In real life it goes like this:

> **Me:** It's fast. 12 ms on my laptop.
>
> **Production, Monday 9 AM:** Cool. Here are 400 people.

### What Is k6?

k6 is a free, open-source tool from Grafana Labs for load testing: sending a lot of traffic to your app on purpose to see how it holds up.

You write a short JavaScript script that describes what one visitor does, like "open this page." Then you tell k6 how many visitors to pretend to be. k6 calls these pretend visitors **virtual users**. Each one runs your script over and over, and k6 times every request and counts the ones that fail.

![A diagram in four steps. k6 runs on your laptop. It starts virtual users, which are pretend visitors that repeat your script. They send requests to your app. k6 then reports how fast your app answered and how many requests failed.](/images/writing/will-it-break-in-prod/how-k6-works.webp "k6 pretends to be many visitors at once, then tells you how your app held up.")

To install it on a Mac:

```bash
brew install k6
```

### Your First Test

Start small. This script pretends to be one visitor for 30 seconds:

```js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1,
  duration: "30s",
};

export default function () {
  const res = http.get("http://localhost:8080/api/orders/42");

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1); // a real person pauses between clicks
}
```

Save it as `smoke.js` and run `k6 run smoke.js`. Here's what each part does:

- `vus: 1` and `duration: "30s"`: one virtual user, for 30 seconds.
- `http.get(...)`: the visitor opens this address.
- `check(...)`: makes sure the answer is right (status 200 means "OK"). A failed check doesn't stop the test. k6 just counts how many passed.
- `sleep(1)`: wait one second, like a real person reading the page before clicking again.

This is called a **smoke test**. It doesn't tell you anything about heavy traffic yet. It just proves the script works before you turn up the volume.

### What Does "Fast Enough" Mean?

Before adding more users, decide what "good" looks like. Watch out for one trap: **the average lies.**

Imagine 100 requests. 90 of them take 20 ms. The other 10 take 2 full seconds.

| Measure | Result | What it makes you think |
| --- | --- | --- |
| Average | 218 ms | "Fine." |
| Median | 20 ms | "Great." |
| p95 | 2,000 ms | "Some people waited two seconds." |

**p95** is the time that 95 out of 100 requests finished within. It looks at the slowest part of your traffic, and that's the part people notice.

In k6 you write your goal down as a **threshold**, a pass or fail line:

```js
export const options = {
  thresholds: {
    http_req_failed: ["rate<0.01"],   // less than 1% of requests fail
    http_req_duration: ["p(95)<300"], // 95% finish in under 300 ms
  },
};
```

If either line is crossed, k6 marks the test as failed and exits with code 99. So you can run it automatically on every code change and catch a slowdown before it ships, the same way a failing unit test stops a bug.

How do you pick 300 ms? From what your users need, not from whatever your app happens to do today.

### How Many Users Should I Test With?

Different questions need different kinds of tests. The k6 docs name six:

![Six small charts of users over time. Smoke: one or two users. Average load: climb to normal traffic and stay there. Stress: climb above normal and stay there. Spike: jump to a lot of users at once, then drop. Soak: normal traffic for hours. Breakpoint: keep adding users until the app fails.](/images/writing/will-it-break-in-prod/test-types.webp "Same script, six kinds of traffic.")

| Test | The question it answers | What the traffic looks like |
| --- | --- | --- |
| Smoke | Does my script even work? | 1–2 users for a minute or two |
| Average load | Are we fine on a normal day? | Climb to normal traffic and stay there |
| Stress | Are we fine on our busiest day? | Climb above normal traffic and stay there |
| Spike | What if everyone shows up at once? | Jump straight to a lot of users, then drop |
| Soak | Do we stay fine for hours? | Normal traffic, for a long time |
| Breakpoint | Where exactly do we break? | Keep adding users until something fails |

You describe the shape with `stages`. Each stage says "get to this many users over this much time":

```js
export const options = {
  stages: [
    { duration: "2m", target: 50 }, // climb to 50 users over 2 minutes
    { duration: "5m", target: 50 }, // stay at 50 for 5 minutes
    { duration: "2m", target: 0 },  // go back down to 0
  ],
};
```

Where do the numbers come from? If your app already has users, look at your busiest hour in your logs or monitoring. If it doesn't, make a sensible guess, and write down that it's a guess.

### Real Users Don't Wait Their Turn

Here's a detail that's easy to miss.

A virtual user sends a request, waits for the answer, and only then sends the next one. So when your app slows down, the virtual users slow down with it, and fewer requests come in. The test goes easy on your app right when it's struggling.

Real people don't do that. New visitors keep arriving whether your app is fast or slow.

![Two rows of steps while the app is slow. A k6 virtual user sends a request, waits 3 seconds for the slow answer, and only then sends the next one, so fewer requests go out. Real visitors: visitor 1 sends a request, the app is still working on it, and visitors 2, 3 and 4 arrive anyway, so requests pile up.](/images/writing/will-it-break-in-prod/waits-vs-arrives.webp "A virtual user waits its turn. Real visitors don't.")

If your question is "can we handle 100 requests per second?", tell k6 exactly that. An **arrival-rate** test starts new requests on a fixed schedule, no matter how slow the answers are:

```js
export const options = {
  scenarios: {
    orders: {
      executor: "ramping-arrival-rate",
      startRate: 10,
      timeUnit: "1s", // the rates below are per second
      preAllocatedVUs: 50,
      maxVUs: 500,
      stages: [
        { duration: "3m", target: 100 }, // climb to 100 per second
        { duration: "5m", target: 100 }, // stay there
        { duration: "3m", target: 300 }, // then push past it
      ],
    },
  },
};
```

Each "per second" here counts runs of your test function. With one request per run, that's requests per second. If k6 runs out of virtual users and can't start a run on time, it counts it in `dropped_iterations`. If that number isn't zero, you didn't actually send the traffic you asked for.

### Reading the Results

When the test ends, k6 prints a summary. It has a lot of lines. Start with these:

| What k6 calls it | What it means | What to look for |
| --- | --- | --- |
| `http_req_duration` | How long requests took | The p95 and p99, not the average |
| `http_req_failed` | How many requests failed | Anything above zero, and when it started |
| `checks` | How many of your checks passed | Under 100% means wrong answers, not just slow ones |
| `iterations` | How many times your script ran | Did you send as much traffic as you planned? |
| `dropped_iterations` | Runs k6 couldn't start on time | Should be zero in arrival-rate tests |

By default the summary shows p90 and p95. To see p99 too, add `summaryTrendStats: ["avg", "med", "p(95)", "p(99)", "max"]` to your options.

The summary at the end doesn't show *when* things went wrong. To watch live graphs while the test runs:

```bash
K6_WEB_DASHBOARD=true k6 run load.js
```

Then open `http://localhost:5665` in your browser. Add `K6_WEB_DASHBOARD_EXPORT=report.html` to save the graphs as a file.

What you're looking for is the **knee**: the point where response times stop being flat and shoot up. Errors usually start right after.

![A bar chart of example results, adding 50 users at a time. From 50 to 200 users, p95 stays under the 300 ms goal, between 120 and 240 ms, and nothing fails. At 250 users p95 jumps to 900 ms and 2% of requests fail. At 300 users it takes 2.8 seconds and 18% fail. Your limit is about 200 users.](/images/writing/will-it-break-in-prod/knee-steps.webp "Example numbers, not a real test.")

In this example, everything is fine up to 200 users. At 250, response times jump and requests start failing. So the number for your elevator plate is about 200 users, with some room to spare.

### k6 Shows That It's Slow, Not Why

k6 only sees your app from the outside. To find the cause, watch your server while the test runs:

- how many database connections are in use, and how long requests wait for one
- CPU and memory on the app server and the database
- pauses to clean up memory (garbage collection), if your app runs on Java
- your database's slow query log

Usually one of these hits its limit right at the knee. That's your bottleneck. Fix it, run the same test again, and see if the knee moves to the right.

### Ways to Fool Yourself

A load test is only as honest as its setup. Watch out for these:

- **A tiny test database.** A query over a thousand rows is fast. The same query over ten million rows might not be. Test with a realistic amount of data.
- **The same request every time.** Asking for `/orders/42` a thousand times mostly tests your cache. Use a list of different IDs (k6's `SharedArray` helps with that).
- **Your laptop is the bottleneck.** If the computer running k6 is at 100% CPU, you're measuring your laptop, not your app.
- **localhost is too fast.** Real users are far away, on real networks. Test against a deployed staging server when you can.
- **Someone else's service is in the way.** Don't load test your payment provider by accident. Use their sandbox or a fake version.
- **Testing production.** If you really have to, plan it with the people who run it, and start small.

### Where to Start

You don't need a big setup. A short script, two thresholds, and an hour of watching graphs will teach you more about your app than another week of guessing.

| Your situation | Start with |
| --- | --- |
| Before the first launch | A smoke test, then an average-load test |
| A big day is coming (a launch, a sale, a demo) | Stress and spike tests |
| The app gets slower after running for days | A soak test |
| You need to know your limit | A breakpoint test with an arrival rate |
| Every pull request | A short smoke test with thresholds, in CI |

Find your number before your users find it for you. And if you have a friend who says "it works on my machine," send them this.
