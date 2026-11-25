import { useState, type ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation, useSearchParams } from "wouter";
import { BookOpen, Download, Send } from "lucide-react";
import { tinaField } from "tinacms/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContact } from "@workspace/api-client-react";
import { trackDummyBookDownload, trackDummyBookRequest } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { type Block } from "./block-utils";
import {
  DEFAULT_MESSAGE as DUMMY_BOOK_DEFAULT_MESSAGE,
  formSchema as publisherSchema,
  type FormValues as PublisherValues,
} from "./DummyBookRequestBlock";

/** 30-page Lheeloo & Luna picture-book dummy offered on the Publishers tab. */
const DUMMY_BOOK_PDF_URL = "/images/Dummy-BOOK_30-pages-PDF_Sept-2026-(8.5-x-11-in).pdf";
const DUMMY_BOOK_DOWNLOAD_NAME = "Lheeloo-and-Luna-30-page-dummy-book.pdf";

const generalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type GeneralValues = z.infer<typeof generalSchema>;

const TABS = ["general", "publishers"] as const;
type ContactTab = (typeof TABS)[number];

function parseTab(value: string | null): ContactTab {
  return TABS.find((t) => t === value) ?? "general";
}

interface Props {
  block: Block;
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: FieldError;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

/** Props for an input wired to FormField's error message. */
function fieldA11y(id: string, error?: FieldError) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: error ? "border-destructive" : "",
  };
}

function SubmitButton({ block, isPending }: { block: Block; isPending: boolean }) {
  const submitLabel = (block.submitLabel as string) || "Send Message";
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isPending}
      data-tina-field={tinaField(block, "submitLabel")}
    >
      {isPending ? "Sending..." : submitLabel} <Send className="w-4 h-4 ml-2" />
    </Button>
  );
}

function useContactMutation(onSuccess?: () => void) {
  const { toast } = useToast();
  return useSubmitContact({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        onSuccess?.();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      },
    },
  });
}

function GeneralForm({ block }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GeneralValues>({ resolver: zodResolver(generalSchema) });
  const { mutate: submitContact, isPending } = useContactMutation(() => reset());

  return (
    <form
      onSubmit={handleSubmit((data) => submitContact({ data }))}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField id="contact-name" label="Name" error={errors.name}>
          <Input
            {...register("name")}
            {...fieldA11y("contact-name", errors.name)}
            placeholder="Your name"
          />
        </FormField>
        <FormField id="contact-email" label="Email" error={errors.email}>
          <Input
            {...register("email")}
            {...fieldA11y("contact-email", errors.email)}
            type="email"
            placeholder="your@email.com"
          />
        </FormField>
      </div>
      <FormField id="contact-message" label="Message" error={errors.message}>
        <Textarea
          {...register("message")}
          {...fieldA11y("contact-message", errors.message)}
          placeholder="How can I help you?"
          className={cn("min-h-[140px]", errors.message && "border-destructive")}
        />
      </FormField>
      <SubmitButton block={block} isPending={isPending} />
    </form>
  );
}

/** Revealed only after a publisher submits the request form. */
function DummyBookUnlocked() {
  return (
    <div className="py-4 text-center" role="status">
      <span
        className="mx-auto mb-4 grid place-items-center rounded-full"
        style={{ width: 56, height: 56, background: "var(--g-cta)" }}
        aria-hidden
      >
        <BookOpen className="w-7 h-7" style={{ color: "var(--paper)" }} />
      </span>
      <h3 className="text-xl font-sans mb-2">Thank you — the PDF is ready</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Your request has been sent to Corinne. In the meantime, the full 30-page
        PDF is available below.
      </p>
      <a
        href={DUMMY_BOOK_PDF_URL}
        download={DUMMY_BOOK_DOWNLOAD_NAME}
        onClick={() => trackDummyBookDownload("contact_publishers_tab")}
        className={buttonVariants({
          size: "lg",
          className: "inline-flex items-center justify-center gap-2",
        })}
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden />
        Download the 30-page PDF
      </a>
    </div>
  );
}

