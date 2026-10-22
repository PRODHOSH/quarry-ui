export type Kind = "course" | "page" | "assignment" | "quiz" | "path";
export type Status = "not-started" | "in-progress" | "completed" | "overdue" | "failed";

export type Chapter = { id: string; title: string };
export type Section = { id: string; title: string; chapters: Chapter[] };
export type Person = { id: string; name: string; role: string; dept: string };
export type Content = {
  id: string;
  title: string;
  kind: Kind;
  published: boolean;
  tags: string[];
  language: string;
  author: string;
  created: string;
  edited: string;
  description: string;
  points: number;
  hours: number;
  sections: Section[];
  art: number;
  assigned: string[];
  completed: number;
  favorite: boolean;
  archived: boolean;
  project: string;
  trainers: string[];
};
export type Learner = Person & { status: Record<string, Status>; points: number; progress: number; assignedBy: string };
export type Todo = { id: string; title: string; note?: string; due?: string; flag?: "pink" | "blue"; done: boolean };
export type Quiz = { id: string; title: string; questions: number; learner: string };
export type Comment = { id: string; author: string; text: string; at: string };

export const KINDS: { id: Kind; label: string }[] = [
  { id: "course", label: "Course" },
  { id: "page", label: "Page" },
  { id: "assignment", label: "Assignment" },
  { id: "quiz", label: "Quiz" },
  { id: "path", label: "Learning Path" },
];

export const STATUS_LABEL: Record<Status, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
  overdue: "Overdue",
  failed: "Failed",
};

export const PROJECTS = ["Brand Academy", "Northwind Studio"];
export const CATEGORIES = ["UI/UX", "Fundamental", "Prototyping", "Research", "Urgent", "Not Urgent"];

export const PEOPLE: Person[] = [
  { id: "p1", name: "Maya Okafor", role: "Learning Lead", dept: "People" },
  { id: "p2", name: "Daniel Reyes", role: "Senior Designer", dept: "Design" },
  { id: "p3", name: "Priya Raman", role: "Product Manager", dept: "Product" },
  { id: "p4", name: "Tomas Lindqvist", role: "Frontend Engineer", dept: "Eng" },
  { id: "p5", name: "Aiko Tanaka", role: "UX Researcher", dept: "Design" },
  { id: "p6", name: "Hassan Malik", role: "Content Strategist", dept: "Marketing" },
  { id: "p7", name: "Lena Fischer", role: "Support Lead", dept: "Support" },
  { id: "p8", name: "Samuel Boateng", role: "Data Analyst", dept: "Data" },
  { id: "p9", name: "Chloe Martin", role: "Brand Designer", dept: "Design" },
  { id: "p10", name: "Ravi Menon", role: "Operations", dept: "Ops" },
  { id: "p11", name: "Ingrid Solberg", role: "HR Partner", dept: "People" },
  { id: "p12", name: "Jonas Weber", role: "QA Engineer", dept: "Eng" },
];

export const ME = PEOPLE[0];
export const TRAINER_POOL = [PEOPLE[1], PEOPLE[2], PEOPLE[4], PEOPLE[8]];

const sec = (n: string, title: string, chapters: string[]): Section => ({ id: n, title, chapters: chapters.map((c, i) => ({ id: `${n}-${i}`, title: c })) });

