# 🍕 Foodied — Frontend Web Application

> **A modern, artisan food ordering and culinary platform featuring interactive dish customization, an AI-powered conversational food assistant, and a full-featured admin management dashboard.**

---

## 🌟 Overview

**Foodied** delivers an elevated dining and food ordering experience. Built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, it combines high-performance single-page architecture with warm, appetizing culinary photography and intuitive user interactions.

Customers can explore handcrafted dishes, customize pizzas and gourmet burgers with real-time price calculations, interact with an AI culinary chatbot, and track orders from the kitchen to their doorstep. Restaurant managers have access to an administrative dashboard for monitoring incoming orders, maintaining menu availability, and analyzing performance.

---

## ✨ Features

### 🍽️ Customer Experience
- **Artisanal Home Experience**: Editorial sections featuring master chefs, farm-fresh ingredients, brand values, customer reviews, and featured chef specials.
- **Interactive Food Customization**: Step-by-step customizer allowing diners to choose crusts, sizes, premium toppings, signature sauces, and extra fillings with instant price recalculation.
- **Dynamic Menu & Filtering**: Browse by category (Pizza, Burgers, Pasta, Desserts, Beverages), search in real time, and view dietary details.
- **Cart & Order Flow**: Multi-item cart drawer with quantity adjustments, custom item breakdown, delivery address capture, and live subtotaling.
- **Customer Account & Tracking**: Manage personal details and track live order status (`PENDING`, `PREPARING`, `READY`, `DELIVERED`, `CANCELLED`).
- **Smooth Navigation & Scroll Restoration**: Automatic scroll-to-top behavior across all user-facing transitions with designated route preservation.

### 🤖 AI-Powered Pizza Chatbot
- **Floating Pizza Assistant**: An animated, branded floating pizza-slice icon pinned at the bottom-right across user-facing pages.
- **Powered by Google Gemini**: Communicates securely via the Foodied backend API (protecting API keys) to recommend menu items, answer dietary questions, and assist with orders.
- **Quick Action Pills**: Suggested prompts for quick culinary recommendations (e.g., *"Recommend a pizza"*, *"Vegetarian options"*, *"Today's specials"*).

### 🔐 Authentication & Security
- **Culinary Split-Screen Architecture**: Redesigned, cohesive Login and Register pages featuring high-resolution kitchen photography, subtle crossfade transitions, and trust badges.
- **Google OAuth 2.0**: Seamless single-click authentication using `@react-oauth/google`.
- **JWT Token Management**: Axios interceptors handle automatic authorization headers and silent access token renewal via refresh tokens.
- **Remember Me & Forgot Password**: Remembered credentials persistence with dedicated accessible password reset modal.

