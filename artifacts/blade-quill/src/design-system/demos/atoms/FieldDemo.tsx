import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function FieldDemo() {
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="field-demo-name">Name</FieldLabel>
        <Input id="field-demo-name" placeholder="Corinne" />
        <FieldDescription>Shown on your public profile.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="field-demo-email">Email</FieldLabel>
        <Input id="field-demo-email" type="email" placeholder="you@example.com" />
      </Field>
    </FieldGroup>
  );
}
