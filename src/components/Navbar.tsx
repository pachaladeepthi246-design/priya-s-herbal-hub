import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, GitCompare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { useAuth } from "@/contexts/AuthContext";
import priyaLogo from "@/assets/priya-logo.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { getCompareCount } = useCompare();
  const { user, isAuthenticated, logout } = useAuth();

  const productsByType = [
    { name: "Shakes & Smoothies", href: "/products?type=shake" },
    { name: "Teas & Beverages", href: "/products?type=tea" },
    { name: "Vitamins & Supplements", href: "/products?type=supplement" },
    { name: "Skin Care", href: "/products?type=skincare" },
    { name: "Body & Hair Care", href: "/products?type=bodycare" },
    { name: "Protein Snacks", href: "/products?type=snack" },
  ];

  const productsByNeed = [
    { name: "Weight Management", href: "/products?category=weight-management" },
    { name: "Sports Nutrition", href: "/products?category=sports" },
    { name: "Daily Nutrition", href: "/products?category=daily-nutrition" },
    { name: "Heart Health", href: "/products?category=heart-health" },
    { name: "Digestive Health", href: "/products?category=digestive" },
    { name: "Energy & Focus", href: "/products?category=energy" },
  ];

  const goals = [
    { name: "Healthy Weight", href: "/goals/weight" },
    { name: "Fitness & Performance", href: "/goals/fitness" },
    { name: "Daily Nutrition & Health", href: "/goals/nutrition" },
    { name: "Skin & Body Care", href: "/goals/skincare" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={priyaLogo} 
              alt="Priya Herbal Hub" 
              className="h-[46px] w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold text-primary hidden sm:inline-block">
              Priya Herbal Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Achieve Your Goals</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {goals.map((item) => (
                        <li key={item.name}>
                          <NavigationMenuLink asChild>
                            <Link to={item.href} className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                              <div className="text-sm font-medium">{item.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] grid-cols-2 gap-4 p-4">
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">By Type</h3>
                        <ul className="space-y-2">
                          {productsByType.map((item) => (
                            <li key={item.name}>
                              <NavigationMenuLink asChild>
                                <Link to={item.href} className="block select-none rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground">{item.name}</Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">By Need</h3>
                        <ul className="space-y-2">
                          {productsByNeed.map((item) => (
                            <li key={item.name}>
                              <NavigationMenuLink asChild>
                                <Link to={item.href} className="block select-none rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground">{item.name}</Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/resources" className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    Resources
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/business" className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    Business
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/about" className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    About
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact" className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            
            {/* Compare */}
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/compare">
                <GitCompare className="h-5 w-5" />
                {getCompareCount() > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getCompareCount()}
                  </Badge>
                )}
              </Link>
            </Button>
            
            {/* Wishlist */}
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {getWishlistCount() > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getWishlistCount()}
                  </Badge>
                )}
              </Link>
            </Button>
            
            {/* Cart */}
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getCartCount()}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="font-medium">{user?.full_name || user?.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/wishlist">My Wishlist</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/faq">FAQ</Link></DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link to="/admin">Admin Dashboard</Link></DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="hidden lg:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
            )}

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 animate-fade-in border-t">
            {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Products" },
              { to: "/goals/weight", label: "Weight Management" },
              { to: "/goals/fitness", label: "Fitness" },
              { to: "/resources", label: "Resources" },
              { to: "/business", label: "Business Opportunity" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "/faq", label: "FAQ" },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 rounded-md hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Button asChild className="w-full mt-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login / Sign Up</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
