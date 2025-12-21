import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  orderId: string;
  type: "confirmation" | "shipped" | "delivered";
  recipientEmail: string;
  recipientName: string;
  orderNumber: string;
  orderTotal: number;
  trackingNumber?: string;
}

const getEmailTemplate = (type: string, data: EmailRequest) => {
  const baseStyles = `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;

  const headerStyles = `
    background: linear-gradient(135deg, #2d8659 0%, #1e5c3d 100%);
    color: white;
    padding: 30px;
    text-align: center;
    border-radius: 8px 8px 0 0;
  `;

  const contentStyles = `
    background: #ffffff;
    padding: 30px;
    border: 1px solid #e5e5e5;
    border-top: none;
  `;

  const footerStyles = `
    background: #f8f9fa;
    padding: 20px;
    text-align: center;
    font-size: 12px;
    color: #666;
    border-radius: 0 0 8px 8px;
  `;

  if (type === "confirmation") {
    return {
      subject: `Order Confirmed - #${data.orderNumber}`,
      html: `
        <div style="${baseStyles}">
          <div style="${headerStyles}">
            <h1 style="margin: 0; font-size: 24px;">Order Confirmed! ✓</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Thank you for your order</p>
          </div>
          <div style="${contentStyles}">
            <p>Hi ${data.recipientName},</p>
            <p>Great news! Your order has been confirmed and is being prepared.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px; color: #2d8659;">Order Details</h3>
              <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${data.orderTotal.toLocaleString()}</p>
            </div>
            
            <p>We'll send you another email once your order ships.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://priyaherbalhub.com/orders" style="
                background: linear-gradient(135deg, #2d8659 0%, #1e5c3d 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              ">Track Your Order</a>
            </div>
          </div>
          <div style="${footerStyles}">
            <p style="margin: 0;">Priya Herbal Hub - Natural Wellness Products</p>
            <p style="margin: 5px 0;">Questions? Contact us at support@priyaherbalhub.com</p>
          </div>
        </div>
      `,
    };
  }

  if (type === "shipped") {
    return {
      subject: `Order Shipped - #${data.orderNumber}`,
      html: `
        <div style="${baseStyles}">
          <div style="${headerStyles}">
            <h1 style="margin: 0; font-size: 24px;">Your Order is On Its Way! 📦</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Shipping update</p>
          </div>
          <div style="${contentStyles}">
            <p>Hi ${data.recipientName},</p>
            <p>Exciting news! Your order has been shipped and is on its way to you.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px; color: #2d8659;">Shipping Details</h3>
              <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
              ${data.trackingNumber ? `<p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> 3-5 business days</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://priyaherbalhub.com/orders" style="
                background: linear-gradient(135deg, #2d8659 0%, #1e5c3d 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              ">Track Package</a>
            </div>
          </div>
          <div style="${footerStyles}">
            <p style="margin: 0;">Priya Herbal Hub - Natural Wellness Products</p>
            <p style="margin: 5px 0;">Questions? Contact us at support@priyaherbalhub.com</p>
          </div>
        </div>
      `,
    };
  }

  // Delivered
  return {
    subject: `Order Delivered - #${data.orderNumber}`,
    html: `
      <div style="${baseStyles}">
        <div style="${headerStyles}">
          <h1 style="margin: 0; font-size: 24px;">Order Delivered! 🎉</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Your package has arrived</p>
        </div>
        <div style="${contentStyles}">
          <p>Hi ${data.recipientName},</p>
          <p>Your order has been delivered! We hope you love your products.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px; color: #2d8659;">Order Summary</h3>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${data.orderTotal.toLocaleString()}</p>
          </div>
          
          <p>We'd love to hear your feedback! Please take a moment to review your purchase.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://priyaherbalhub.com/products" style="
              background: linear-gradient(135deg, #2d8659 0%, #1e5c3d 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            ">Leave a Review</a>
          </div>
        </div>
        <div style="${footerStyles}">
          <p style="margin: 0;">Priya Herbal Hub - Natural Wellness Products</p>
          <p style="margin: 5px 0;">Thank you for choosing us!</p>
        </div>
      </div>
    `,
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    // If no Resend API key, log and return success (silent fail for now)
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - email notification skipped");
      return new Response(
        JSON.stringify({ success: true, message: "Email service not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailData: EmailRequest = await req.json();
    const { type, recipientEmail, recipientName, orderNumber, orderTotal, trackingNumber } = emailData;

    console.log(`Sending ${type} email for order ${orderNumber} to ${recipientEmail}`);

    const template = getEmailTemplate(type, emailData);

    // Use Resend to send email
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Priya Herbal Hub <orders@priyaherbalhub.com>",
        to: [recipientEmail],
        subject: template.subject,
        html: template.html,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, data: emailResult }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
