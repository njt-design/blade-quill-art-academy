type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
};

export function StickyTwoColumn({
  left,
  right,
  className = "",
  leftClassName = "",
  rightClassName = "",
}: Props) {
  return (
    <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-start ${className}`}>
      <div className={`home-sticky-col ${leftClassName}`}>{left}</div>
      <div className={rightClassName}>{right}</div>
    </div>
  );
}
