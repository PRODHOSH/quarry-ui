export const SITE_NAME = "Quarry UI";
export const SITE_TAGLINE = "Free, open source UI components and templates";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quarry-ui.com";

export const registryUrl = (name: string) => `${SITE_URL}/r/${name}.json`;

export const PACKAGE_MANAGERS = {
  npm: (name: string) => `npx shadcn@latest add ${registryUrl(name)}`,
  pnpm: (name: string) => `pnpm dlx shadcn@latest add ${registryUrl(name)}`,
  yarn: (name: string) => `yarn dlx shadcn@latest add ${registryUrl(name)}`,
  bun: (name: string) => `bunx --bun shadcn@latest add ${registryUrl(name)}`,
} as const;

export type PackageManager = keyof typeof PACKAGE_MANAGERS;

export const SOCIAL = {
  github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com",
  x: process.env.NEXT_PUBLIC_X_URL ?? "https://x.com",
};

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@quarry-ui.com";
