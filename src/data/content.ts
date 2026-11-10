// All site copy lives here. Components only render it.

export const site = {
  name: "Sevara Badriddinova",
  role: "Backend software engineer building fintech systems.",
  resume: "/Sevara_Badriddinova_Resume.pdf",
};

export const contact = {
  email: "bsevaraqq@gmail.com",
  linkedin: "https://www.linkedin.com/in/sevarabadriddinova",
  github: "https://github.com/sevara-badriddinova",
};

// The `recent.log` panel in the hero. `short` is the label used on phones.
export type LogEntry = { scope: string; label: string; short?: string; value: string };

export const recentLog: LogEntry[] = [
  { scope: "maya", label: "risk scoring", value: "106 s → 3.3 s" },
  { scope: "maya", label: "score API, load test", short: "score API", value: "7 ms p95" },
  { scope: "mayasoft", label: "transactions / day", short: "txns / day", value: "20,000+" },
  { scope: "jobradar", label: "LLM calls", value: "−97.8%" },
  { scope: "bilimly", label: "daily users", value: "300+" },
];

export type ExperienceItem = {
  handle: string;
  dates: string;
  role: string;
  context: string;
  points?: string[];
  text?: string;
  stack?: string;
};

export const experience: ExperienceItem[] = [
  {
    handle: "maya-software-studio",
    dates: "2026-05 → 2026-08",
    role: "Software Engineering Intern",
    context: "Mayasoft subsidiary building fintech services for banking clients",
    points: [
      "Proposed and built a rule-based merchant risk-scoring service for bank lending decisions, and integrated a teammate’s ML model into it. Now in production, designed for 15,000+ merchants across 35,000+ terminals.",
      "Cut risk-scoring computation from 106 s to 3.3 s by replacing per-merchant SQL queries with a single set-based aggregation, which removed the repeated database scans.",
      "Built Java/Spring Boot REST APIs that serve risk scores with their explanations: 7 ms P95 read and 50 ms P95 write latency in load tests.",
    ],
    stack: "java · spring-boot · sql · rest",
  },
  {
    handle: "mayasoft",
    dates: "2023-02 → 2024-09",
    role: "Software Engineer",
    context: "MARTA SoftPOS, which lets Android phones accept contactless Visa and Mastercard payments",
    points: [
      "Built a transactions dashboard (Spring Boot APIs, React UI) that replaced manual Excel reporting, giving operations staff real-time visibility into 20,000+ daily transactions and tools to investigate and reconcile disputes.",
      "Owned merchant onboarding end to end: document upload and identity verification with validation, state tracking and audit history. Reduced manual review by 40%.",
    ],
    stack: "spring-boot · react · postgresql · aws-s3",
  },
  {
    handle: "gdg-on-campus-usf",
    dates: "2026-07 → now",
    role: "Community Lead",
    context: "Google Developer Groups on Campus, University of South Florida",
    points: [
      "Organize hackathons for 200+ students, coordinating planning and logistics and explaining technical concepts to participants at every experience level.",
    ],
  },
  {
    handle: "usf",
    dates: "2026-12",
    role: "B.S. Computer Science",
    context: "University of South Florida, College of Engineering",
    text: "GPA 3.56 / 4.00. Coursework in data structures and algorithms, database systems, computer architecture and operating systems.",
  },
];

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  tags: string;
  summary: string;
  points?: string[];
  note?: string;
  image: { src: string; file: string; alt: string };
  links: ProjectLink[];
  featured?: boolean;
};

const repo = (name: string) => `https://github.com/sevara-badriddinova/${name}`;

