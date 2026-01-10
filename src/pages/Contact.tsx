import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.consent) {
      toast.error("Please agree to receive communications");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: formData,
      });

      if (error) throw error;
      
      toast.success(data.message || "Message sent successfully!");
      setIsSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        consent: false,
      });
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone / WhatsApp",
      details: ["+91 88841 62999"],
      description: "Mon-Sat, 9am-8pm IST",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["pranu21m@gmail.com"],
      description: "24/7 Support",
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["Bangalore", "Karnataka, India"],
      description: "Visit by appointment",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon-Sat: 9am - 8pm IST", "Sunday: 10am - 4pm"],
      description: "All India Delivery",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-lg opacity-90">
              Have questions about our products or business opportunity? We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <info.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                  <p className="text-xs text-primary mt-2">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {isSubmitted ? (
                <Card className="border-primary">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your message has been sent successfully. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <Input 
                        id="firstName" 
                        placeholder="Enter your first name" 
                        value={formData.firstName}
                        onChange={handleChange}
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <Input 
                        id="lastName" 
                        placeholder="Enter your last name" 
                        value={formData.lastName}
                        onChange={handleChange}
                        required 
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="yourname@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input 
                      id="subject" 
                      placeholder="What is this regarding?" 
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mt-1"
                        checked={formData.consent}
                        onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                        required 
                        disabled={isLoading}
                      />
                      <span className="text-sm text-muted-foreground">
                        I agree to receive communications from PriyaHerbalHub about products, services, and business opportunities.
                      </span>
                    </label>
                  </div>

                  <Button type="submit" size="lg" className="w-full btn-glow" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Free Wellness Consultation</CardTitle>
                  <CardDescription>
                    Schedule a complimentary consultation with our wellness experts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our certified nutritionists and wellness consultants are available to help you:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                      <span>Choose the right products for your goals</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                      <span>Create a personalized wellness plan</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                      <span>Learn about business opportunities</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                      <span>Get answers to product questions</span>
                    </li>
                  </ul>
                  <Button className="w-full btn-glow" asChild>
                    <a href="https://wa.me/918884162999?text=Hi%2C%20I%20would%20like%20to%20book%20a%20free%20wellness%20consultation" target="_blank" rel="noopener noreferrer">
                      Book Consultation
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Become a Distributor</CardTitle>
                  <CardDescription>
                    Interested in the business opportunity?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Join thousands of successful distributors building their wellness business. Learn how you can:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                      <span>Earn unlimited income potential</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                      <span>Work flexible hours from anywhere</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                      <span>Access comprehensive training</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                      <span>Join a supportive community</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/business">Learn More</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-medium gradient-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">24/7 Customer Support</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Our dedicated support team is always here to assist you with any questions or concerns.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <a href="mailto:pranu21m@gmail.com" className="text-sm hover:underline">pranu21m@gmail.com</a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;