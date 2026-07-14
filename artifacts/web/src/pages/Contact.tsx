import { Mail, MessageCircle, MapPin, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContactMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contactSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: "", lastName: "", email: "", subject: "", message: "" },
  });
  
  const submitMessage = useSubmitContactMessage();

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    submitMessage.mutate(
      { data },
      {
        onSuccess: () => {
          toast({ title: "Message dispatched", description: "We will respond shortly." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Dispatch failed", description: "Please try again or email us directly.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-background pt-24 pb-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-md text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Contact Us</h1>
          <p className="text-xl text-muted-foreground font-light">
            Direct communication lines to our engineering and support channels.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-5 space-y-12">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-8">Channels</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="p-3 border border-border bg-background mr-4">
                      <Mail className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-sm uppercase tracking-wider mb-1">Email Protocol</p>
                      <p className="text-muted-foreground text-sm font-mono">info@nexusweb.co.in</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-3 border border-border bg-background mr-4">
                      <MessageCircle className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-sm uppercase tracking-wider mb-1">Community Discord</p>
                      <a href="https://discord.gg/3yp8MMwJe" className="text-sm font-mono text-primary hover:underline">Join Server</a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-3 border border-border bg-background mr-4">
                      <MapPin className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-sm uppercase tracking-wider mb-1">Location</p>
                      <p className="text-muted-foreground text-sm">India<br/>Global operations.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="border border-border bg-background p-8 lg:p-10">
                <h3 className="text-xl font-bold tracking-tight mb-8">Dispatch Message</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">First Name</FormLabel>
                          <FormControl><Input {...field} className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Last Name</FormLabel>
                          <FormControl><Input {...field} className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Email Address</FormLabel>
                        <FormControl><Input type="email" {...field} className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Subject</FormLabel>
                        <FormControl><Input {...field} className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Payload</FormLabel>
                        <FormControl><Textarea rows={5} {...field} className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground resize-none" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={submitMessage.isPending} className="w-full rounded-none h-12 text-base font-medium mt-4">
                      {submitMessage.isPending ? "Transmitting..." : "Send Payload"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}