export const projects: Project[] = [
  {
    slug: "jobradar",
    name: "JobRadar",
    featured: true,
    tags: "python · postgresql · claude-api · docker · gcp",
    summary:
      "A job discovery platform, deployed on GCP, that monitors 12,000+ company career boards across 8 hiring platforms.",
    points: [
      "Automated eligibility filtering runs before the Claude matching step, so only eligible postings reach the model. That cut LLM calls by 97.8%.",
      "Ingested 736K+ postings with duplicate detection and job-change tracking. Bounded batches, skipped unchanged snapshots and changed-only writes raised PostgreSQL throughput in production-replica benchmarks.",
    ],
    image: {
      src: "/images/projects/jobradar.webp",
      file: "projects/jobradar/diagram.png",
      alt: "Diagram: career boards are polled into PostgreSQL, which deduplicates postings and tracks changes; new and changed postings pass through a deterministic eligibility filter, and only eligible postings go to Claude for matching. 97.8% fewer LLM calls, 736K+ postings ingested.",
    },
    links: [{ label: "git clone", href: repo("jobradar") }],
  },
  {
    slug: "bilimly",
    name: "Bilimly.ai",
    featured: true,
    tags: "react · spring-boot · postgresql · redis",
    summary:
      "A multilingual AI language-learning platform with Claude-powered tutoring and personalized exercises, used by 300+ people a day.",
    points: [
      "Built the React front end and Spring Boot back end that serve the tutoring and exercises.",
      "Implemented JWT authentication, role-based access control, Redis caching and API rate limiting in Spring Boot.",
    ],
    image: {
      src: "/images/projects/bilimly.webp",
      file: "projects/bilimly/screenshot.png",
      alt: "Bilimly.ai flashcard practice screen with themed topic cards",
    },
    links: [
      { label: "open site", href: "https://bilimly-ai.vercel.app" },
      { label: "git clone", href: repo("bilimly.ai") },
    ],
  },
  {
    slug: "eltunnel",
    name: "Eltunnel",
    featured: true,
    tags: "go · python · websockets · linux",
    summary:
      "A self-hosted HTTP tunnel that exposes local apps at public URLs over persistent WebSocket connections.",
    points: [
      "A Go server and a Python client talk over a custom request/response protocol.",
      "Concurrent requests run on goroutines and channels, with request-ID correlation and thread-safe routing so every response finds its caller.",
    ],
    image: {
      src: "/images/projects/eltunnel.webp",
      file: "projects/eltunnel/diagram.png",
      alt: "Diagram: browser requests go to a Go server with subdomain routing, through a WebSocket tunnel to a Python client, then to the local app on localhost, with responses returning the same way",
    },
    links: [{ label: "git clone", href: repo("eltunnel") }],
  },
  {
    slug: "ratelimiter",
    name: "Distributed Rate Limiter",
    tags: "java · spring-boot · redis · lua",
    summary:
      "A token-bucket rate limiter shared across Spring Boot instances. Redis with atomic Lua scripts makes every allow-or-reject decision consistent.",
    note: "7,500 req/s at 11 ms p95 in k6 load tests",
    image: {
      src: "/images/projects/rate-limiter.webp",
      file: "projects/ratelimiter/diagram.png",
      alt: "Diagram: requests reach Spring Boot instances, which make an atomic token check against a shared Redis and Lua token bucket that refills over time; a request is allowed if a token is available and gets a 429 if the bucket is empty",
    },
    links: [{ label: "git clone", href: repo("ratelimiter") }],
  },
  {
    slug: "search-server",
    name: "Concurrent Search Server",
    tags: "c++17 · stl · multithreading · cmake",
    summary:
      "A C++17 search server built on an inverted index. Mutex-protected shared state lets document updates and queries run at the same time.",
    note: "tested with std::thread under repeated concurrent updates and queries",
    image: {
      src: "/images/projects/search-server.webp",
      file: "projects/search-server/diagram.png",
      alt: "Diagram: document updates and queries both go through mutex-protected access to an inverted index mapping terms to document IDs, which returns search results",
    },
    links: [{ label: "git clone", href: repo("search-server") }],
  },
  {
    slug: "matcha-restock-bot",
    name: "Matcha Restock Bot",
    tags: "python · github-actions · telegram-bot-api",
    summary:
      "Checks Marukyu Koyamaen product pages in parallel and sends a Telegram alert when matcha comes back in stock. If a request fails, the last known inventory stays intact.",
    note: "every 5 min during Japan business hours · state saved between runs",
    image: {
      src: "/images/projects/matcha-restock-bot.webp",
      file: "projects/matcha-restock-bot/diagram.png",
      alt: "Diagram: scheduled GitHub Actions runs check matcha product pages in parallel, compare and save inventory and subscribers to state.json, and send Telegram alerts only when an item is newly back in stock",
    },
    links: [{ label: "git clone", href: repo("marcha-restock-alert") }],
  },
  {
    slug: "stock-data-explorer",
    name: "Stock Data Explorer",
    tags: "c# · .net · winforms",
    summary:
      "A desktop app for exploring historical stock data from OHLCV CSV files, with date-range filtering, candlestick and volume charts, and a table view.",
    note: "dynamic chart scaling · chart and table views",
    image: {
      src: "/images/projects/stock-data-explorer.webp",
      file: "projects/stock-data-explorer/diagram.png",
      alt: "Diagram: an OHLCV CSV file passes through a date-range filter into a desktop window with candlestick and volume charts above a table view",
    },
    links: [{ label: "git clone", href: repo("StockAnalysisProject") }],
  },
];

// Posts without `href` show as "soon". Remove every entry to hide the section and its nav link.
export type Post = {
  title: string;
  excerpt: string;
  tag: string;
  date?: string;
  readTime?: string;
  href?: string;
};

export const posts: Post[] = [
  {
    title: "From 106 seconds to 3.3: one query instead of one per merchant",
    excerpt:
      "The risk-scoring job ran a SQL query per merchant. Rewriting it as a single set-based aggregation removed the repeated scans.",
    tag: "performance",
  },
  {
    title: "Filter before the model: cutting LLM calls by 97.8%",
    excerpt:
      "In JobRadar, deterministic eligibility rules run first, so Claude only sees postings that could actually be a match.",
    tag: "ai-systems",
  },
  {
    title: "Getting every response back to its caller over one WebSocket",
    excerpt:
      "How Eltunnel uses request IDs, goroutines and channels to route concurrent requests through a single tunnel.",
    tag: "concurrency",
  },
];

// Set this once there is a page listing every post.
export const allPostsHref: string | undefined = undefined;

export const about = {
  title: "I like figuring out why something is slow.",
  lead: "Or unreliable, or more complicated than it needs to be. I usually start by following the data, finding the bottleneck and fixing the part that actually matters.",
  more: "Most of my work is backend: databases, payment platforms, distributed systems and developer tools, with a focus on performance and maintainability.",
  photo: {
    src: "/images/boston.webp",
    file: "~/photos/boston.jpg",
    alt: "Sevara on a bridge over the frozen Charles River with the Boston skyline behind her",
  },
};

export const stack: { key: string; value: string }[] = [
  { key: "languages", value: "Java, Python, Go, SQL, TypeScript, JavaScript, C/C++" },
  { key: "backend", value: "Spring Boot, Node.js, React, PostgreSQL, Redis, REST APIs, WebSockets" },
  { key: "cloud", value: "AWS (EC2, S3), GCP, Docker, Linux, GitHub Actions, Maven, k6" },
  { key: "ai", value: "Claude API, LLM integration" },
];
