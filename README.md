# 🔥 BookMyGas - Digital Gas Booking System

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-blue?style=for-the-badge&logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Feature%20Complete-success?style=for-the-badge)

**BookMyGas** is a comprehensive, full-stack web application designed to digitize and streamline the LPG cylinder booking process. It features a robust dual-role system (User & Admin) with real-time quota management, dynamic pricing, and secure role-based access control.

---

## 🚀 Key Features

### 🌟 For Users
* **Seamless Booking:** Book cylinders instantly with real-time stock checks.
* **Quota Management:** Automated tracking of subsidized cylinder quota (12/year).
* **Order Tracking:** Visual timeline to track order status (Pending → Approved → Delivered).
* **Support System:** Integrated help desk to raise tickets and view admin replies.
* **Mobile Responsive:** Fully optimized UI for booking on the go.

### 🛡️ For Admins
* **Dashboard Analytics:** Interactive charts showing revenue, daily sales, and user growth.
* **Dynamic Pricing:** Update cylinder prices globally with a single click.
* **Request Management:** Approve or reject new connection requests and bookings.
* **Excel Reports:** One-click export of sales data to CSV for offline accounting.
* **Secure:** Row Level Security (RLS) ensures admins only see what they need to.

---

## 🛠️ Tech Stack

* **Frontend:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
* **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Charts:** [Recharts](https://recharts.org/)

---

## 🔐 Admin Credentials (Demo)

Use these credentials to access the Admin Dashboard functionalities.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@bookmygas.com` | `admin123` |
| **User** | `user1@test.com` | `user123` |



## 🔮 Upcoming Updates

We are constantly improving BookMyGas. Here is what's coming next:

* **📧 Email Notifications **
    * Integration with **Resend** or **Nodemailer**.
    * Users will receive real-time email alerts for "Order Approved", "Out for Delivery", and "Support Ticket Resolved".

* **📄 PDF Invoice Generation **
    * Automated PDF receipt generation for every completed order.
    * Downloadable directly from the User History section.

---



## ⚡ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/Developer-Deepak02/digital-gas-agency.git](https://github.com/Developer-Deepak02/digital-gas-agency.git)
cd digital-gas-agency 
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
``` 
### 3. Configure Environment Variables
Create a .env.local file in the root directory and add your Supabase keys:

Code snippet
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
### 4. Run the Development Server
```bash

npm run dev
Open http://localhost:3000 with your browser to see the result.
```


Made with ❤️ by Deepak
