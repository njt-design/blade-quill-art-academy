/** Sticky numbered label used in the left margin of About-style sections. */
export function SidebarLabel({ number, label }: { number?: string; label?: string }) {
  return (
    <div
      className="eyebrow lg:sticky lg:top-28 pt-3"
      style={{ color: "var(--ink-mute)" }}
    >
      {number ? (
        <>
          <span style={{ color: "var(--maroon)", fontFamily: "var(--f-mono)" }}>
            {number}
          </span>
          <br />
        </>
      ) : null}
      {label}
    </div>
  );
}
