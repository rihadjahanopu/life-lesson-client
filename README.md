<div align="center">

# 🎓 Life Lesson

**Empowering Your Learning Journey**

> A modern, highly interactive, and responsive learning platform built with Next.js 16.

**🔗 [Live Demo](https://your-live-demo-link-here.com)**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&style=for-the-badge)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react&style=for-the-badge)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&style=for-the-badge)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

</div>

Welcome to the client-side repository for **Life Lesson**. This application provides an engaging educational experience, offering interactive lessons, comprehensive user dashboards, a rich-text editor for notes, robust authentication, and secure payments.

<br />

## ✨ Key Features

| Feature                         | Description                                                                 |
| :------------------------------ | :-------------------------------------------------------------------------- |
| **🎓 Interactive Lessons**      | Dive into structured learning modules with rich text content.               |
| **🔐 Secure Authentication**    | Fast and secure login/registration flows powered by **Better Auth**.        |
| **📊 Comprehensive Dashboards** | Track progress as a User or manage the platform as an Admin (via Recharts). |
| **💳 Payments & Pricing**       | Seamless integration for subscription plans and payments.                   |
| **📝 Rich Text Editing**        | Take notes and create content using the powerful **Lexical editor**.        |
| **📱 Fully Responsive**         | Optimized UI/UX for desktop, tablet, and mobile devices.                    |
| **🔔 Real-time Notifications**  | Instant user feedback via `react-hot-toast`.                                |
| **📤 Social Sharing**           | Easily share content and lessons with `react-share`.                        |

<br />

## 🚀 Tech Stack & Core Libraries

We use cutting-edge modern web technologies to ensure optimal performance, scalability, and an excellent developer experience.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Rich Text Editor**: [Lexical](https://lexical.dev/)
- **Charts & Analytics**: [Recharts](https://recharts.org/)
- **PDF Generation**: [jsPDF](https://parall.ax/products/jspdf)

<br />

## 🛠️ Getting Started

### 1️⃣ Prerequisites

Ensure you have the following installed:

- Node.js (v18.17 or higher recommended)
- npm, yarn, pnpm, or bun

### 2️⃣ Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd life-lesson-client

# Install dependencies
npm install
```

### 3️⃣ Environment Variables

Create a `.env.local` file by copying the example:

```bash
cp .env.example .env.local
```

**Required Variables:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api # Backend API URL
NEXT_PUBLIC_APP_URL=http://localhost:3000    # Client App URL
# Add other required keys for Better Auth, Payment Gateways, etc.
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the application!

<br />

## 📂 Project Structure

To keep the repository clean and scalable, we follow a modular structure:

```bash
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── dashboard/          # User dashboard and actions
│   ├── lessons/            # Course/lesson viewing
│   ├── login/              # Auth routes
│   ├── payment/            # Stripe/Payment integration
│   ├── pricing/            # Subscription plans
│   ├── register/           # Registration route
│   ├── globals.css         # Global styles
│   ├── layout.js           # Root layout
│   ├── not-found.js        # 404 Error page
│   └── page.js             # Landing page
├── assets/                 # Static assets (images, icons)
├── components/             # Reusable UI components
│   ├── AppShell.jsx
│   ├── Footer.jsx
│   ├── LessonCard.jsx
│   ├── Navbar.jsx
│   └── Skeleton.jsx
├── constants/              # Global constants
│   └── index.js
├── context/                # React Context (Auth, Theme)
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/                  # Custom React hooks
├── layouts/                # Page layout wrappers
├── lib/                    # Configs (Axios, Better Auth)
│   ├── auth-client.js
│   └── axios.js
├── providers/              # Global providers
│   └── index.jsx
├── services/               # API call functions
│   └── index.js
├── utils/                  # Helper functions
│   └── index.js
└── middleware.js           # Next.js route protection
```

<br />

## 🧑‍💻 Development Guidelines

> **Golden Rule:** Keep components small, reusable, and single-purpose.

- **State Management**: Use React Query for server state and Context/Zustand for global client state.
- **Styling**: Utilize Tailwind CSS utility classes. Avoid writing custom CSS unless absolutely necessary.
- **Forms**: Always use React Hook Form combined with Zod for schema validation.
- **Commits**: Follow conventional commit messages for version control.

<br />

## 🚀 Deployment Strategy

The easiest way to deploy this Next.js application is via **[Vercel](https://vercel.com/)**:

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project into Vercel.
3. Add your environment variables (`.env.local` keys) in the Vercel dashboard.
4. Click **Deploy**. Vercel will automatically configure the build settings for Next.js.

<br />

## 🤝 Contributing

Contributions make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please open an issue or submit a pull request for any improvements, bug fixes, or new features.

---

<div align="center">
  <p><i>Built with ❤️ for the Life Lesson platform.</i></p>
</div>
