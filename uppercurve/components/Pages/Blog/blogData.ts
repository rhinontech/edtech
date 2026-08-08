export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Tailwind classes for the category chip on light backgrounds */
  chip: string;
  /** Tailwind gradient classes for the poster artwork */
  gradient: string;
  dateLabel: string;
  dateISO: string;
  readTime: string;
  content: ContentBlock[];
}

export const blogCategories = [
  "All Articles",
  "Artificial Intelligence",
  "Careers & Interviews",
  "Product & Business",
  "Learning & Growth",
  "Community & Events",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-learn-ai-in-2026",
    title: "How to Learn AI in 2026 Without Drowning",
    excerpt:
      "New models ship weekly and every feed screams 'you're falling behind'. Here's a calmer, more effective way to build real AI skills.",
    category: "Artificial Intelligence",
    chip: "bg-indigo-50 border-indigo-100 text-indigo-600",
    gradient: "bg-gradient-to-br from-indigo-500 via-indigo-700 to-slate-950",
    dateLabel: "Jul 28, 2026",
    dateISO: "2026-07-28",
    readTime: "6 min read",
    content: [
      {
        type: "p",
        text: "The hardest part of learning AI today isn't the math or the tooling — it's the noise. Every week brings a new model, a new framework, and a new thread insisting that everything you learned last month is obsolete. If you try to follow all of it, you'll spend your energy keeping up instead of building up.",
      },
      { type: "h2", text: "Pick one lane and stay in it for a quarter" },
      {
        type: "p",
        text: "Choose a single track — building with LLM APIs, data and automation, or AI-assisted product work — and commit to it for three months. Depth compounds; skimming doesn't. A quarter is long enough to build real projects and short enough to change course if the lane isn't for you.",
      },
      { type: "h2", text: "Build something small every week" },
      {
        type: "p",
        text: "Reading about AI is not learning AI. A weekly build — however small — forces you to touch real constraints: context limits, flaky outputs, latency, cost. Those constraints are the actual curriculum.",
      },
      {
        type: "list",
        items: [
          "Week one: automate one boring task in your own life",
          "Week two: add an AI feature to something you already built",
          "Week three: rebuild someone else's demo from scratch, no copy-paste",
          "Week four: ship one of the three publicly and write down what broke",
        ],
      },
      { type: "h2", text: "Fundamentals outlive frameworks" },
      {
        type: "p",
        text: "Prompting patterns, evaluation habits, knowing when AI is the wrong tool — these transfer across every model generation. The library you learned this month might not survive the year; your judgment will.",
      },
      {
        type: "quote",
        text: "You don't fall behind by missing a model launch. You fall behind by not building.",
      },
    ],
  },
  {
    slug: "your-first-tech-interview",
    title: "Your First Tech Interview: What Actually Matters",
    excerpt:
      "Interviews feel like exams, but they're graded more like conversations. What interviewers actually listen for — and how to practice it.",
    category: "Careers & Interviews",
    chip: "bg-cyan-50 border-cyan-100 text-cyan-600",
    gradient: "bg-gradient-to-br from-cyan-400 via-sky-600 to-slate-950",
    dateLabel: "Jul 14, 2026",
    dateISO: "2026-07-14",
    readTime: "7 min read",
    content: [
      {
        type: "p",
        text: "Most first-time candidates prepare for interviews the way they prepared for college exams: memorize a syllabus, hope the questions match. But interviewers aren't grading recall. They're trying to answer one question — what would it be like to work with you on a real problem?",
      },
      { type: "h2", text: "Thinking out loud beats the right answer" },
      {
        type: "p",
        text: "A candidate who narrates their reasoning, checks assumptions, and recovers from a wrong turn scores higher than one who silently produces a correct answer. Practice verbalizing your thought process on easy problems until it feels natural on hard ones.",
      },
      { type: "h2", text: "Your projects are your best material" },
      {
        type: "p",
        text: "Every project you've built is a bank of stories: a decision you made, a trade-off you weighed, a bug that humbled you. Prepare three of these in detail. Specific beats impressive — a small project you understand deeply outperforms a big one you can't explain.",
      },
      { type: "h2", text: "Questions are part of the interview" },
      {
        type: "list",
        items: [
          "Ask what the team is building this quarter — it shows you think in real work, not titles",
          "Ask how they onboard juniors — it shows you plan to grow deliberately",
          "Skip questions you could answer with one search",
        ],
      },
      {
        type: "quote",
        text: "The interview starts as an exam and ends as a conversation. The sooner you make that switch, the better it goes.",
      },
    ],
  },
  {
    slug: "side-projects-that-get-you-hired",
    title: "Side Projects That Actually Get You Hired",
    excerpt:
      "Not all side projects are equal. The ones that open doors share three traits — and none of them is 'took six months to build'.",
    category: "Careers & Interviews",
    chip: "bg-emerald-50 border-emerald-100 text-emerald-600",
    gradient: "bg-gradient-to-br from-emerald-400 via-teal-600 to-slate-950",
    dateLabel: "Jun 30, 2026",
    dateISO: "2026-06-30",
    readTime: "5 min read",
    content: [
      {
        type: "p",
        text: "Hiring managers see a lot of portfolios. Most are a wall of tutorial clones — the same todo app, the same dashboard, the same dataset. The projects that make someone stop scrolling are different in kind, not in size.",
      },
      { type: "h2", text: "Solve a problem you actually have" },
      {
        type: "p",
        text: "Projects born from real annoyance have texture that tutorials can't fake: weird edge cases, opinionated choices, an obvious answer to 'why did you build this?'. That story is what carries an interview.",
      },
      { type: "h2", text: "Finished and small beats ambitious and abandoned" },
      {
        type: "p",
        text: "A deployed link, a readme that explains the decisions, and one real user — even if that user is you — signals follow-through. An unfinished platform signals the opposite, no matter how grand the vision.",
      },
      { type: "h2", text: "Write about what broke" },
      {
        type: "p",
        text: "A short write-up of what went wrong and what you'd do differently is rarer than the project itself. It demonstrates the skill teams actually hire for: learning from your own work.",
      },
      {
        type: "list",
        items: [
          "Ship one thing end-to-end, however small",
          "Put the decisions and trade-offs in the readme",
          "Share it where people can react to it",
          "Let the next project build on what the last one taught you",
        ],
      },
    ],
  },
  {
    slug: "product-thinking-for-engineers",
    title: "Product Thinking for Engineers",
    excerpt:
      "The engineers who grow fastest aren't just better at code — they're better at knowing which code is worth writing.",
    category: "Product & Business",
    chip: "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-600",
    gradient: "bg-gradient-to-br from-fuchsia-500 via-purple-700 to-slate-950",
    dateLabel: "Jun 12, 2026",
    dateISO: "2026-06-12",
    readTime: "6 min read",
    content: [
      {
        type: "p",
        text: "Early in your career it feels like the job is to build what you're told, well. But the engineers who become indispensable operate one level up: they understand why the thing is being built, who it's for, and what 'working' actually means for the user.",
      },
      { type: "h2", text: "Ask 'what problem does this solve?' before 'how do I build it?'" },
      {
        type: "p",
        text: "Half of all rework comes from building the right solution to the wrong problem. One clarifying conversation before you open the editor is the highest-leverage engineering practice that involves no engineering.",
      },
      { type: "h2", text: "Learn to love the cut list" },
      {
        type: "p",
        text: "Product thinking is mostly subtraction. When you propose removing scope to ship sooner — and can explain what's lost and why it's acceptable — you're doing the job of someone two levels above you.",
      },
      { type: "h2", text: "Sit close to the user" },
      {
        type: "list",
        items: [
          "Watch one real person use what you built — it will change how you build",
          "Read support tickets for your area; they're a free roadmap",
          "Measure one thing per feature that tells you if it mattered",
        ],
      },
      {
        type: "quote",
        text: "Code answers 'how'. Product thinking answers 'whether'. Teams need people fluent in both.",
      },
    ],
  },
  {
    slug: "the-case-for-building-in-public",
    title: "The Case for Building in Public",
    excerpt:
      "Sharing work-in-progress feels risky when you're early in your career. It's actually the cheapest career accelerant available.",
    category: "Learning & Growth",
    chip: "bg-amber-50 border-amber-100 text-amber-600",
    gradient: "bg-gradient-to-br from-amber-400 via-orange-600 to-stone-950",
    dateLabel: "May 27, 2026",
    dateISO: "2026-05-27",
    readTime: "5 min read",
    content: [
      {
        type: "p",
        text: "The instinct is to wait — share the project when it's polished, write the post when you're an expert. But waiting optimizes for an audience you don't have yet, and it costs you the compounding benefits of being visible while you learn.",
      },
      { type: "h2", text: "Visibility compounds like interest" },
      {
        type: "p",
        text: "A weekly update on what you're building does three jobs at once: it documents your growth, it makes you findable by people hiring for exactly what you're learning, and it forces the clarity that comes from explaining your work to someone else.",
      },
      { type: "h2", text: "Nobody remembers your rough drafts" },
      {
        type: "p",
        text: "The fear is that early, imperfect work will define you. In practice, feeds move on in hours — but the habit of shipping publicly stays, and the people who found you through it stay too.",
      },
      { type: "h2", text: "Start smaller than feels worthwhile" },
      {
        type: "list",
        items: [
          "One screenshot of what you built this week",
          "One thing that broke and how you fixed it",
          "One question you're stuck on — people love to help",
        ],
      },
      {
        type: "quote",
        text: "Build in public isn't about performing expertise. It's about learning where people can see it.",
      },
    ],
  },
  {
    slug: "lessons-from-48-hour-build-jams",
    title: "What 48-hour Build Jams Teach You That Courses Can't",
    excerpt:
      "Two days, one real brief, a team you just met. Why time-boxed team builds are the fastest growth environment we know.",
    category: "Community & Events",
    chip: "bg-rose-50 border-rose-100 text-rose-600",
    gradient: "bg-gradient-to-br from-rose-400 via-rose-600 to-stone-950",
    dateLabel: "May 8, 2026",
    dateISO: "2026-05-08",
    readTime: "6 min read",
    content: [
      {
        type: "p",
        text: "Courses teach skills in isolation: clean inputs, known outputs, one right answer. Real work is nothing like that — and neither is a build jam. A time-boxed team build compresses a quarter's worth of real-work lessons into a weekend.",
      },
      { type: "h2", text: "Scoping under pressure is the real skill" },
      {
        type: "p",
        text: "With 48 hours on the clock, every team faces the same brutal question: what do we cut? Learning to find the smallest version that still solves the problem is the most transferable skill in tech — and no lecture teaches it like a deadline does.",
      },
      { type: "h2", text: "You learn how you work with strangers" },
      {
        type: "p",
        text: "Working with people you just met surfaces everything: how you divide work, how you disagree, how you handle someone missing a deadline at 2 AM. These are the exact dynamics of a new job — rehearsed in a weekend, with zero career risk.",
      },
      { type: "h2", text: "Demos change your relationship with feedback" },
      {
        type: "p",
        text: "Presenting something unfinished to a room and watching people react is uncomfortable exactly once. After that, feedback stops being scary and starts being fuel — which might be the single biggest unlock for early-career growth.",
      },
      {
        type: "quote",
        text: "The artifact you ship in a jam matters less than the person you are on Monday.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
