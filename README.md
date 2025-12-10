# 🧵 LoomWare - Fabric E-Commerce Platform

<div align="center">

![LoomWare Logo](https://img.shields.io/badge/LoomWare-Fabric%20Commerce-blue?style=for-the-badge)

**A modern, full-featured e-commerce platform for fabric and textile businesses**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=flat-square)](https://loomware-a50ce.web.app/)
[![Server](https://img.shields.io/badge/Server-Vercel-black?style=flat-square)](https://loomware-serverv2.vercel.app/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Payment Integration](#-payment-integration)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## 🎯 Overview

LoomWare is a comprehensive e-commerce solution designed specifically for fabric and textile businesses. It provides a seamless shopping experience for buyers while offering powerful management tools for administrators and managers.

**Live Application:** [https://loomware-a50ce.web.app/](https://loomware-a50ce.web.app/)

**Backend API:** [https://loomware-serverv2.vercel.app/](https://loomware-serverv2.vercel.app/)

---

## ✨ Features

### 🛍️ For Buyers
- **Product Browsing**: Browse extensive fabric catalog with advanced filtering
- **Search & Filter**: Find products by category, price, availability
- **Product Details**: View detailed product information, images, and specifications
- **Shopping Cart**: Add products to cart with quantity management
- **Secure Checkout**: Multiple payment options (Cash on Delivery, Stripe)
- **Order Tracking**: Real-time order status updates
- **Order History**: View past orders and reorder easily
- **User Profile**: Manage personal information and preferences
- **Wishlist**: Save favorite products for later

### 👨‍💼 For Managers
- **Order Management**: View and manage all orders
- **Order Status Updates**: Update order status through production stages
  - Pending → Cutting Completed → Sewing Started → Finishing → QC Checked → Packed → Shipped → Out for Delivery → Delivered
- **Pending Orders**: Review and approve new orders
- **Approved Orders**: Track orders in production
- **Dashboard Analytics**: View sales metrics and statistics

### 🔐 For Administrators
- **User Management**: Approve, suspend, or manage user accounts
- **Product Management**: Add, edit, delete products
- **Inventory Control**: Manage stock levels and availability
- **Role Assignment**: Assign roles (Buyer, Manager, Admin)
- **System Analytics**: Comprehensive business insights
- **Payment Monitoring**: Track payment transactions

### 🔒 Authentication & Security
- **Firebase Authentication**: Email/password and Google Sign-In
- **JWT Tokens**: Secure API authentication
- **Role-Based Access Control**: Protected routes based on user roles
- **Account Approval System**: Admin approval required for new accounts
- **Suspension System**: Suspend users with detailed reasons

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router DOM 6** - Client-side routing
- **Tailwind CSS 3** - Utility-first styling
- **Axios** - HTTP client
- **React Hook Form + Yup** - Form validation
- **React Toastify** - Notifications
- **AOS** - Scroll animations
- **React Icons** - Icon library
- **Recharts** - Data visualization
- **Swiper** - Carousels and sliders
- **React Helmet Async** - SEO management
- **Date-fns** - Date formatting

### Payment & Maps
- **Stripe** - Payment processing
- **React Leaflet** - Interactive maps

### Authentication
- **Firebase** - Authentication and hosting

### Development Tools
- **React Scripts** - Build tooling
- **PostCSS & Autoprefixer** - CSS processing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/loomware-client.git
   cd loomware-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=https://loomware-serverv2.vercel.app/api
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | ✅ |
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID | ✅ |

**⚠️ Security Note:** Never commit `.env` files to version control. Use environment variables in your hosting platform for production.

---

## 📁 Project Structure

```
loomware-client/
├── public/                 # Static files
├── src/
│   ├── components/        # Reusable components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Shared components (Button, Spinner, etc.)
│   │   ├── dashboard/    # Dashboard components
│   │   │   ├── admin/   # Admin-specific components
│   │   │   ├── buyer/   # Buyer-specific components
│   │   │   └── manager/ # Manager-specific components
│   │   ├── home/        # Home page components
│   │   ├── products/    # Product-related components
│   │   └── ui/          # UI components (Card, Modal, etc.)
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── AllProductsPage.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── PaymentSuccessPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AboutUs.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   ├── services/         # API and auth services
│   │   ├── api.js
│   │   └── auth.js
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── index.js          # Entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables (not in git)
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 👥 User Roles

### Buyer
- Browse and purchase products
- Track orders
- Manage profile
- View order history

### Manager
- View all orders
- Update order status
- Approve pending orders
- View analytics

### Admin
- Full system access
- User management
- Product management
- System configuration

---

## 💳 Payment Integration

LoomWare supports two payment methods:

### 1. Cash on Delivery
- No upfront payment required
- Payment collected upon delivery
- Order status: `pending` until payment confirmed

### 2. Stripe
- Secure online payment
- Instant order confirmation
- Automatic order creation via webhooks
- Order status: `paid` immediately

**Stripe Test Card:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

---

## 🌐 Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Choose your Firebase project
   - Set build directory to `build`
   - Configure as single-page app: Yes
   - Don't overwrite index.html

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Environment Variables in Firebase
Set environment variables in your Firebase project settings or use Firebase Functions config.

---

## 📸 Screenshots

### Home Page
Modern landing page with featured products and categories

### Product Catalog
Browse products with advanced filtering and search

### Product Details
Detailed product information with image gallery

### Shopping Cart
Review items before checkout

### Checkout
Secure checkout with multiple payment options

### Dashboard
Role-based dashboards for buyers, managers, and admins

### Order Tracking
Real-time order status updates

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Maahin**
- Email: maahin810@gmail.com
- GitHub: [@MaahinSK](https://github.com/MaahinSK)

---

## 🙏 Acknowledgments

- Firebase for authentication and hosting
- Stripe for payment processing
- Vercel for backend hosting
- All open-source libraries used in this project

---

## 📞 Support

For support, email maahin810@gmail.com or open an issue in the repository.

---

<div align="center">

**Made with ❤️ by Maahin**

⭐ Star this repo if you find it helpful!

</div>
