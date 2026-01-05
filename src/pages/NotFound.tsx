import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const suggestedLinks = [
    { label: "Browse Products", href: "/products", icon: ShoppingBag },
    { label: "Go Home", href: "/", icon: Home },
    { label: "View Resources", href: "/resources", icon: Search },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted/50 px-4">
        <div className="text-center max-w-lg">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-black text-muted-foreground/10 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <Search className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/products">
                <ShoppingBag className="h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </div>

          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
