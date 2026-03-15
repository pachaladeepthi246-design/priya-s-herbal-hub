import { Link } from "react-router-dom";
import { ArrowRight, Target, Heart, Zap, Shield, Star, TrendingUp, Users, Award, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import BMICalculator from "@/components/BMICalculator";
import HeroSlider from "@/components/HeroSlider";
import brandIcon from "@/assets/priya-brand-icon.svg";
import { getFeaturedProducts, getProductsOnSale } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const Index = () => {
  const featuredProducts = getFeaturedProducts(8);
  const saleProducts = getProductsOnSale().slice(0, 4);
  const { addToCart } = useCart();

  const goals = [
    { icon: Target, title: "Healthy Weight", description: "Achieve your ideal weight with our nutrition programs.", link: "/goals/weight" },
    { icon: Zap, title: "Fitness & Performance", description: "Boost athletic performance with sports nutrition.", link: "/goals/fitness" },
    { icon: Heart, title: "Daily Nutrition", description: "Support wellness with essential vitamins.", link: "/goals/nutrition" },
    { icon: Shield, title: "Skin & Body Care", description: "Nourish your skin with herbal products.", link: "/goals/skincare" },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: Award, value: "15+", label: "Years Excellence" },
    { icon: Star, value: "4.9/5", label: "Customer Rating" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Premium Herbal Nutrition & Wellness Products"
        description="Transform your life with PriyaHerbalHub's premium herbal nutrition products. Achieve your health goals with scientifically-formulated supplements, shakes, and wellness solutions."
        canonical="https://priyaherbalhub.com"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PriyaHerbalHub",
          url: "https://priyaherbalhub.com",
          description: "Premium herbal nutrition and wellness products",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://priyaherbalhub.com/products?search={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Navbar />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Achieve Your Goals</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Whatever your wellness journey, we have the support to help you succeed.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal, index) => (
              <Card key={index} className="hover-lift group cursor-pointer">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <goal.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{goal.description}</CardDescription>
                  <Link to={goal.link} className="text-primary font-medium inline-flex items-center group">
                    Learn More <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Our most popular wellness solutions</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/products">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all">
                <Link to={`/products/${product.slug}`}>
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-destructive">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</Badge>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="uppercase text-xs">{product.type}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>}
                  </div>
                  <Button className="w-full mt-3" size="sm" onClick={(e) => { e.preventDefault(); addToCart(product); }}>
                    <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* BMI Calculator Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Calculate Your BMI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Find out your Body Mass Index and get personalized product recommendations.</p>
          </div>
          <BMICalculator />
        </div>
      </section>

      {/* Business CTA */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Wellness Business</h2>
            <p className="text-lg mb-8 opacity-90">Join thousands of distributors building their wellness business with PriyaHerbalHub. Flexible hours, unlimited income potential.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/business">Learn About Opportunity <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
