export type Category = "document" | "image" | "video" | "xls";

export type FileItem = {
  id: string;
  name: string;
  owner: string;
  type: string;
  category: Category;
  size: string;
  kb: number;
  modified: string;
  /** Hours since last change, used for sorting. */
  age: number;
  folder: string | null;
  favorite: boolean;
  shared: boolean;
  recent: boolean;
  trashed: boolean;
};

export type FolderItem = {
  slug: string;
  name: string;
  files: number;
  size: string;
  tone: 1 | 2 | 3 | 4 | 5;
  favorite: boolean;
  shared: boolean;
  recent: boolean;
  trashed: boolean;
};

export type Member = { name: string; role: string; upload: number; edited: number; used: string; status: "complete" | "steady" | "quiet" };
export type Activity = { who: string; text: string; target: string; tail?: string; date: string };

const file = (id: string, name: string, owner: string, type: string, category: Category, size: string, kb: number, modified: string, age: number, o: Partial<FileItem> = {}): FileItem => ({
  id, name, owner, type, category, size, kb, modified, age, folder: null, favorite: false, shared: false, recent: false, trashed: false, ...o,
});

export const FILES: FileItem[] = [
  file("f1", "Campaign Photo Shoot.jpg", "Craig Lipshutz", "JPEG", "image", "5.2 MB", 5325, "2 hours ago", 2),
  file("f2", "Analysis Book.pdf", "Jaydon Arcand", "PDF", "document", "4.4 MB", 4506, "Yesterday", 24),
  file("f3", "Promo Banner.jpg", "Charlie Vetrov", "JPG", "image", "510 KB", 510, "Yesterday", 26),
  file("f4", "Q4 Slides.pdf", "Gustavo Kenter", "PDF", "document", "1.0 MB", 1024, "Sep 2, 2026", 900),
  file("f5", "Product list 2026.xls", "Terry Botosh", "XLS", "xls", "4.8 MB", 4915, "Mar 9, 2026", 4800),
  file("f6", "Brand Guidelines.pdf", "Craig Lipshutz", "PDF", "document", "1.4 MB", 1434, "3 hrs ago", 3, { folder: "ui-components", favorite: true, shared: true, recent: true }),
  file("f7", "Roadmap 2026.txt", "Jaydon Arcand", "TXT", "document", "540 KB", 540, "2 days ago", 48, { folder: "ui-components", favorite: true, shared: true, recent: true }),
  file("f8", "Product 2026.jpg", "Terry Botosh", "JPG", "image", "4.1 MB", 4198, "8 hrs ago", 8, { folder: "ui-components", favorite: true, shared: true }),
  file("f9", "Cube 2026.jpg", "Gustavo Kenter", "JPG", "image", "4.1 MB", 4198, "8 hrs ago", 9),
  file("f10", "Campaign Assets.xls", "Priya Nair", "XLS", "xls", "200 KB", 200, "3 hrs ago", 3, { folder: "ui-components", favorite: true, shared: true, recent: true }),
  file("f11", "Unsplash.png", "Priya Nair", "PNG", "image", "2.7 MB", 2765, "2 days ago", 49, { folder: "ui-components", favorite: true, shared: true }),
  file("f12", "Change log Q1.txt", "Craig Lipshutz", "TXT", "document", "540 KB", 540, "2 days ago", 50, { recent: true }),
  file("f13", "New Assets.xls", "Charlie Vetrov", "XLS", "xls", "200 KB", 200, "3 hrs ago", 3, { recent: true }),
  file("f14", "Launch Teaser.mp4", "Terry Botosh", "MP4", "video", "48.2 MB", 49357, "4 days ago", 96, { folder: "marketing" }),
  file("f15", "Pitch Recording.mp4", "Jaydon Arcand", "MP4", "video", "120 MB", 122880, "Last week", 170, { folder: "marketing" }),
];

export const TRASHED_FILES: FileItem[] = [
  file("t1", "Campaign Photo Shoot.jpg", "Craig Lipshutz", "JPEG", "image", "5.2 MB", 5325, "Deleted 2 days ago", 48, { trashed: true }),
  file("t2", "Analysis Book.pdf", "Jaydon Arcand", "PDF", "document", "4.4 MB", 4506, "Deleted 3 days ago", 72, { trashed: true }),
  file("t3", "Promo Banner.jpg", "Charlie Vetrov", "JPG", "image", "510 KB", 510, "Deleted 3 days ago", 73, { trashed: true }),
  file("t4", "Q4 Slides.pdf", "Gustavo Kenter", "PDF", "document", "1.0 MB", 1024, "Deleted last week", 170, { trashed: true }),
  file("t5", "Product list 2026.xls", "Terry Botosh", "XLS", "xls", "4.8 MB", 4915, "Deleted last week", 175, { trashed: true }),
];

const folder = (slug: string, name: string, files: number, size: string, tone: FolderItem["tone"], o: Partial<FolderItem> = {}): FolderItem => ({
  slug, name, files, size, tone, favorite: false, shared: true, recent: false, trashed: false, ...o,
});

export const FOLDERS: FolderItem[] = [
  folder("ui-components", "UI Components", 16, "177MB", 1, { favorite: true, recent: true }),
  folder("marketing", "Marketing Collateral", 35, "201MB", 2, { favorite: true, recent: true }),
  folder("design", "Design Resources", 12, "112MB", 3, { favorite: true, recent: true }),
  folder("roadmaps", "Product Roadmaps", 4, "219MB", 4, { favorite: true }),
  folder("onboarding", "Client Onboarding", 2, "189MB", 5, { favorite: true }),
];

export const TRASHED_FOLDERS: FolderItem[] = [
  folder("old-ui", "UI Components", 16, "177MB", 1, { trashed: true }),
  folder("old-marketing", "Marketing Collateral", 35, "201MB", 2, { trashed: true }),
  folder("old-design", "Design Resources", 12, "112MB", 3, { trashed: true }),
];

export const MEMBERS: Member[] = [
  { name: "John Doe", role: "Admin", upload: 48, edited: 12, used: "15.8 GB", status: "complete" },
  { name: "Kierra Franci", role: "Member", upload: 31, edited: 13, used: "12.1 GB", status: "steady" },
  { name: "Emerson Workman", role: "Member", upload: 17, edited: 17, used: "11.4 GB", status: "quiet" },
  { name: "Chance Philips", role: "Member", upload: 7, edited: 10, used: "10.6 GB", status: "complete" },
];

export const ACTIVITY: Activity[] = [
  { who: "Randy Herwitz", text: "uploaded file", target: "Banner_final.ai", date: "May 5, 2026" },
  { who: "Rose Kim", text: "shared", target: "Q1 report_project.xlsx", tail: "with you", date: "May 4, 2026" },
  { who: "You", text: "added", target: "Trip_Blog.mp4", tail: "to your Videos folder", date: "May 3, 2026" },
  { who: "You", text: "removed", target: "Old_Backup.zip", date: "May 2, 2026" },
];

export const STORAGE = {
  usedGb: 80.11,
  totalGb: 100,
  parts: [
    { label: "Document", gb: 28 },
    { label: "Image", gb: 24 },
    { label: "Video", gb: 18 },
    { label: "Audio", gb: 10.11 },
  ],
};

export const NOTIFICATIONS = [
  { id: 1, text: "Rose Kim shared Q1 report_project.xlsx with you", when: "2 hours ago", unread: true },
  { id: 2, text: "Your storage is 80% full", when: "Yesterday", unread: true },
  { id: 3, text: "Randy Herwitz uploaded Banner_final.ai", when: "May 5", unread: false },
];
