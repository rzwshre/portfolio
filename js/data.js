// All site content. Edit copy here; index.html and export.html both render from it.
const TIERS = { Expert: 4, Strong: 3, Working: 2 };

const SKILLS = [
  { num: "Group 01", title: "Tools", note: "The stack I reach for without looking it up.", items: [
    { name: "Java · Spring Boot", tier: "Expert" },
    { name: "TypeScript / JavaScript", tier: "Expert" },
    { name: "Temporal", tier: "Strong" },
    { name: "React · Next.js · Redux", tier: "Strong" },
    { name: "MongoDB · DocumentDB · PostgreSQL", tier: "Strong" },
    { name: "Node.js · Nest.js", tier: "Strong" },
    { name: "Docker · CI/CD · Linux", tier: "Working" },
    { name: "Python · Bash", tier: "Working" }
  ]},
  { num: "Group 02", title: "Craft", note: "How the work gets done once the stack is decided.", items: [
    { name: "REST API design", tier: "Expert" },
    { name: "Production debugging", tier: "Expert" },
    { name: "Reusable components & shared libraries", tier: "Strong" },
    { name: "Documenting the undocumented", tier: "Strong" },
    { name: "Code review & onboarding others", tier: "Strong" },
    { name: "Distributed system design", tier: "Working" }
  ]},
  { num: "Group 03", title: "Domain", note: "Problem spaces I have already been wrong in, and learned from.", items: [
    { name: "Merchant & POS onboarding", tier: "Expert" },
    { name: "Workflow orchestration", tier: "Strong" },
    { name: "Banking compliance & DR drills", tier: "Strong" },
    { name: "Notification infrastructure", tier: "Strong" },
    { name: "Supply-chain incident response", tier: "Working" }
  ]}
];

