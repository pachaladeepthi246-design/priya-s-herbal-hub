# PriyaHerbalHub 🌿

A production-ready herbal nutrition e-commerce platform built with React, Vite, Tailwind CSS, and Supabase.

## 🚀 Features

### Customer Features
- **Product Catalog** - Filterable product listings with categories, search, and sorting
- **Product Details** - Comprehensive product pages with nutrition tables, benefits, and usage guides
- **Shopping Cart** - Persistent cart with localStorage for seamless shopping
- **Wishlist** - Save products for later
- **Product Comparison** - Compare up to 4 products side-by-side
- **BMI Calculator** - Interactive tool with personalized product recommendations
- **Goal-Based Shopping** - Curated product collections for weight, fitness, nutrition, and skincare goals
- **Secure Checkout** - Razorpay integration with UPI, cards, and COD support
- **Order Tracking** - Real-time order status updates

### Business Features
- **Distributor Information** - Business opportunity pages for network marketing
- **WhatsApp Integration** - Floating widget for instant customer support
- **Testimonials** - Customer success stories and reviews

### Admin Features
- **Dashboard** - Overview of users, orders, revenue, and pending reviews
- **Sales Analytics** - Charts and reports for business insights
- **Product Management** - Full CRUD operations for products
- **Order Management** - Update order statuses with automatic email notifications
- **User Management** - Role-based access control (User, Admin, Super Admin)
- **Review Moderation** - Approve or reject customer reviews

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI
- **State Management**: React Context, TanStack Query
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **Payments**: Razorpay
- **Email**: Resend API

## 📁 Project Structure

```
src/
├── assets/           # Images and static assets
├── components/       # Reusable UI components
│   ├── admin/        # Admin-specific components
│   └── ui/           # Shadcn UI components
├── contexts/         # React Context providers
├── data/             # Static product data
├── hooks/            # Custom React hooks
├── integrations/     # Third-party integrations (Supabase)
├── lib/              # Utility functions
├── pages/            # Page components
└── types/            # TypeScript type definitions

supabase/
├── functions/        # Edge functions
│   ├── create-razorpay-order/
│   ├── verify-razorpay-payment/
│   └── send-order-email/
└── config.toml       # Supabase configuration
```

## 🔧 Environment Variables

The `.env` file is auto-configured with Lovable Cloud:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Required Secrets (Configure in Backend)

| Secret Name | Description |
|-------------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret |
| `RESEND_API_KEY` | Resend API key for email notifications |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173)

## 📦 Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profile information |
| `products` | Product catalog |
| `orders` | Customer orders |
| `reviews` | Product reviews |
| `user_roles` | Role-based access control |

### User Roles

- **user** - Default role for customers
- **admin** - Access to admin dashboard
- **super_admin** - Full access including user role management

## 💳 Payment Integration

### Razorpay
- UPI payments (GPay, PhonePe, Paytm)
- Credit/Debit cards
- Net Banking
- Wallets

### Cash on Delivery
- Available for orders under ₹5,000

## 📧 Email Notifications

Email notifications are sent for:
- Order confirmation
- Shipping updates
- Delivery confirmation

Configure the `RESEND_API_KEY` secret to enable email functionality.

## 🔒 Security

- Row Level Security (RLS) on all database tables
- JWT authentication for protected endpoints
- Payment verification with amount matching
- Double-payment prevention
- CORS protection on edge functions

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero slider, featured products, BMI calculator |
| `/products` | Product catalog with filters |
| `/products/:slug` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with payment options |
| `/order-success/:orderId` | Order confirmation |
| `/wishlist` | Saved products |
| `/compare` | Product comparison |
| `/login` | Authentication (login/signup) |
| `/about` | About us |
| `/business` | Distributor/business opportunity |
| `/contact` | Contact form |
| `/resources` | Articles and guides |
| `/testimonials` | Customer testimonials |
| `/goals/:type` | Goal-based product recommendations |
| `/admin` | Admin dashboard (protected) |
| `/faq` | Frequently asked questions |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/refund` | Refund policy |
| `/cookies` | Cookie policy |
| `/disclaimer` | Disclaimer |

## 🚀 Deployment

Click **Publish** in the Lovable editor to deploy instantly.

### Custom Domain

Navigate to Project > Settings > Domains and click Connect Domain.

## 📞 Support

- **WhatsApp**: +91 8884162999
- **Email**: support@priyaherbalhub.com

## 📄 License

This project is proprietary software. All rights reserved.

---

Built with ❤️ using [Lovable](https://lovable.dev)
