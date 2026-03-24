import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContact } from "@workspace/api-client-react";
import { useTina, tinaField } from "tinacms/react";
import contactData from "../../content/contact.json";
const TINA_DATA_CONTACTDATA = { contact: contactData };

const contactQuery = `
  query contact($relativePath: String!) {
    contact(relativePath: $relativePath) {
      pageTitle
      pageDescription
      email
      location
    }
  }
`;

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { mutate: submitContact, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        toast({ title: "Message Sent!", description: "Thank you for reaching out. I'll get back to you soon." });
        reset();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Something went wrong. Please try again later." });
      }
    }
  });

  const { data } = useTina({
    query: contactQuery,
    variables: { relativePath: "contact.json" },
    data: TINA_DATA_CONTACTDATA,
  });

  const content = data.contact;

  const onSubmit = (data: FormValues) => {
    submitContact({ data });
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">

        <div className="mb-10">
          <h1
            className="text-3xl md:text-4xl font-display mb-3"
            data-tina-field={tinaField(content, "pageTitle")}
          >
            {content?.pageTitle}
          </h1>
          <p
            className="text-muted-foreground"
            data-tina-field={tinaField(content, "pageDescription")}
          >
            {content?.pageDescription}
          </p>
        </div>

        <div className="flex gap-6 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span data-tina-field={tinaField(content, "email")}>{content?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span data-tina-field={tinaField(content, "location")}>{content?.location}</span>
          </div>
        </div>

        <div className="border border-border rounded-lg bg-card p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Name</label>
                <Input
                  {...register("name")}
                  placeholder="Your name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                {...register("message")}
                placeholder="How can I help you?"
                className={`min-h-[140px] ${errors.message ? "border-destructive" : ""}`}
              />
              {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-orange hover:bg-amber text-white" disabled={isPending}>
              {isPending ? "Sending..." : "Send Message"} <Send className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
