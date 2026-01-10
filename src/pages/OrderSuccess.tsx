import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package, Truck, Home, ArrowRight, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

const OrderSuccess = () => {
  const { orderId } = useParams();
  
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  
  const recommendedProducts = products.slice(0, 4);

  const orderSteps = [
    { icon: CheckCircle2, label: "Order Confirmed", active: true, completed: true },
    { icon: Package, label: "Processing", active: true, completed: false },
    { icon: Truck, label: "Shipped", active: false, completed: false },
    { icon: Home, label: "Delivered", active: false, completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6 animate-scale-in">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Your order has been successfully placed and is being processed.
          </p>
          <p className="text-xl font-semibold text-primary">
            Order ID: {orderId}
          </p>
        </div>

        {/* Order Progress */}
        <Card className="max-w-3xl mx-auto mb-12">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              {orderSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative flex-1">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
                    step.completed ? "bg-primary text-primary-foreground" :
                    step.active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-sm font-medium text-center ${
                    step.active ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                  {index < orderSteps.length - 1 && (
                    <div className={`absolute top-6 left-[60%] w-[80%] h-0.5 ${
                      step.completed ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Delivery Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery</span>
                  <span className="font-medium">
                    {estimatedDelivery.toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Method</span>
                  <span className="font-medium">Standard Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking ID</span>
                  <span className="font-medium text-primary">IND{Date.now().toString().slice(-10)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span>Order confirmation email sent</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span>Tracking updates via SMS & email</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span>Easy returns within 30 days</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4 justify-center mb-16">
          <Button asChild variant="outline">
            <Link to="/products">
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Order
          </Button>
        </div>

        <Separator className="max-w-5xl mx-auto mb-12" />

        {/* Recommended Products */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover-lift">
                <Link to={`/products/${product.slug}`}>
                  <div className="aspect-square bg-muted">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-medium line-clamp-2 hover:text-primary">{product.name}</h3>
                  </Link>
                  <p className="text-lg font-bold text-primary mt-2">₹{product.price.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <Card className="gradient-primary text-primary-foreground">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold mb-2">Need Help with Your Order?</h3>
              <p className="opacity-90 mb-4">Our support team is available 24/7 to assist you.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="secondary" asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <a href="https://wa.me/918884162999" target="_blank" rel="noopener noreferrer">
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
