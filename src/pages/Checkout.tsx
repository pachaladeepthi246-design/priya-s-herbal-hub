import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle2, Tag } from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState("card");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderNumber = `ORD-${Date.now()}`;
    
    await addOrder({
      order_number: orderNumber,
      items: cart,
      total_amount: total,
      status: "pending",
    });
    
    clearCart();
    navigate(`/order-success/${orderNumber}`);
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
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Credit / Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                        <span className="text-primary font-bold">UPI</span>
                        Google Pay / PhonePe / Paytm
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Truck className="h-5 w-5 text-primary" />
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg space-y-4">
                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input placeholder="4242 4242 4242 4242" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiry</Label>
                          <Input placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV</Label>
                          <Input placeholder="123" type="password" />
                        </div>
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
                        <span className="text-primary">₹{total.toFixed(0)}</span>
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
                          Place Order
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
