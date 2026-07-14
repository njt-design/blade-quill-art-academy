import { Reveal } from "@/components/site/Reveal";
import { type Block } from "./block-utils";
import { NewsletterPanel, type NewsletterContent } from "./NewsletterPanel";

interface Props {
  block: Block;
}

export default function NewsletterSignupBlock({ block }: Props) {
  return (
    <section className="py-16 lg:py-20" style={{ background: "var(--paper-2)" }}>
      <div className="bq-container">
        <div className="max-w-[560px] mx-auto">
          <Reveal>
            <NewsletterPanel content={block as NewsletterContent} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
