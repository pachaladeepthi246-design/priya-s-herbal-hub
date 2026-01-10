import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Video, FileText, Podcast, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Resources = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: { email, source: "resources" },
      });

      if (error) throw error;
      
      toast.success(data.message || "Successfully subscribed!");
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const articles = [
    {
      slug: "10-superfoods-boost-immunity",
      category: "Nutrition",
      title: "10 Superfoods to Boost Your Immunity Naturally",
      excerpt: "Discover the power of nature's finest ingredients for a stronger immune system.",
      readTime: "5 min read",
      date: "Nov 25, 2024",
    },
    {
      slug: "sustainable-weight-management",
      category: "Weight Loss",
      title: "The Science Behind Sustainable Weight Management",
      excerpt: "Learn evidence-based strategies for long-term weight loss success.",
      readTime: "8 min read",
      date: "Nov 22, 2024",
    },
    {
      slug: "pre-post-workout-nutrition",
      category: "Fitness",
      title: "Pre and Post-Workout Nutrition Guide",
      excerpt: "Optimize your performance with proper nutrition timing and choices.",
      readTime: "6 min read",
      date: "Nov 20, 2024",
    },
    {
      slug: "managing-stress-holistic-wellness",
      category: "Wellness",
      title: "Managing Stress Through Holistic Wellness",
      excerpt: "Natural approaches to reduce stress and improve mental clarity.",
      readTime: "7 min read",
      date: "Nov 18, 2024",
    },
  ];

  const videos = [
    {
      title: "Getting Started with PriyaHerbalHub Products",
      duration: "12:34",
      views: "15K",
      category: "Tutorial",
    },
    {
      title: "How to Create a Balanced Meal Plan",
      duration: "18:45",
      views: "22K",
      category: "Nutrition",
    },
    {
      title: "Success Stories: Real Transformations",
      duration: "25:15",
      views: "45K",
      category: "Inspiration",
    },
    {
      title: "Building Your Wellness Business",
      duration: "32:10",
      views: "18K",
      category: "Business",
    },
  ];

  const guides = [
    {
      icon: BookOpen,
      title: "Complete Nutrition Guide",
      description: "Comprehensive guide to understanding macros, micros, and meal planning",
      pages: "45 pages",
    },
    {
      icon: FileText,
      title: "Weight Loss Starter Kit",
      description: "Step-by-step plan to kickstart your weight loss journey safely",
      pages: "32 pages",
    },
    {
      icon: FileText,
      title: "Business Success Blueprint",
      description: "Everything you need to build a thriving distributor business",
      pages: "68 pages",
    },
    {
      icon: BookOpen,
      title: "Herbal Wellness Encyclopedia",
      description: "In-depth look at herbs, botanicals, and their health benefits",
      pages: "120 pages",
    },
  ];

  const podcasts = [
    {
      title: "The Wellness Journey Podcast",
      episode: "Ep 24: Breaking Through Weight Loss Plateaus",
      duration: "45 min",
    },
    {
      title: "Nutrition Simplified",
      episode: "Ep 12: Debunking Common Diet Myths",
      duration: "38 min",
    },
    {
      title: "Build Your Business",
      episode: "Ep 8: From Zero to Hero - Success Stories",
      duration: "52 min",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Wellness Resources</h1>
            <p className="text-lg opacity-90">
              Access expert advice, educational content, and tools to support your wellness journey and business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            </TabsList>

            {/* Articles */}
            <TabsContent value="articles" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article, index) => (
                  <Link key={index} to={`/resources/${article.slug}`}>
                    <Card className="hover-lift cursor-pointer group h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{article.date}</span>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">{article.excerpt}</CardDescription>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{article.readTime}</span>
                          <Button variant="ghost" size="sm" className="group-hover:text-primary">
                            Read More <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* Videos */}
            <TabsContent value="videos" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                  <Card key={index} className="hover-lift cursor-pointer group">
                    <div className="aspect-video bg-gradient-accent flex items-center justify-center relative overflow-hidden">
                      <Video className="h-16 w-16 text-primary/40" />
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-smooth"></div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {video.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{video.views} views</span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                        {video.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Guides */}
            <TabsContent value="guides" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((guide, index) => (
                  <Card key={index} className="hover-lift cursor-pointer group">
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-bounce">
                        <guide.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                        {guide.title}
                      </CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{guide.pages}</span>
                        <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                          Download PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Podcasts */}
            <TabsContent value="podcasts" className="space-y-8">
              <div className="max-w-3xl mx-auto space-y-4">
                {podcasts.map((podcast, index) => (
                  <Card key={index} className="hover-lift cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground flex-shrink-0">
                          <Podcast className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-smooth">
                            {podcast.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{podcast.episode}</p>
                          <span className="text-xs text-muted-foreground">{podcast.duration}</span>
                        </div>
                        <Button variant="outline" className="flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                          Listen Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter for weekly wellness tips, product updates, and exclusive content.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <Button size="lg" className="btn-glow" type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;