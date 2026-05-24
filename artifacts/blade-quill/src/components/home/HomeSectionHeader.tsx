import { ArrowRight } from "lucide-react";
import { tinaField } from "tinacms/react";

type TinaContent = Record<string, unknown> | null | undefined;

type Props = {
  content?: TinaContent;
  eyebrow?: string;
  heading: string;
  headingField?: string;
  subheading: string;
  subheadingField?: string;
  viewAllLabel: string;
  viewAllField?: string;
  onViewAll: () => void;
  centered?: boolean;
  showMobileViewAll?: boolean;
};

export function HomeSectionHeader({
  content,
  eyebrow,
  heading,
  headingField = "heading",
  subheading,
  subheadingField = "subheading",
  viewAllLabel,
  viewAllField = "viewAllLabel",
  onViewAll,
  centered = false,
  showMobileViewAll = true,
}: Props) {
  const viewAllButton = (
    <button
      type="button"
      onClick={onViewAll}
      className="home-link text-sm text-muted-foreground hover:text-foreground shrink-0"
      data-tina-field={content ? tinaField(content, viewAllField) : undefined}
    >
      {viewAllLabel} <ArrowRight className="w-3.5 h-3.5" />
    </button>
  );

  return (
    <div className="mb-10 md:mb-14">
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${centered ? "sm:justify-center text-center" : ""}`}
      >
        <div className={centered ? "mx-auto" : ""}>
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-orange mb-2">
              {eyebrow}
            </p>
          )}
          <h2
            className="text-2xl md:text-3xl font-heading mb-1"
            data-tina-field={content ? tinaField(content, headingField) : undefined}
          >
            {heading}
          </h2>
          <p
            className={`text-sm font-subheading text-muted-foreground max-w-xl ${centered ? "mx-auto" : ""}`}
            data-tina-field={content ? tinaField(content, subheadingField) : undefined}
          >
            {subheading}
          </p>
        </div>
        <div className="hidden md:block">{viewAllButton}</div>
      </div>
      {showMobileViewAll && (
        <div className="md:hidden mt-6 flex justify-center">{viewAllButton}</div>
      )}
    </div>
  );
}