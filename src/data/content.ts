export type Project = {
  slug: string;
  name: string;
  kicker: string;
  description: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  github: string;
  live?: string;
  image?: string;
  treatment: "dark-topology" | "dashboard" | "product";
};

export const projects: Project[] = [
  {
    slug: "devtunnel",
    image: "/images/projects/devtunnel.png",
    name: "DevTunnel",
    kicker: "Go · Python · WebSockets · Networking",
    description:
      "A tunneling tool that forwards requests to local servers over persistent WebSocket connections. It handles concurrent requests and routes each one to the right client by subdomain.",
    stack: ["Go", "Python", "WebSockets", "HTTP"],
    metrics: [
      { label: "Avg. forwarding latency", value: "~7 ms" },
      { label: "Routing", value: "Subdomain-based" },
      { label: "Concurrency model", value: "Goroutines + channels" },
    ],
    github: "https://github.com/sevara-badriddinova/eltunnel",
    treatment: "dark-topology",
  },
  {
    slug: "rate-limiter",
    image: "/images/projects/rate-limiter.png",
    name: "Distributed Rate Limiter",
    kicker: "Java · Spring Boot · Redis · Lua · Kubernetes",
    description:
      "A distributed token-bucket rate limiter using Redis and atomic Lua execution, load-tested for high-throughput traffic and horizontal scaling.",
    stack: ["Java", "Spring Boot", "Redis", "Lua", "Docker", "Kubernetes", "Prometheus", "Grafana", "k6"],
    metrics: [
      { label: "Sustained throughput", value: "7,500 req/s" },
      { label: "P95 latency", value: "11 ms" },
      { label: "HPA scaling", value: "2 → 6 pods" },
    ],
    github: "https://github.com/sevara-badriddinova/ratelimiter",
    treatment: "dashboard",
  },
  {
    slug: "bilimly",
    image: "/images/projects/bilimly.png",
    name: "Bilimly.ai",
    kicker: "React · Spring Boot · PostgreSQL · Redis",
    description:
      "An AI tutoring platform for learning in multiple languages. I built JWT authentication and role-based access, and added two layers of Redis caching to cut repeated model calls.",
    stack: ["React", "TypeScript", "Spring Boot", "PostgreSQL", "Redis", "Claude API"],
    metrics: [
      { label: "Daily active users", value: "300+" },
      { label: "Fewer repeated LLM calls", value: "~60%" },
      { label: "Auth", value: "JWT · role-based" },
    ],
    github: "https://github.com/sevara-badriddinova/bilimly.ai",
    live: "https://sevara-badriddinova.vercel.app",
    treatment: "product",
  },
  {
    slug: "concurrent-search-server",
    image: "/images/projects/concurrent-search-server.png",
    name: "Concurrent Search Server",
    kicker: "C++ · STL · Multithreading · CMake",
    description:
      "Built a C++17 search server with an inverted index and mutex-protected shared state for concurrent document updates and queries. Tested synchronization with std::thread and CMake under repeated multithreaded operations.",
    stack: ["C++17", "Linux", "STL", "Multithreading", "CMake"],
    metrics: [
      { label: "Indexing model", value: "Inverted index" },
      { label: "Ranking", value: "Term frequency" },
      { label: "Concurrency", value: "Mutex-protected" },
    ],
    github: "https://github.com/sevara-badriddinova/search-server",
    treatment: "dark-topology",
  },
  {
    slug: "matcha-restock-alert",
    image: "/images/projects/matcha-restock-alert.png",
    name: "Matcha Restock Alert",
    kicker: "Python · BeautifulSoup · Requests · Telegram Bot API · GitHub Actions",
    description:
      "A bot that checks Marukyu Koyamaen for restocks and sends alerts on Telegram. It runs on GitHub Actions, checks products in parallel, and saves inventory and subscriber data between runs. If a request fails, it keeps the last known inventory intact.",
    stack: ["Python", "BeautifulSoup", "Requests", "Telegram Bot API", "GitHub Actions"],
    metrics: [
      { label: "Schedule", value: "GitHub Actions" },
      { label: "Checks", value: "Parallel pages" },
      { label: "Alerts", value: "Telegram" },
    ],
    github: "https://github.com/sevara-badriddinova/marcha-restock-alert",
    treatment: "dashboard",
  },
  {
    slug: "stock-market-visualizer",
    image: "/images/projects/stock-market-visualizer.png",
    name: "Stock Market Visualizer",
    kicker: "C# · .NET · WinForms · Data Visualization",
    description:
      "Built a desktop application for exploring historical stock data from OHLCV CSV files. Added date-range filtering, candlestick and volume visualization, dynamic chart scaling, and tabular views to make price movements and trading activity easier to inspect.",
    stack: ["C#", ".NET", "WinForms", "Data Visualization"],
    metrics: [
      { label: "Input", value: "OHLCV CSV" },
      { label: "Charts", value: "Candlestick" },
      { label: "Views", value: "Chart + table" },
    ],
    github: "https://github.com/sevara-badriddinova/StockAnalysisProject",
    treatment: "product",
  },
];

