import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CompareProvider } from "./contexts/CompareContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import About from "./pages/About";
import Business from "./pages/Business";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import ArticleDetail from "./pages/ArticleDetail";
import Testimonials from "./pages/Testimonials";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import GoalPage from "./pages/GoalPage";
import Admin from "./pages/Admin";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Refund from "./pages/Refund";
import Disclaimer from "./pages/Disclaimer";
import WhatsAppWidget from "./components/WhatsAppWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <ReviewProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/business" element={<Business />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/resources/:slug" element={<ArticleDetail />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/goals/:type" element={<GoalPage />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/refund" element={<Refund />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/distributor-login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <WhatsAppWidget />
                </BrowserRouter>
              </ReviewProvider>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
