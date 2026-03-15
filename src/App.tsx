import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CompareProvider } from "./contexts/CompareContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import ErrorBoundary from "./components/ErrorBoundary";
import PageLoader from "./components/PageLoader";
import WhatsAppWidget from "./components/WhatsAppWidget";
import ProtectedRoute from "./components/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const About = lazy(() => import("./pages/About"));
const Business = lazy(() => import("./pages/Business"));
const Contact = lazy(() => import("./pages/Contact"));
const Resources = lazy(() => import("./pages/Resources"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Compare = lazy(() => import("./pages/Compare"));
const Login = lazy(() => import("./pages/Login"));
const GoalPage = lazy(() => import("./pages/GoalPage"));
const Admin = lazy(() => import("./pages/Admin"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Refund = lazy(() => import("./pages/Refund"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
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
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/:slug" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                          <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
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
                          <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/privacy" element={<Privacy />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/cookies" element={<Cookies />} />
                          <Route path="/refund" element={<Refund />} />
                          <Route path="/disclaimer" element={<Disclaimer />} />
                          <Route path="/distributor-login" element={<Login />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                      <WhatsAppWidget />
                    </BrowserRouter>
                  </ReviewProvider>
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