/**
 * Same flow as the Publishers page's DummyBookRequestBlock: the dummy book
 * download unlocks only after the request (and Corinne's email) goes through.
 */
function PublisherForm() {
  const { toast } = useToast();
  const [unlocked, setUnlocked] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublisherValues>({ resolver: zodResolver(publisherSchema) });
  const { mutate: submitContact, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        trackDummyBookRequest();
        setUnlocked(true);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      },
    },
  });

  if (unlocked) return <DummyBookUnlocked />;

  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground">
        Publishers and literary agents: fill in your details and the complete
        30-page dummy of Lheeloo &amp; Luna unlocks for professional review.
        Corinne is notified of every request and will follow up personally.
      </p>
      <form
        onSubmit={handleSubmit((data) =>
          submitContact({
            data: {
              name: data.name,
              email: data.email,
              company: data.company,
              intent: "dummy-book",
              message: data.message?.trim() ? data.message.trim() : DUMMY_BOOK_DEFAULT_MESSAGE,
            },
          })
        )}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField id="publisher-name" label="Name" error={errors.name}>
            <Input
              {...register("name")}
              {...fieldA11y("publisher-name", errors.name)}
              placeholder="Your name"
            />
          </FormField>
          <FormField id="publisher-email" label="Email" error={errors.email}>
            <Input
              {...register("email")}
              {...fieldA11y("publisher-email", errors.email)}
              type="email"
              placeholder="you@publisher.com"
            />
          </FormField>
        </div>
        <FormField id="publisher-company" label="Publisher / Agency" error={errors.company}>
          <Input
            {...register("company")}
            {...fieldA11y("publisher-company", errors.company)}
            placeholder="Publishing house or literary agency"
          />
        </FormField>
        <FormField id="publisher-message" label="Note (optional)" error={errors.message}>
          <Textarea
            {...register("message")}
            {...fieldA11y("publisher-message", errors.message)}
            placeholder="Anything you'd like Corinne to know about your interest"
            rows={4}
          />
        </FormField>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending..." : "Request the 30-page PDF"}
          <Download className="w-4 h-4 ml-2" aria-hidden />
        </Button>
      </form>
    </>
  );
}

const triggerClass =
  "py-2 text-sm focus-visible:ring-[var(--maroon)] data-[state=active]:text-foreground";

/**
 * Contact form with Fans & Students / Publishers tabs. The active tab lives in the
 * URL (`/contact?tab=publishers`) so each tab can be linked to directly.
 */
export default function ContactFormBlock({ block }: Props) {
  const [location, navigate] = useLocation();
  const [searchParams] = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));

  const onTabChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "general") next.delete("tab");
    else next.set("tab", value);
    const query = next.toString();
    navigate(query ? `${location}?${query}` : location, { replace: true });
  };

  return (
    <section className="py-4 pb-10" id="contact-form">
      <div className="bq-container">
        <div className="max-w-2xl mx-auto border border-border rounded-lg bg-card p-6 md:p-8">
          <Tabs value={tab} onValueChange={onTabChange}>
            <TabsList aria-label="Who's getting in touch" className="mb-6 grid h-auto w-full grid-cols-2">
              <TabsTrigger value="general" className={triggerClass}>
                Fans &amp; Students
              </TabsTrigger>
              <TabsTrigger value="publishers" className={triggerClass}>
                Publishers
              </TabsTrigger>
            </TabsList>
            {/* forceMount keeps typed input when switching tabs. */}
            <TabsContent
              value="general"
              forceMount
              className="mt-0 data-[state=inactive]:hidden focus-visible:ring-[var(--maroon)]"
            >
              <GeneralForm block={block} />
            </TabsContent>
            <TabsContent
              value="publishers"
              forceMount
              className="mt-0 data-[state=inactive]:hidden focus-visible:ring-[var(--maroon)]"
            >
              <PublisherForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
