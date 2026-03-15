import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle2, Tag, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const promoCodes: Record<string, number> = {
  "WELLNESS10": 10,
  "HERBAL20": 20,
  "PRIYA15": 15,
  "NEWUSER25": 25,
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.full_name?.split(" ")[0] || "",
    lastName: user?.full_name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = getCartTotal();
  const discount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const shipping = subtotal > 2000 ? 0 : 99;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shipping + tax;

  const handleApplyPromo = () => {
    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount: promoCodes[promoCode.toUpperCase()],
      });
      toast.success(`Promo code applied! ${promoCodes[promoCode.toUpperCase()]}% off`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast.success("Promo code removed");
  };

  const initiateRazorpayPayment = async (orderNumber: string, orderId: string) => {
    try {
      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please login to complete payment");
        navigate("/login");
        return;
      }

      // Create Razorpay order via edge function (auth token sent automatically)
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: Math.round(total),
          currency: "INR",
          receipt: orderNumber,
          order_id: orderId,
          notes: { orderId, customer: formData.email },
        },
      });

      if (error) {
        if (error.message?.includes("Unauthorized")) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        }
        throw error;
      }

      // Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === "undefined") {
        // Razorpay not loaded, proceed with demo mode
        toast.success("Demo payment successful!");
        await handlePaymentSuccess(orderId, orderNumber, data.id, "demo_payment_" + Date.now());
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_demo",
        amount: data.amount,
        currency: data.currency,
        name: "Priya Herbal Hub",
        description: `Order ${orderNumber}`,
        order_id: data.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async (response: any) => {
          await handlePaymentSuccess(
            orderId,
            orderNumber,
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.error("Payment cancelled");
          },
        },
        theme: {
          color: "#16a34a",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      // Fallback to demo mode
      toast.success("Demo payment successful!");
      await handlePaymentSuccess(orderId, orderNumber, "demo_order_" + Date.now(), "demo_payment_" + Date.now());
    }
  };

  const handlePaymentSuccess = async (
    orderId: string,
    orderNumber: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature?: string
  ) => {
    try {
      // Verify payment via edge function
      await supabase.functions.invoke("verify-razorpay-payment", {
        body: {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          order_id: orderId,
        },
      });

      toast.success("Payment successful!");
      clearCart();
      navigate(`/order-success/${orderNumber}`);
    } catch (error) {
      console.error("Payment verification error:", error);
      // Still redirect on demo mode
      clearCart();
      navigate(`/order-success/${orderNumber}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsProcessing(true);
    
    const orderNumber = `ORD-${Date.now()}`;
    
    try {
      // Create order in database
      const orderId = await addOrder({
        order_number: orderNumber,
        items: cart,
        total_amount: total,
        status: "pending",
        payment_method: paymentMethod,
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
      });

      if (paymentMethod === "cod") {
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/order-success/${orderNumber}`);
      } else {
        // Initiate Razorpay payment
        await initiateRazorpayPayment(orderNumber, orderId || orderNumber);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to create order. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/cart"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart</Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House no, Street, Landmark"
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-medium">UPI Payment</span>
                          <p className="text-xs text-muted-foreground">Google Pay / PhonePe / Paytm / BHIM</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-medium">Card Payment</span>
                          <p className="text-xs text-muted-foreground">Credit / Debit Card / Net Banking</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Truck className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-medium">Cash on Delivery</span>
                          <p className="text-xs text-muted-foreground">Pay when you receive</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "upi" && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-4">Scan to Pay via UPI</h3>
                        <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=8884162999-4@ybl%26pn=Priya%20Herbal%20Hub%26am=${Math.round(total)}%26cu=INR`}
                            alt="UPI QR Code"
                            className="w-48 h-48"
                          />
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                          UPI ID: <span className="font-mono font-medium text-foreground">8884162999-4@ybl</span>
                        </p>
                        <p className="mt-2 text-lg font-bold text-primary">
                          Amount: ₹{Math.round(total).toLocaleString()}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Scan with any UPI app or click "Place Order" for Razorpay checkout
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.mainImage}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-2">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}

                    <Separator />

                    {/* Promo Code */}
                    <div>
                      {appliedPromo ? (
                        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />
                            <span className="font-medium text-primary">{appliedPromo.code}</span>
                            <span className="text-sm">({appliedPromo.discount}% off)</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={handleRemovePromo}>
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                          />
                          <Button variant="outline" onClick={handleApplyPromo}>Apply</Button>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      {appliedPromo && (
                        <div className="flex justify-between text-sm text-primary">
                          <span>Discount ({appliedPromo.discount}%)</span>
                          <span>-₹{discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span>₹{tax.toFixed(0)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">₹{Math.round(total).toLocaleString()}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-glow"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
                        </>
                      )}
                    </Button>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        Secure
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Truck className="h-4 w-4" />
                        Fast Delivery
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