const PROJECTS = [
  {
    num: "01", kind: "Platform", year: "2026", title: "Gladius Core",
    teaser: "A chained input validation layer: rules compose instead of copy-paste, and a failure tells you which link broke.",
    tags: ["Validation", "Java", "Developer tooling"],
    summary: "Gladius Core is a chained input validation layer — validators compose end to end, so a request is checked once, in order, with a failure that names the exact link that rejected it.",
    problem: "Validation had grown into the same twelve checks re-implemented per endpoint, each slightly different. Bugs hid in the differences, and error responses told the caller almost nothing useful.",
    bullets: [
      "Designed a chainable validator contract so rules compose in declared order and short-circuit predictably.",
      "Moved endpoint-specific checks into named, reusable links, removing the duplicated per-controller validation.",
      "Made failures self-describing: the response identifies the failing link and the field, not just a 400.",
      "Covered the chain with tests around ordering, short-circuiting and nested payloads."
    ],
    outcome: "One validation path instead of twelve, and error responses a caller can debug against without asking.",
    meta: [["Role", "Design & build"], ["Stack", "Java, Spring Boot"], ["Status", "In progress"], ["Scope", "Platform-wide"]]
  },
  {
    num: "02", kind: "Commerce", year: "2025", title: "Kozi Athletics",
    teaser: "Full Shopify revamp for an athletics brand — storefront rebuilt, theme rewritten, checkout path shortened.",
    tags: ["Shopify", "Liquid", "Frontend"],
    summary: "A complete revamp of the Kozi Athletics Shopify store: a rebuilt storefront and theme, a tightened product taxonomy, and a shorter path from landing to checkout.",
    problem: "The store had accumulated theme edits and apps until page weight and navigation were both working against the sale. Product pages did not present sizing or variants clearly enough to convert.",
    bullets: [
      "Rebuilt the theme layer, cutting unused app blocks and legacy scripts.",
      "Restructured collections and product taxonomy so browsing follows how the brand actually sells.",
      "Rewrote product pages around variants, sizing and imagery.",
      "Shortened the checkout path and cleaned up mobile layout end to end."
    ],
    outcome: "A storefront that loads faster, reads like one brand, and gets people to checkout in fewer taps.",
    meta: [["Role", "Sole developer"], ["Stack", "Shopify, Liquid, JS"], ["Client", "Kozi Athletics"], ["Scope", "Full revamp"]]
  },
  {
    num: "03", kind: "Banking · Kotak", year: "2025 →", title: "POS Onboarding",
    teaser: "One module, owned end to end — design, build, deploy, and the maintenance nobody volunteers for.",
    tags: ["Spring Boot", "Temporal", "Ownership"],
    summary: "Ownership of a full POS onboarding and management module at Kotak Mahindra Bank, from design through deployment and ongoing maintenance.",
    problem: "POS onboarding and management needed to work as one module rather than a set of handoffs, with the operational load that comes with running it in a bank.",
    bullets: [
      "Designed and built the module end to end, including its integration surface with downstream systems.",
      "Carried it through deployment and into steady-state maintenance rather than handing it off.",
      "Kept the operational path documented so on-call is not dependent on me.",
      "Contributed to training incoming engineers on the platform architecture and codebase practices."
    ],
    outcome: "A module with a single owner, a documented runbook and no orphaned corners.",
    meta: [["Role", "SDE II, module owner"], ["Stack", "Java, Spring Boot, React"], ["Period", "Nov 2025 →"], ["Scope", "End to end"]]
  },
  {
    num: "04", kind: "Banking · Kotak", year: "2023–25", title: "Merchant Onboarding, digitised",
    teaser: "Paper-shaped onboarding journeys turned into software, with turnaround time cut by a wide margin.",
    tags: ["Digitisation", "Spring Boot", "React"],
    summary: "Digitisation of existing merchant onboarding processes across the platform, plus the cross-functional components that made the rest of the development lifecycle bearable.",
    problem: "Onboarding journeys were built around manual steps and long waits. Each new journey re-implemented the same plumbing, so delivery slowed with every addition.",
    bullets: [
      "Rebuilt onboarding journeys as software, cutting turnaround time by a large margin.",
      "Built cross-functional components used across journeys to remove repeated plumbing.",
      "Introduced reusable components, shared libraries and better documentation and review practices.",
      "Worked past core development into compliance tasks, CI/CD pipelines, deployment and disaster-recovery drills."
    ],
    outcome: "Faster journeys for merchants, and a codebase the next engineer can extend without archaeology.",
    meta: [["Role", "SDE I"], ["Stack", "Spring Boot, React, MongoDB"], ["Period", "Nov 2023 – Oct 2025"], ["Scope", "Platform"]]
  },
  {
    num: "05", kind: "Product · actyv.ai", year: "2022–23", title: "Process orchestration engine",
    teaser: "Real-time orchestration for client workflows — over 80% off the turnaround time.",
    tags: ["Temporal", "Automation", "Microservices"],
    summary: "A real-time process orchestration system that automated client workflows end to end, reducing turnaround time by more than 80%.",
    problem: "Client workflows moved between teams and systems by hand. Every step was a place to wait, and no one could say where a given case actually was.",
    bullets: [
      "Designed and built the orchestration layer so workflows run as durable, observable processes.",
      "Automated the manual handoffs that had been setting the pace.",
      "Applied design patterns to stabilise the existing services the engine drove.",
      "Worked cross-functionally with product and client teams on the real sequence of steps, not the documented one."
    ],
    outcome: "Turnaround time down by over 80%, and a workflow whose current state you can look up.",
    meta: [["Role", "Associate SDE"], ["Stack", "Node.js, Temporal"], ["Period", "2022 – 2023"], ["Impact", "−80% TAT"]]
  },
  {
    num: "06", kind: "Infrastructure · actyv.ai", year: "2023", title: "Distributed notifications",
    teaser: "One notification system, many microservices, many contexts — built once so nobody rolls their own again.",
    tags: ["Distributed systems", "Node.js", "Platform"],
    summary: "A distributed notification system designed and implemented for use across internal microservices, in a range of contexts, from one shared contract.",
    problem: "Services each needed to notify users and each other, and each was on its way to building a private version of the same thing.",
    bullets: [
      "Designed a single notification contract that multiple microservices could adopt without coupling.",
      "Implemented delivery across the contexts the platform actually needed rather than a generic ideal.",
      "Made the system reusable enough that new services adopt it instead of writing their own.",
      "Worked with leads and an external vendor to remediate identified vulnerabilities in the surrounding code."
    ],
    outcome: "One notification path across the platform, and one place to fix when it misbehaves.",
    meta: [["Role", "Associate SDE"], ["Stack", "Node.js, microservices"], ["Period", "2023"], ["Scope", "Internal platform"]]
  }
];

