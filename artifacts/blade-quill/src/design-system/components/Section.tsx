import type { ReactNode } from "react";

interface Props {
  id: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, title, children }: Props) {
  return (
    <section id={id} className="scroll-mt-20">
      <h1 className="text-3xl md:text-4xl mb-8">{title}</h1>
      <div className="space-y-8">{children}</div>
    </section>
  );
}