export const CONTENT: Content[] = [
  {
    id: "interface-foundations",
    title: "Interface Design Foundations",
    kind: "page",
    published: true,
    tags: ["Usability", "Not Urgent"],
    language: "English",
    author: "Maya Okafor",
    created: "26 Sep 2025",
    edited: "28 Sep 2025",
    description:
      "Discover the foundations of interface and experience design, equipping yourself with the knowledge, tools and methods to create seamless and friendly digital products. This course walks through hierarchy, spacing, feedback and the small decisions that make software feel calm.",
    points: 100,
    hours: 3,
    sections: [
      sec("s1", "Design introduction", ["Components of design", "Chapter 1: Visibility of system status"]),
      sec("s2", "Conducting a heuristic review", ["Choosing what to review", "Scoring severity"]),
      sec("s3", "Final thoughts on interface heuristics", ["Putting it together"]),
    ],
    art: 0,
    assigned: ["p2", "p3", "p5", "p8", "p9"],
    completed: 55,
    favorite: true,
    archived: false,
    project: "Northwind Studio",
    trainers: ["p2", "p3", "p5"],
  },
  {
    id: "mastering-interface-design",
    title: "Mastering Interface Design for Impactful Solutions",
    kind: "course",
    published: true,
    tags: ["UI/UX", "Not Urgent"],
    language: "English",
    author: "Daniel Reyes",
    created: "02 Oct 2025",
    edited: "2h ago",
    description: "A practical course on turning rough ideas into polished interfaces: layout systems, type, colour and the review habits of strong design teams.",
    points: 150,
    hours: 6,
    sections: [sec("s1", "Layout and rhythm", ["Grids that scale", "Spacing tokens"]), sec("s2", "Type and colour", ["Pairing type", "Accessible colour"])],
    art: 1,
    assigned: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12"],
    completed: 50,
    favorite: false,
    archived: false,
    project: "Northwind Studio",
    trainers: ["p2"],
  },
  {
    id: "research-methods",
    title: "User Research Methods in Practice",
    kind: "course",
    published: true,
    tags: ["Research", "Fundamental"],
    language: "English",
    author: "Aiko Tanaka",
    created: "11 Oct 2025",
    edited: "1d ago",
    description: "Interviews, surveys and usability tests, from planning the study to presenting what you found without drowning people in slides.",
    points: 120,
    hours: 4,
    sections: [sec("s1", "Planning a study", ["Choosing a method", "Recruiting well"]), sec("s2", "Running sessions", ["Moderating", "Taking notes"])],
    art: 2,
    assigned: ["p3", "p5", "p7", "p10", "p11"],
    completed: 20,
    favorite: true,
    archived: false,
    project: "Northwind Studio",
    trainers: ["p5"],
  },
  {
    id: "prototyping-basics",
    title: "Prototyping Without the Pain",
    kind: "course",
    published: true,
    tags: ["Prototyping", "Urgent"],
    language: "English",
    author: "Chloe Martin",
    created: "14 Oct 2025",
    edited: "3d ago",
    description: "Build clickable prototypes quickly, test them with real people and decide what to keep.",
    points: 90,
    hours: 3,
    sections: [sec("s1", "Fast prototypes", ["Paper first", "Linking screens"])],
    art: 3,
    assigned: ["p2", "p4", "p9"],
    completed: 33,
    favorite: false,
    archived: false,
    project: "Brand Academy",
    trainers: ["p9"],
  },
  {
    id: "design-system-quiz",
    title: "Design Systems Quiz",
    kind: "quiz",
    published: true,
    tags: ["Fundamental", "UI/UX"],
    language: "English",
    author: "Maya Okafor",
    created: "19 Oct 2025",
    edited: "5d ago",
    description: "Twelve questions on tokens, components and governance.",
    points: 60,
    hours: 1,
    sections: [sec("s1", "Questions", ["Tokens", "Components", "Governance"])],
    art: 1,
    assigned: ["p2", "p3", "p4", "p6"],
    completed: 75,
    favorite: true,
    archived: false,
    project: "Northwind Studio",
    trainers: ["p1"],
  },
  {
    id: "accessibility-assignment",
    title: "Audit a Live Product for Accessibility",
    kind: "assignment",
    published: false,
    tags: ["UI/UX", "Urgent"],
    language: "English",
    author: "Maya Okafor",
    created: "20 Oct 2025",
    edited: "6d ago",
    description: "Pick a product you use daily, audit it against WCAG and write up what you would fix first.",
    points: 80,
    hours: 2,
    sections: [sec("s1", "Brief", ["What to submit"])],
    art: 0,
    assigned: ["p4", "p12"],
    completed: 0,
    favorite: false,
    archived: false,
    project: "Brand Academy",
    trainers: ["p1"],
  },
  {
    id: "onboarding-path",
    title: "New Designer Onboarding Path",
    kind: "path",
    published: true,
    tags: ["Fundamental", "Not Urgent"],
    language: "English",
    author: "Ingrid Solberg",
    created: "21 Oct 2025",
    edited: "1w ago",
    description: "Everything a new designer needs in their first month, in the right order.",
    points: 300,
    hours: 12,
    sections: [sec("s1", "Week one", ["Tools", "Team"]), sec("s2", "Week two", ["Process"])],
    art: 2,
    assigned: ["p9", "p5"],
    completed: 10,
    favorite: false,
    archived: false,
    project: "Brand Academy",
    trainers: ["p11"],
  },
  {
    id: "old-style-guide",
    title: "Legacy Style Guide Walkthrough",
    kind: "page",
    published: true,
    tags: ["Fundamental"],
    language: "English",
    author: "Hassan Malik",
    created: "03 Jan 2025",
    edited: "9mo ago",
    description: "An older walkthrough kept for reference.",
    points: 20,
    hours: 1,
    sections: [sec("s1", "Overview", ["Colour", "Type"])],
    art: 3,
    assigned: [],
    completed: 0,
    favorite: false,
    archived: true,
    project: "Brand Academy",
    trainers: ["p6"],
  },
];

