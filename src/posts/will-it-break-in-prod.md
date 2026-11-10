---
title: Will It Break in Prod?
description: Your tests check one user at a time. Production never sends you one user at a time. How to use k6 to find your app's limit before your users do.
date: 2026-11-10
tags: performance, testing, k6
cover: /images/writing/will-it-break-in-prod/cover.webp
coverAlt: A brushed-metal capacity plate, like the one inside an elevator, that reads "This API. Max ___ requests per second. p95 under 300 ms. Errors under 1%. Load tested with k6."
---

**Your app passed every test. That proves it works for one person at a time. Production never sends you one person at a time.**

![A brushed-metal capacity plate, like the one inside an elevator, that reads "This API. Max ___ requests per second. p95 under 300 ms. Errors under 1%. Load tested with k6."](/images/writing/will-it-break-in-prod/cover.webp)

Every elevator has a small metal plate inside: *max 13 persons, 1,000 kg*. Nobody guessed that number. Someone loaded the elevator until they knew where the limit was, then wrote it down with a margin.

Most APIs ship without that plate. We know the endpoint returns the right answer. We don't know how many people it can serve before it slows down, starts timing out, or falls over. Usually we find out on the day real traffic shows up.

This post is about finding that number first, with k6.

### Aren't My Tests Enough?

Unit and integration tests answer one question: *is it correct?* They usually ask it with a single caller, on a quiet machine, against a tiny database.

The bugs that take an app down in production mostly don't exist at that scale. They show up when requests overlap:

- **The connection pool runs out.** Spring Boot's default pool (HikariCP) holds 10 database connections. Request 11 waits in line, and so does everyone after it.
- **Threads run out.** Tomcat handles 200 requests at a time by default. Request 201 queues.
- **A query that takes 5 ms alone** can take far longer when 50 copies of it fight over the same rows.
- **An N+1 query**, one query for the list and one more for every item in it, is invisible with one user and painful with a hundred.
- **Memory fills up slowly**, and garbage collection pauses start showing up in your response times hours later.

None of this fails a unit test. It usually goes like this:

> **Me:** It's fast. 12 ms on my laptop.
>
> **Production, Monday 9 AM:** Cool. Here are 400 people.

### So What Is k6?

