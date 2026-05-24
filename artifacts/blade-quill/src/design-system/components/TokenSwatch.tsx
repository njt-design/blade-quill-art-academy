interface Props {
  name: string;
  value: string;
  className?: string;
}

export function TokenSwatch({ name, value, className }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-md border border-border shrink-0 ${className ?? ""}`}
        style={className ? undefined : { backgroundColor: value }}
      />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{value}</p>
      </div>
    </div>
  );
}