### 🛡️ Admin Management Dashboard
- **Live Incoming Orders**: Real-time order monitoring with order details inspection and one-click status transitions (`PREPARING` → `READY` → `DELIVERED`).
- **Product & Menu Management**: Full CRUD interface for menu items, pricing, availability toggles, and photo uploads.
- **Customer Directory**: View registered customer accounts and order history summaries.
- **Analytics & Settings**: Real-time revenue summaries, order volume metrics, and store preferences.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + [PostCSS](https://postcss.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Routing** | [React Router DOM 7](https://reactrouter.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) with request/response interceptors |
| **Authentication** | [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) |

---

## 📁 Directory Structure

```text
foodied_customizable_food_ordering_website/
├── public/
│   ├── images/               # High-resolution culinary & chef photography
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── admin/            # Admin UI (Sidebar, Topbar, OrderCard, ProductCard, etc.)
│   │   ├── cards/            # Reusable DishCard and item components
│   │   ├── chat/             # PizzaChatbot component and AI message renderer
│   │   ├── common/           # StarRating, FloatingLeaf, ScrollToTop
│   │   ├── layout/           # Public Header, Footer, navigation drawers
│   │   └── sections/         # Home screen sections (Hero, Featured, Chefs, Story, etc.)
│   ├── context/
│   │   ├── AuthContext.tsx   # User state, login, logout, refresh flow
│   │   ├── CartContext.tsx   # Shopping cart state and local persistence
│   │   └── ToastContext.tsx  # Toast alerts (success, error, warning, info)
│   ├── hooks/
│   │   └── useAuth.ts        # Authentication hook
│   ├── pages/
│   │   ├── admin/            # Admin pages (Dashboard, Orders, Products, Customers, Settings)
│   │   ├── CartPage.tsx
│   │   ├── FoodExperiencePage.tsx
│   │   ├── LoginPage.tsx      # Split-screen culinary authentication
│   │   ├── MenuPage.tsx
│   │   ├── MyAccountPage.tsx
│   │   ├── ProductCustomizationPage.tsx
│   │   └── RegisterPage.tsx   # Split-screen culinary registration
│   ├── router/
│   │   ├── AppRoutes.tsx     # Role-based protected routes (<RequiredAuth>)
│   │   └── index.ts
│   ├── screens/
│   │   └── HomeScreen.tsx    # Primary landing page
│   ├── services/
│   │   ├── adminApi.ts       # Admin metrics & product management endpoints
│   │   ├── api.ts            # Core Axios client with smart local/production baseURL
│   │   ├── auth.ts           # Login, register, refresh, and Google auth
│   │   ├── chatApi.ts        # AI chatbot communications
│   │   └── orderApi.ts       # Order placement & history
│   ├── styles/
│   │   └── animations.css    # Subtle CSS keyframes
│   ├── types/
│   │   └── index.ts          # Core TypeScript definitions (User, Product, Order, etc.)
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Running instance of the **Foodied Backend API** (see `../foodied_customizable`)

### 2. Installation
Clone the repository and install dependencies:

```bash
cd foodied_customizable_food_ordering_website
npm install
```

### 3. Environment Configuration
Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
# Backend API Base URL (defaults automatically to http://localhost:3000/api/v1 on localhost)
VITE_API_URL=http://localhost:3000/api/v1

# Google OAuth 2.0 Web Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> **Smart BaseURL**: If `VITE_API_URL` is omitted in local development, the application automatically directs all requests to `http://localhost:3000/api/v1`.

### 4. Running the Development Server
```bash
npm run dev
```
The application will launch at: **`http://localhost:5173`**

### 5. Production Build & Verification
```bash
# Type check and build production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🗺️ Application Routes

### Customer Routes
| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Main landing page with chef specials and brand story |
| `/menu` | Public | Full interactive food catalog with category filters |
| `/customize` | Authenticated | Interactive pizza & burger customizer |
| `/experience` | Public | Sensory food experience showcase |
| `/cart` | Authenticated | Shopping cart, delivery address, and checkout |
| `/account` | Authenticated | User profile, delivery addresses, and order history |
| `/login` | Public | Split-screen culinary sign-in page |
| `/register` | Public | Split-screen culinary sign-up page |

### Admin Routes (`ADMIN` Role Required)
| Route | Access | Description |
| :--- | :--- | :--- |
| `/admin/login` | Public | Administrative login portal |
| `/admin/dashboard` | Admin | Real-time sales statistics and order overviews |
| `/admin/orders` | Admin | Incoming live order tracker and status updater |
| `/admin/recent-orders` | Admin | Historical completed and dispatched orders |
| `/admin/products` | Admin | Product catalog management with image upload |
| `/admin/customers` | Admin | Registered customer directory and account details |
| `/admin/settings` | Admin | Store configuration, tax rates, and operating hours |

---

## 🎨 Design System

- **Primary Accent**: `#F66C01` (Foodied Signature Orange)
- **Hover Accent**: `#E05D00`
- **Dark Neutral**: `#141519` (Culinary Charcoal)
- **Light Neutral**: `#FAF9F6` (Warm Porcelain White)
- **Success / Status**: `#10B981` (Emerald Green)
- **Typography**: Inter / System Sans-Serif with strict font weight hierarchy (Regular, Medium, Semibold, Bold, Extrabold)

---

## 📄 License
This project is developed as part of the IJSE RAD Module Examination. All rights reserved.