[k6](https://grafana.com/oss/k6/) is an open-source load testing tool from Grafana Labs. Its own tagline is "like unit testing, for performance," which is a fair description. You write the test in JavaScript, and k6 runs it from a single Go binary, so one laptop can pretend to be hundreds of users.

The main idea is the **virtual user (VU)**. A VU is a loop that runs your test function over and over, like one person clicking through your app. Ask for 50 VUs and k6 runs 50 of those loops at the same time, then measures every request they make.

On a Mac, installing it is one line:

```bash
brew install k6
```

### What Does the Simplest Test Look Like?

Start with a **smoke test**: one user, thirty seconds. It tells you nothing about load yet. It tells you the script works and the endpoint answers.

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

Run it with `k6 run smoke.js`. When it finishes, k6 prints a summary: how many requests went out, how many failed, and how long they took.

`check` works like an assertion that doesn't stop the test. It counts passes and failures, so you see "98% of responses were 200" instead of a crash on the first bad one.

### What Does "Fast Enough" Mean?

Before adding users, decide what passing looks like. Here's the trap: **averages lie.**

Say 100 requests come in. 90 of them take 20 ms and 10 of them take 2 seconds.

| Stat | Value | What it tells you |
| --- | --- | --- |
| Average | 218 ms | "Looks fine." |
| Median (p50) | 20 ms | "Looks great." |
| p95 | 2,000 ms | Real people waited two seconds. |

p95 is the time that 95% of requests finished within. It looks at the slow end, and the slow end is where users get annoyed and leave.

In k6 you write the passing line down as a **threshold**:

```js
export const options = {
  thresholds: {
    http_req_failed: ["rate<0.01"],   // less than 1% of requests fail
    http_req_duration: ["p(95)<300"], // 95% finish in under 300 ms
  },
};
```

If any threshold fails, k6 marks the run as failed and exits with code 99. So you can put a short k6 test in CI and fail the build when a change makes things slower, the same way a failing unit test does.

Where does 300 ms come from? From what your users need, not from what your app happens to do today.

### How Many Users Is "a Lot"?

Different questions need different shapes of load. The k6 docs group them into a handful of test types:

![Six small charts of virtual users over time: smoke is flat and low, average load ramps up and holds, stress ramps higher and holds, spike jumps up and drops, soak holds a normal level for a long time, and breakpoint keeps rising.](/images/writing/will-it-break-in-prod/test-types.webp "Same script, six shapes of load.")

| Test | The question it answers | Shape |
| --- | --- | --- |
| Smoke | Does the script even work? | 1–2 users, a minute or two |
| Average load | Are we fine on a normal day? | Ramp up to normal traffic, hold it |
| Stress | Are we fine on the busiest day? | Ramp above normal traffic, hold it |
| Spike | What if everyone shows up at once? | Jump straight to a lot, then drop |
| Soak | Do we stay fine for hours? | Normal traffic, for a long time |
| Breakpoint | Where exactly do we break? | Keep adding load until something fails |

To shape the load, use `stages`. Each stage moves the number of VUs to a target over a duration:

```js
export const options = {
  stages: [
    { duration: "2m", target: 50 }, // ramp up to 50 users
    { duration: "5m", target: 50 }, // stay there
    { duration: "2m", target: 0 },  // ramp down
  ],
};
```

What counts as normal traffic? If you have real numbers, use them: requests per second at your busiest hour, from your logs or monitoring. If you don't have traffic yet, estimate, and write down that it's an estimate so nobody mistakes it for a measurement later.

### Wait, Real Users Don't Take Turns

This is the part that's easy to miss.

A VU sends its next request only after the previous one comes back. So when your server slows down, the VUs slow down with it, and fewer requests arrive. The test eases off right when your app is struggling.

Real users don't do that. They keep arriving whether your server is having a good day or not.

![Two timelines. With virtual users, each new request waits for the previous response, so when responses get slow, fewer requests are sent. With a fixed arrival rate, new requests keep coming on schedule, so slow responses pile up and overlap.](/images/writing/will-it-break-in-prod/arrival-rate.webp "Virtual users wait for answers. Real traffic doesn't.")

If your question is "can we handle 100 requests per second?", tell k6 exactly that with an **arrival-rate** executor. It starts new iterations at a fixed rate and brings in more VUs when it needs them:

```js
export const options = {
  scenarios: {
    orders: {
      executor: "ramping-arrival-rate",
      startRate: 10,
      timeUnit: "1s", // rates below are per second
      preAllocatedVUs: 50,
      maxVUs: 500,
      stages: [
        { duration: "3m", target: 100 }, // up to 100 per second
        { duration: "5m", target: 100 }, // hold
        { duration: "3m", target: 300 }, // then push past it
      ],
    },
  },
};
```

The rate counts iterations, so with one request per iteration it's requests per second. If k6 runs out of VUs and can't keep up, it counts the misses in a metric called `dropped_iterations`. If that number isn't zero, the load you asked for isn't the load you got.

### How Do I Read the Results?

The summary k6 prints at the end has a lot of lines. Start with these:

| Metric | What it is | What to look for |
| --- | --- | --- |
| `http_req_duration` | How long each request took | p95 and p99, not the average |
| `http_req_failed` | Share of requests that failed | Anything above zero, and when it started |
| `checks` | How many of your checks passed | Under 100% means wrong answers, not just slow ones |
| `iterations` | How many times your test function ran | Did you send the load you planned? |
| `dropped_iterations` | Iterations k6 couldn't start | Should be zero in arrival-rate tests |

By default the summary shows p90 and p95 but not p99. Add `summaryTrendStats: ["avg", "med", "p(95)", "p(99)", "max"]` to `options` if you want it.

One summary also hides *when* things went wrong. To watch the test while it runs, turn on the web dashboard:

```bash
K6_WEB_DASHBOARD=true k6 run load.js
```

Then open `http://localhost:5665`. To save the same charts as a file, add `K6_WEB_DASHBOARD_EXPORT=report.html`.

What you're looking for is the **knee**: the point where response time stops being flat and starts climbing fast. Errors usually come right after it.

![A line chart of p95 response time against load. The line stays flat as load increases, then bends sharply upward at the knee. Failed requests start appearing just after the knee. A marker just before the knee is labeled as the limit to write down.](/images/writing/will-it-break-in-prod/knee.webp "An illustration of the shape to look for, not real measurements.")

The load right before the knee is your elevator plate. Write it down, with a margin.

### k6 Says It's Slow. But Why?

k6 tells you *that* something got slow. It can't see inside your app to tell you *why*. So while the test runs, watch the server side too:

- database connections in use, and how long requests wait to get one
- CPU and memory on the app server and the database
- garbage collection pauses, if you're on the JVM
- the slow query log

Usually one of these hits its ceiling right at the knee. That's your bottleneck. Fix it, run the same test again, and see whether the knee moves to the right.

### What Can Still Go Wrong?

A load test is only as honest as its setup. A few ways to fool yourself:

- **Your test database is tiny.** A query over a thousand rows is fast. The same query over ten million rows may not be. Test with production-sized data.
- **Every request is the same.** Asking for `/orders/42` a thousand times mostly tests your cache. Load a list of real IDs with `SharedArray` and pick a different one each time.
- **Your laptop is the bottleneck.** If the machine running k6 is at 100% CPU, you're measuring your laptop, not your server.
- **localhost has no network.** Real users are far away. Test against a deployed staging environment when you can.
- **Someone else's API is in the path.** Don't load test your payment provider by accident. Use their sandbox or a mock.
- **Production is not your test lab.** If you really need to test production, plan it with the people who run it, and start small.

### Conclusion

You don't need a big setup to start. A twenty-line script, two thresholds, and an hour of watching graphs will tell you more about your app than another week of guessing.

| Situation | Run this first |
| --- | --- |
| Before the first launch | Smoke, then average load |
| A big day is coming (launch, sale, demo) | Stress and spike |
| The app gets slower after running for days | Soak |
| You need a number for capacity planning | Breakpoint, with an arrival-rate executor |
| On every pull request | A short smoke test with thresholds, in CI |

Find your elevator plate before your users find it for you. And if you have a friend who says "it works on my machine," send them this.
