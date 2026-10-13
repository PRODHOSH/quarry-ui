import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-normal text-muted-foreground">404</p>
      <h1 className="mt-3 text-5xl font-medium tracking-[-0.03em]">Page not found</h1>
      <p className="mt-4 max-w-sm font-normal text-muted-foreground">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/components"
        className="mt-8 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Browse components
      </Link>
    </main>
  );
}
