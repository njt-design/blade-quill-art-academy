import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookOpen, Download, Send } from "lucide-react";
import { tinaField } from "tinacms/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContact } from "@workspace/api-client-react";
import { RichText } from "@/components/site/RichText";
import { trackDummyBookRequest } from "@/lib/analytics";
import { type Block } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

const DEFAULT_PDF_URL =
  "/files/lheeloo-and-luna-bath-time-episode-thursday-dummy-book.pdf";

/** Sent when the requester leaves the note empty (API requires a message). */
const DEFAULT_MESSAGE =
  "Requesting the 30-page PDF of the picture book for professional review.";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().min(2, "Publisher or agency name is required"),
  // Optional, but if filled must meet the API's 10-char minimum (empty → DEFAULT_MESSAGE).
  message: z
    .string()
    .max(5000)
    .optional()
    .refine((value) => !value?.trim() || value.trim().length >= 10, {
      message: "Note must be at least 10 characters, or leave it blank",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  block: Block;
}

/**
 * Publisher-facing request form for the 30-page picture-book dummy.
 * Submits through the shared contact endpoint (intent: "dummy-book") so
 * Corinne gets an email, then reveals the PDF download inline.
 */
export default function DummyBookRequestBlock({ block }: Props) {
  const { toast } = useToast();
  const [unlocked, setUnlocked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

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

  const onSubmit = (data: FormValues) => {
    submitContact({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        intent: "dummy-book",
        message: data.message?.trim() ? data.message.trim() : DEFAULT_MESSAGE,
      },
    });
  };

  const heading = (block.heading as string) || "Request the 30-page PDF";
  const pdfUrl = (block.pdfUrl as string) || DEFAULT_PDF_URL;
  const submitLabel = (block.submitLabel as string) || "Request the 30-page PDF";
  const successHeading =
    (block.successHeading as string) || "Thank you — the PDF is ready";
  const successNote =
    (block.successNote as string) ||
    "Your request has been sent to Corinne. In the meantime, the full 30-page PDF is available below.";
  const downloadLabel = (block.downloadLabel as string) || "Download the 30-page PDF";

  return (
    <section className="py-12 lg:py-16" id="request-dummy">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <div className="text-center mb-8" style={sectionAlignStyle(block)}>
          <SectionHeading
            block={block}
            defaultTag="h2"
            baseSize="clamp(24px, 3vw, 30px)"
            className="font-display mb-3"
          >
            {heading}
          </SectionHeading>
          {block.description ? (
            <div
              className="text-muted-foreground"
              style={bodyTextStyle(block)}
              data-tina-field={tinaField(block, "description")}
            >
              <RichText value={block.description} />
            </div>
          ) : null}
        </div>

        {unlocked ? (
          <div className="border border-border rounded-lg bg-card p-8 text-center">
            <span
              className="mx-auto mb-4 grid place-items-center rounded-full"
              style={{ width: 56, height: 56, background: "var(--g-cta)" }}
            >
              <BookOpen className="w-7 h-7" style={{ color: "var(--paper)" }} />
            </span>
            <h3
              className="text-xl font-sans mb-2"
              data-tina-field={tinaField(block, "successHeading")}
            >
              {successHeading}
            </h3>
            <p
              className="text-sm text-muted-foreground mb-6"
              data-tina-field={tinaField(block, "successNote")}
            >
              {successNote}
            </p>
            <Button asChild size="lg">
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                <span data-tina-field={tinaField(block, "downloadLabel")}>
                  {downloadLabel}
                </span>
              </a>
            </Button>
          </div>
        ) : (
          <div className="border border-border rounded-lg bg-card p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="dummy-name">
                    Name
                  </label>
                  <Input
                    id="dummy-name"
                    {...register("name")}
                    placeholder="Your name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="dummy-email">
                    Email
                  </label>
                  <Input
                    id="dummy-email"
                    type="email"
                    {...register("email")}
                    placeholder="you@publisher.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="dummy-company">
                  Publisher / Agency
                </label>
                <Input
                  id="dummy-company"
                  {...register("company")}
                  placeholder="Publishing house or literary agency"
                  className={errors.company ? "border-destructive" : ""}
                />
                {errors.company && (
                  <p className="text-xs text-destructive">{errors.company.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="dummy-message">
                  Note (optional)
                </label>
                <Textarea
                  id="dummy-message"
                  {...register("message")}
                  placeholder="Anything you'd like Corinne to know about your interest"
                  rows={4}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                <Send className="w-4 h-4 mr-2" />
                <span data-tina-field={tinaField(block, "submitLabel")}>
                  {isPending ? "Sending..." : submitLabel}
                </span>
              </Button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
