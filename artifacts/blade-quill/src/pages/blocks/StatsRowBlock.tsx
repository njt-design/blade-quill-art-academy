import { tinaField } from "tinacms/react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/Reveal";
import { type Block } from "./block-utils";

const STAT_COLORS = ["maroon", "gold-deep", "brown", "taupe"];

interface StatItem {
  value?: string;
  label?: string;
}

interface Props {
  block: Block;
}

export default function StatsRowBlock({ block }: Props) {
  const stats = ((block.stats as StatItem[] | undefined) ?? []).filter(
    (s) => s.value || s.label
  );
  if (stats.length === 0) return null;

  return (
    <section className="py-16 lg:py-20" style={{ background: "var(--paper-2)" }}>
      <div className="bq-container">
        <Reveal>
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-7"
            data-tina-field={tinaField(block, "stats")}
          >
            {stats.map((stat, i) => (
              <div
                key={`${stat.label}-${i}`}
                className={cn(
                  "lg:pl-8",
                  // Divider only when the item isn't first in its row:
                  // 2-col grid on mobile, 4-col from lg up.
                  i % 2 === 1 && "pl-5 border-l border-[rgba(46,34,34,0.1)]",
                  i % 2 === 0 && i > 0 && "lg:border-l lg:border-[rgba(46,34,34,0.1)]"
                )}
              >
                <div
                  className="mb-2.5"
                  style={{
                    fontFamily: "var(--f-serif)",
                    fontSize: "clamp(40px, 5vw, 64px)",
                    lineHeight: 1,
                    color: `var(--${STAT_COLORS[i % STAT_COLORS.length]})`,
                  }}
                >
                  {stat.value}
                </div>
                <div className="eyebrow">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
