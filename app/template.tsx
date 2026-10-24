import CurtainReveal from "@/components/CurtainReveal";

// Re-mounts on every route change: the curtain parts and the page fades up like a new reel starting.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CurtainReveal />
      <div className="route-fade">{children}</div>
    </>
  );
}
