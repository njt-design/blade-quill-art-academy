/** Sticky numbered label used in the left margin of About-style sections. */
export function SidebarLabel({
  number,
  label,
  numberField,
  labelField,
}: {
  number?: string;
  label?: string;
  numberField?: string;
  labelField?: string;
}) {
  return (
    <div
      className="eyebrow lg:sticky lg:top-28 pt-3"
      style={{ color: "var(--ink-mute)" }}
      data-tina-field={labelField}
    >
      {number ? (
        <>
          <span
            style={{ color: "var(--maroon)", fontFamily: "var(--f-mono)" }}
            data-tina-field={numberField}
          >
            {number}
          </span>
          <br />
        </>
      ) : null}
      {label}
    </div>
  );
}
