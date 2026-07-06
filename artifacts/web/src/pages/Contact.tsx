import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, this would send data to an API
  };

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with the engineering team at Nexus Wave Technologies.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
          <div className="grid md:grid-cols-5 gap-12">
            
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  Whether you have a question about the Universal Gateway, need support for Nexus Plus, 
                  or want to discuss enterprise integration, our team is ready to help.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-primary mt-1 mr-4 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-muted-foreground mb-1">Our primary channel for support and inquiries.</p>
                    <a href="mailto:info@nexusweb.co.in" className="text-primary hover:underline font-mono">info@nexusweb.co.in</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary mt-1 mr-4 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-lg">Headquarters</h3>
                    <p className="text-muted-foreground">
                      Nexus Wave Technologies<br />
                      Global Distributed Team
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" aria-hidden="true" />
                    <h3 className="text-2xl font-bold mb-2">Message Received</h3>
                    <p className="text-muted-foreground mb-8">
                      Thank you for contacting Nexus Wave Technologies. An engineer will review your message and respond shortly.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required aria-required="true" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required aria-required="true" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input id="email" type="email" required aria-required="true" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" required aria-required="true" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" rows={5} required aria-required="true" className="resize-none" />
                    </div>
                    
                    <Button type="submit" className="w-full">Send Message</Button>
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      By submitting this form, you agree to our Privacy Policy regarding the processing of your data.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