const ST: Status[] = ["completed", "in-progress", "not-started", "overdue", "in-progress", "completed", "failed"];
const learnerStatus = (i: number, id: string): Status => ST[(i + id.length) % ST.length];

export const LEARNERS: Learner[] = PEOPLE.map((p, i) => ({
  ...p,
  status: Object.fromEntries(CONTENT.map((c) => [c.id, learnerStatus(i, c.id)])),
  points: [100, 80, 100, 40, 60, 0, 90, 20, 100, 0, 70, 50][i],
  progress: [100, 80, 100, 40, 60, 0, 90, 20, 100, 0, 70, 50][i],
  assignedBy: ["Maya Okafor", "Ingrid Solberg", "Daniel Reyes"][i % 3],
}));

export const TODOS: Todo[] = [
  { id: "t1", title: "Improve quiz for designers", note: "Needs better questions for new designers", due: "Tomorrow", flag: "pink", done: false },
  { id: "t2", title: "Create assignment for support", note: "New assignment for the support team", flag: "blue", done: false },
  { id: "t3", title: "Create new quiz", due: "Today", done: false },
  { id: "t4", title: "Review last week's completions", due: "Friday", done: false },
];

export const UNGRADED: Quiz[] = [
  { id: "q1", title: "How to be great and good at interface design", questions: 4, learner: "p2" },
  { id: "q2", title: "Applications, tools and plugins to make your work faster", questions: 10, learner: "p5" },
  { id: "q3", title: "Great designers must know the best for their clients", questions: 3, learner: "p9" },
  { id: "q4", title: "Writing research questions that get honest answers", questions: 6, learner: "p3" },
];

export const COMMENTS: Comment[] = [
  { id: "c1", author: "Daniel Reyes", text: "The heuristic section is the clearest I have seen. Could we add a short worked example?", at: "2d ago" },
  { id: "c2", author: "Priya Raman", text: "Added to my team's onboarding already.", at: "1d ago" },
];

export const CHART: Record<string, { label: string; inProgress: number[]; completed: number[] }> = {
  "7": { label: "Last 7 days", inProgress: [6, 14, 11, 4, 9, 5, 7], completed: [2, 5, 4, 9, 4, 7, 6] },
  "30": { label: "Last 30 days", inProgress: [10, 16, 12, 20, 15, 22, 18], completed: [5, 8, 12, 10, 16, 14, 19] },
};

export const byId = <T extends { id: string }>(list: T[], id: string) => list.find((x) => x.id === id);
export const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");

/** Progress and points for one learner on one piece of content, kept consistent with their status. */
export function progressFor(l: Learner, contentId: string): { progress: number; points: number } {
  const st = l.status[contentId];
  const seed = (l.name.length * 7 + contentId.length * 13) % 5;
  const progress = st === "completed" || st === "failed" ? 100 : st === "in-progress" ? 25 + seed * 14 : st === "overdue" ? 10 + seed * 8 : 0;
  const points = st === "completed" ? 100 - seed * 5 : st === "failed" ? 30 + seed * 5 : Math.round(progress * 0.8);
  return { progress, points };
}