const TIMELINE = [
  {
    num: "T1", kind: "Education", span: "2018–22", role: "B.E. Computer Science", org: "Chitkara University, Baddi",
    teaser: "Graduated 9.34 CGPA. Hackathons in a three-person team, and a catalogue of personal projects.",
    tags: ["CSE", "9.34 CGPA"],
    summary: "Four years of computer science at Chitkara University, graduating with a 9.34 CGPA — and a side habit of building things outside the syllabus.",
    problem: "Coursework teaches the shape of a problem; it rarely teaches what happens when someone else has to run your code.",
    bullets: [
      "Graduated with a 9.34 CGPA.",
      "Competed in hackathons and events as part of a three-member team.",
      "Led group projects and iterated on solutions against feedback.",
      "Built a catalogue of personal projects, picking the stack per problem rather than per habit."
    ],
    outcome: "A degree, and the habit of finishing side projects that the degree did not require.",
    meta: [["Period", "Aug 2018 – Jul 2022"], ["Place", "Baddi, India"], ["Result", "9.34 CGPA"], ["Type", "Full-time study"]]
  },
  {
    num: "T2", kind: "Full-time", span: "2022–23", role: "Associate SDE", org: "actyv.ai, Bengaluru",
    teaser: "Core platform features, an orchestration engine, a notification system — and technical interviews on the side.",
    tags: ["Full-stack", "MERN", "Temporal"],
    summary: "Nearly two years at actyv.ai in a highly cross-functional environment, owning features that touched the platform's core functionality.",
    problem: "An early-stage platform with several product offerings at once: everything is core, and nothing has been built twice yet.",
    bullets: [
      "Owned features dealing with critical and core platform functionality across multiple product offerings.",
      "Built a real-time orchestration system that cut client workflow turnaround by over 80%.",
      "Designed a distributed notification system used across internal microservices.",
      "Conducted technical interviews for full-stack roles, assessing MERN and system-design fundamentals."
    ],
    outcome: "Two systems still in the platform's spine, and a hiring bar I helped hold.",
    meta: [["Role", "Associate SDE"], ["Period", "Jan 2022 – Nov 2023"], ["Place", "Bengaluru"], ["Stack", "MERN, Temporal"]]
  },
  {
    num: "T3", kind: "Full-time", span: "2023–25", role: "SDE I", org: "Kotak Mahindra Bank, Bengaluru",
    teaser: "Merchant onboarding digitised, the codebase cleaned up, and a six-month-old production bug fixed in week one.",
    tags: ["Spring Boot", "React", "CI/CD"],
    summary: "Two years on Kotak's Merchant Onboarding platform: digitising journeys, building shared components, and taking on the work outside the ticket.",
    problem: "A bank-scale onboarding platform where journeys were manual, the codebase was duplicative, and several processes existed only in people's heads.",
    bullets: [
      "Digitised merchant onboarding journeys, cutting turnaround time by a large margin.",
      "Introduced reusable components, shared libraries and better documentation and review practices.",
      "Took on compliance tasks, CI/CD pipelines and disaster-recovery drills beyond core development.",
      "In week one, tracked down and fixed a production bug in an unrelated critical service that had been affecting users for six months."
    ],
    outcome: "Shorter journeys, a tidier codebase, and written-down processes that used to be tribal knowledge.",
    meta: [["Role", "SDE I"], ["Period", "Nov 2023 – Oct 2025"], ["Place", "Bengaluru"], ["Stack", "Spring Boot, React"]]
  },
  {
    num: "T4", kind: "Full-time · current", span: "2025 →", role: "SDE II", org: "Kotak Mahindra Bank, Bengaluru",
    teaser: "Owning the POS module end to end, and helping pull the platform back through the Shai-Hulud supply-chain attack.",
    tags: ["Module owner", "Incident response", "Mentoring"],
    summary: "Current role: end-to-end ownership of a POS onboarding and management module, incident response, and ramping up new engineers.",
    problem: "A module needs one owner across design, deployment and maintenance — and in late 2025, a supply-chain attack needed a response that did not wait for one.",
    bullets: [
      "Oversee a full POS onboarding and management module from design through deployment and maintenance.",
      "Played a key role in mitigating a major outage and downstream setbacks from the Shai-Hulud supply-chain attack.",
      "Helped restore system stability and reduce the risk of recurrence.",
      "Contributed to new-employee training on platform architecture and codebase practices."
    ],
    outcome: "A module with a clear owner, and an incident that ended sooner than it might have.",
    meta: [["Role", "SDE II"], ["Period", "Nov 2025 →"], ["Place", "Bengaluru"], ["Focus", "POS onboarding"]]
  },
  {
    num: "T5", kind: "Small project", span: "Ongoing", role: "Boring API", org: "devutils · side project",
    teaser: "The unexciting endpoints every project re-writes, in one place. Deliberately boring.",
    tags: ["Side project", "Developer tooling", "API"],
    summary: "Boring API is a devutils side project: the unglamorous endpoints every project ends up re-writing — done once, plainly, and left alone.",
    problem: "Every new project starts by rebuilding the same handful of dull utility endpoints. It is not hard work, it is just work, repeated.",
    bullets: [
      "Collected the utility endpoints that keep getting re-implemented into one small service.",
      "Kept the surface deliberately small and the responses predictable.",
      "Treated documentation as part of the deliverable rather than an afterthought.",
      "Keeps growing only when a real project needs the next endpoint."
    ],
    outcome: "Boring on purpose: something to point at instead of writing it again.",
    meta: [["Type", "Side project"], ["Status", "Ongoing"], ["Role", "Everything"], ["Name", "devutils"]]
  }
];

