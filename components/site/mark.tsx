/** The accent word in a title: plain brand blue, no highlight behind it. */
export function Mark({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}
