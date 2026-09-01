import type { ComponentType } from "react";
import { BlockRenderer } from "@/pages/blocks/BlockRenderer";
import { BLOCK_FIXTURES, ctaBandDarkFixture } from "../../fixtures/blocks";

/**
 * Every page block is rendered through the same `BlockRenderer` the live
 * site uses, fed with the on-palette fixture for its template — so each
 * demo is pixel-identical to a real CMS section.
 */
export function makeBlockDemo(template: string): ComponentType {
  return function BlockFixtureDemo() {
    return (
      <BlockRenderer block={{ _template: template, ...BLOCK_FIXTURES[template] }} />
    );
  };
}

/** CTA Band ships two style variants — show both stacked. */
export function CtaBandBothVariantsDemo() {
  return (
    <div className="space-y-6">
      <BlockRenderer block={{ _template: "ctaBand", ...BLOCK_FIXTURES.ctaBand }} />
      <BlockRenderer block={{ _template: "ctaBand", ...ctaBandDarkFixture }} />
    </div>
  );
}
