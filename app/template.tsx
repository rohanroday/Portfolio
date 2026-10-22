// Re-mounts on every route change, so each page fades up like a new reel starting.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
