import { tinaField } from "tinacms/react";
import * as LucideIcons from "lucide-react";

interface FeatureItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface Props {
  block: Record<string, unknown>;
}

function getIcon(name?: string) {
  if (!name) return null;
  const icons = LucideIcons as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[name] ?? null;
}

export default function FeatureGridBlock({ block }: Props) {
  const items = (block.items as FeatureItem[]) ?? [];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        {block.heading && (
          <h2
            className="text-2xl md:text-3xl font-heading mb-8 text-center"
            data-tina-field={tinaField(block, "heading")}
          >
            {block.heading as string}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={i} className="text-center p-6 rounded-lg border border-border/50 bg-card">
                {Icon && <Icon className="w-8 h-8 text-orange mx-auto mb-3" />}
                {item.title && (
                  <h3 className="font-normal mb-2">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