export type ExperienceItem = {
  org: string;
  role: string;
  context: string;
  date: string;
  stack: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    org: "Maya Software Studio",
    role: "Software Engineering Intern",
    context: "Subsidiary of Mayasoft, building fintech services for banking clients",
    date: "May 2026 — Aug 2026",
    stack: "Java · Python · Spring Boot · SQL · PostgreSQL",
    highlights: [
      "Proposed and built a risk-decisioning system letting partner banks evaluate merchant loans without direct access to internal data, across 35,000+ terminals and 15,000+ merchants",
      "Reduced the time needed for bank lending decisions from 7–10 business days to minutes",
      "Optimized the risk-scoring pipeline and REST APIs, reducing computation from 106s to 3s and query latency to 5–7ms P95",
    ],
  },
  {
    org: "Mayasoft — MARTA SoftPOS",
    role: "Software Engineer",
    context: "Platform enabling Android devices to accept Visa/Mastercard payments",
    date: "Feb 2023 — Sep 2024",
    stack: "React · Spring Boot · PostgreSQL · AWS S3",
    highlights: [
      "Built a centralized transactions dashboard giving real-time visibility into 20,000+ daily transactions, replacing manual Excel reporting",
      "Owned merchant onboarding end to end: document upload, identity verification, state tracking and audit history, cutting manual review by 40%",
    ],
  },
  {
    org: "Google Developer Student Group, USF",
    role: "Community Lead",
    context: "Student technical community",
    date: "Jul 2026 — Present",
    stack: "Leadership · Technical communication",
    highlights: [
      "Led events for 200+ students, including hackathons and technical workshops",
      "Worked with the leadership board to explain engineering concepts to students with different levels of technical experience",
    ],
  },
  {
    org: "University of South Florida",
    role: "IT Student Technician / AV Technician",
    context: "Campus technology infrastructure",
    date: "May 2023 — Present",
    stack: "Hardware · Networking · Support",
    highlights: [
      "Supported technology infrastructure across 800+ university rooms",
      "Reduced downtime by roughly 40% through proactive maintenance",
    ],
  },
];

export const skillGroups = [
  { name: "Languages", color: "pink", skills: ["Java", "Python", "Go", "C", "C++17", "C#", "JavaScript", "TypeScript", "SQL", "Lua"] },
  { name: "Backend & APIs", color: "yellow", skills: ["Spring Boot", ".NET", "REST APIs", "WebSockets", "HTTP", "Microservices", "JWT", "RBAC", "Rate Limiting", "Caching", "PostgreSQL", "Redis"] },
  { name: "Cloud & Infrastructure", color: "mint", skills: ["AWS", "AWS S3", "Docker", "Kubernetes", "Kubernetes HPA", "Linux"] },
  { name: "Tools & Delivery", color: "blue", skills: ["Git", "GitHub", "GitHub Actions", "CI/CD", "Maven", "CMake", "Jira"] },
];

export const education = {
  school: "University of South Florida",
  degree: "B.S. Computer Science",
  graduation: "December 2026",
  coursework: ["Distributed Systems", "Operating Systems", "Computer Networks", "Databases", "Computer Architecture", "Algorithms"],
};

export const contact = {
  email: "bsevaraqq@gmail.com",
  linkedin: "https://www.linkedin.com/in/sevarabadriddinova",
  github: "https://github.com/sevara-badriddinova",
};