const NOW = [
  { label: "Learning", title: "Retrieval-Augmented Generation", note: "Working through retrieval, chunking and evaluation properly, rather than by vibes." },
  { label: "Currently working on", title: "Gladius Core", note: "The chained validation layer — getting the failure messages right is most of the work." },
  { label: "Recently shipped", title: "Kozi Athletics revamp", note: "Storefront rebuilt, theme rewritten, checkout path shortened." },
  { label: "Reading", title: "Designing Data-Intensive Applications", note: "Second pass. The chapters land differently once you have been paged at 2am." },
  { label: "Now playing", title: "Long instrumentals, low volume", note: "Anything without lyrics survives a debugging session. Swap this for your real playlist." }
];

const NAV = [
  { num: "01", label: "Skills", href: "#skills", id: "skills" },
  { num: "02", label: "Work", href: "#work", id: "work" },
  { num: "03", label: "Record", href: "#record", id: "record" },
  { num: "04", label: "Currently", href: "#now", id: "now" },
  { num: "05", label: "Gear", href: "#gear", id: "gear" },
  { num: "06", label: "Contact", href: "#contact", id: "contact" }
];

const GEAR = [
  {
    num: "01", role: "Compute", form: "Desktop", name: "Ryzen 5 5600X build",
    specs: [["CPU", "AMD Ryzen 5 5600X"], ["Memory", "32 GB"], ["GPU", "NVIDIA RTX 3060, 12 GB"]],
    note: "The desk box. Anything that wants cores, RAM or VRAM runs here."
  },
  {
    num: "02", role: "Development", form: "2-in-1", name: "ROG Flow Z13",
    specs: [["Memory", "32 GB unified"], ["Form", "Detachable tablet"], ["Use", "Primary dev machine"]],
    note: "Does the day's work and travels without a compromise on memory."
  },
  {
    num: "03", role: "Development", form: "Laptop", name: "MacBook Air M2",
    specs: [["Chip", "Apple M2"], ["Memory", "8 GB"], ["Use", "Light dev, writing, travel"]],
    note: "Eight gigs keeps me honest about how many tabs a task really needs."
  },
  {
    num: "04", role: "Handheld", form: "Portable", name: "Steam Deck",
    specs: [["Class", "Handheld PC"], ["Memory", "16 GB LPDDR5"], ["Use", "Games, and Proton tinkering"]],
    note: "Linux in the hands. Half entertainment, half a reminder that it all runs on Linux."
  }
];

const DESK = [
  { num: "05", label: "Keyboard", name: "TKD Cycle 8", note: "Custom board. The typing surface everything else gets judged against." },
  { num: "06", label: "Pointer", name: "Logitech G502X Hero", note: "Wired, heavy, too many buttons — most of them mapped to something." },
  { num: "07", label: "Audio", name: "KZ Kunten IEMs", note: "In-ears for focus hours. Cheap enough to travel with, good enough to keep." }
];

window.PORTFOLIO = { TIERS, SKILLS, PROJECTS, TIMELINE, NOW, NAV, GEAR, DESK, NOW_UPDATED: "Sept 2026" };
