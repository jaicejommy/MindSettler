# MindSettler

Psycho-education & mental well-being platform

> This repository contains the full-stack codebase for MindSettler's official website and internal admin system.
> It is intended for developers, collaborators, and internal stakeholders working on the platform.

## About MindSettler

MindSettler is a structured psycho-education studio designed to help individuals understand their mental health patterns, emotions, and behaviours through gentle, evidence-informed conversations and guidance. We provide a calm, confidential space for self-reflection and personal growth.

### What We Offer

- **60-minute one-on-one or small group sessions** - Available online or at our physical studio
- **Psycho-education focused** - Not therapy or psychiatry, but complement to professional mental health care
- **Structured sessions** - Clear flow: check-in, exploration, psycho-education, and grounding
- **Confidential & boundaried** - Clear policies about what is confidential and session scope
- **Personalized guidance** - Adapted to your pace, story, and everyday life realities

## Project Structure

```
MindSettler/
├── backend/                        # Node.js + Express backend
│   ├── index.js                    # Main server file with all API routes
│   ├── package.json
│   ├── firebaseAdmin.js            # Firebase Admin SDK configuration
│   ├── config/
│   │   └── db.js                   # MongoDB database configuration
│   ├── middleware/
│   │   ├── firebaseAuth.js         # Firebase authentication middleware (users)
│   │   └── firebaseAdminAuth.js    # Firebase admin authentication middleware
│   ├── models/
│   │   ├── Admin.js                # Admin user model
│   │   ├── Booking.js              # Session booking model
│   │   ├── Contact.js              # Contact form submissions
│   │   ├── CorporateRequest.js     # Corporate inquiry model
│   │   ├── Coupon.js               # Discount coupons model
│   │   ├── DisabledSlot.js         # Blocked time slots model
│   │   ├── Message.js              # User notifications/messages
│   │   ├── SessionPrice.js         # Session pricing model
│   │   └── User.js                 # User profile model
│   ├── services/
│   │   ├── emailService.js         # Email templates & sending (Nodemailer)
│   │   └── rescheduleEmail.js      # Rescheduling notification emails
│   └── uploads/                    # Profile pictures & payment screenshots
├── frontend/                       # React + Vite user-facing website
│   ├── src/
│   │   ├── pages/
│   │   │   ├── IntroPage.jsx       # Welcome intro animation
│   │   │   ├── HomePage.jsx        # Landing page
│   │   │   ├── AboutPage.jsx       # About MindSettler
│   │   │   ├── BookingPage.jsx     # Session booking with payment
│   │   │   ├── ContactPage.jsx     # Contact form
│   │   │   ├── CorporatePage.jsx   # Corporate/B2B inquiries
│   │   │   ├── FAQsPage.jsx        # Frequently asked questions
│   │   │   ├── PsychoEducationPage.jsx  # Educational content
│   │   │   ├── JourneyPage.jsx     # Session journey pathway
│   │   │   ├── AuthPage.jsx        # User login/signup
│   │   │   ├── ResetPasswordPage.jsx   # Password reset
│   │   │   ├── PrivacyPage.jsx     # Privacy policy
│   │   │   ├── NonRefundPage.jsx   # Refund policy
│   │   │   └── ConfidentialityPage.jsx # Confidentiality & ethics
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Header, footer, navigation
│   │   │   ├── ChatBot.jsx         # AI-powered chatbot (Gemini)
│   │   │   ├── IntroAnimation.jsx  # Animated intro sequence
│   │   │   ├── JourneySection.jsx  # Session journey visualization
│   │   │   ├── DesiGallery.jsx     # Image gallery component
│   │   │   ├── FadeIn.jsx          # Scroll-triggered animations
│   │   │   ├── FloatingBlobs.jsx   # Background visual effects
│   │   │   ├── HeroParticleBackground.jsx  # Particle animations
│   │   │   ├── NeuralNetwork.jsx   # Neural network visualization
│   │   │   └── ParticleDivider.jsx # Section divider effect
│   │   ├── hooks/
│   │   │   ├── useAuth.js          # Firebase authentication hook
│   │   │   ├── useInView.js        # Intersection observer hook
│   │   │   └── useParallax.js      # Parallax scroll effect hook
│   │   ├── api.js                  # API base URL config
│   │   ├── authedApi.js            # Authenticated API calls
│   │   ├── firebase.js             # Firebase client config
│   │   ├── App.jsx                 # Main app with routing
│   │   └── *.css                   # Styling files
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── admin-frontend/                 # React + Vite admin dashboard
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminLoginPage.jsx      # Admin authentication
│   │   │   ├── AdminDashboardPage.jsx  # Main admin panel
│   │   │   ├── ForgotPasswordPage.jsx  # Admin password recovery
│   │   │   └── ResetPasswordPage.jsx   # Admin password reset
│   │   ├── api.js                  # Admin API config
│   │   ├── firebase.js             # Firebase admin config
│   │   └── App.jsx                 # Admin app routing
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── package.json                    # Root package (Google GenAI)
└── README.md
```

## Tech Stack

### Frontend (User Website)

- **React 19** - UI library with hooks
- **Vite 7** - Fast build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Modern icon library
- **Axios** - HTTP client for API requests
- **Firebase 11** - Authentication (Email/Password + Google OAuth)

### Admin Frontend

- **React 19** - UI library
- **Vite 7** - Build tool
- **React Router DOM 7** - Routing
- **Firebase 12** - Admin authentication

### Backend

- **Node.js** - Runtime environment
- **Express.js 4** - Web framework & REST API
- **MongoDB** - NoSQL database with Mongoose 9 ODM
- **Firebase Admin SDK 13** - Server-side authentication & user management
- **Nodemailer 7** - Email service (SMTP)
- **Multer** - File upload handling (profile pics, payment screenshots)
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management

### Google Technologies

- **Firebase Authentication** - User authentication with Email/Password and Google Sign-In
- **Firebase Admin SDK** - Server-side user management and token verification
- **Google Gemini AI** - AI-powered chatbot using `@google/genai` SDK
- **Google Calendar API** - Session calendar integration (OAuth scope)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)
- Firebase project with Authentication enabled
- Google Gemini API key

### Environment Variables

#### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
ADMIN_TOKEN_SECRET=your_admin_secret
ADMIN_EMAIL=admin@mindsettler.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Admin Frontend (`admin-frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173/`

### Admin Frontend Setup

```bash
cd admin-frontend
npm install
npm run dev
```

The admin panel will run at `http://localhost:5174/`

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend API will run at `http://localhost:5000/`

## Website Flow

### User Journey

1. **Intro Animation** → First-time visitors see a welcoming intro animation
2. **Home Page** → Landing page with hero section, stats, and call-to-action
3. **Explore Content** → Users can browse About, Psycho-Education, Journey pages
4. **Authentication** → Sign up/Login via Email or Google OAuth
5. **Book Session** → Multi-step booking form with:
   - Personal details & session type selection
   - Date/time slot selection
   - Payment via UPI (QR code) with screenshot upload
   - Optional coupon code application
6. **Confirmation** → Email confirmation sent, session added to calendar
7. **Dashboard** → Users can view their bookings and messages

### Admin Flow

1. **Admin Login** → Secure authentication with Firebase
2. **Dashboard Overview** → View pending bookings, stats, and notifications
3. **Manage Bookings** → Approve, reject, or reschedule sessions
4. **Manage Slots** → Disable specific dates/times
5. **Pricing Management** → Set session prices for different therapy types
6. **Coupon Management** → Create and manage discount codes
7. **View Inquiries** → Handle contact and corporate requests
8. **QR Code Management** → Upload/update payment QR code

## Features

### Pages (User Frontend)

| Page | Description |
|------|-------------|
| **Intro** | Animated welcome screen (first visit only) |
| **Home** | Hero section, statistics, testimonials, and CTAs |
| **About** | MindSettler's mission, values, and process |
| **Psycho-Education** | Educational content and therapy types |
| **Journey** | Visual session pathway and what to expect |
| **Booking** | Multi-step session booking with payment |
| **Corporate** | B2B offerings and group program inquiries |
| **FAQs** | Frequently asked questions |
| **Contact** | Contact form for general inquiries |
| **Auth** | User login/signup with Firebase |
| **Privacy Policy** | Data privacy and usage |
| **Non-Refund Policy** | Refund and cancellation terms |
| **Confidentiality** | Session confidentiality and ethical boundaries |

### Session Types

- Cognitive Behavioural Therapy (CBT)
- Dialectical Behavioural Therapy (DBT)
- Acceptance & Commitment Therapy (ACT)
- Schema Therapy
- Emotion-Focused Therapy (EFT)
- Emotion-Focused Couples Therapy
- Mindfulness-Based Cognitive Therapy (MBCT)
- Client-Centred Therapy (CCT)

### Key Features

| Feature | Description |
|---------|-------------|
| 📱 **Responsive Design** | Mobile-first, works on all devices |
| 🤖 **AI Chatbot** | Gemini-powered assistant for navigation & info |
| 🔐 **Firebase Auth** | Secure authentication with Google Sign-In |
| 📅 **Smart Booking** | Real-time slot availability with calendar sync |
| 💳 **UPI Payments** | QR-based payments with screenshot verification |
| 🎟️ **Coupon System** | Discount codes with validation |
| 📧 **Email Notifications** | Booking confirmations & password resets |
| 👤 **User Profiles** | Profile pictures and booking history |
| 🎨 **Animations** | Smooth Framer Motion transitions |
| 🌊 **Visual Effects** | Particle backgrounds, floating blobs |

### Admin Dashboard Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard Overview** | Stats and pending items at a glance |
| 📋 **Booking Management** | Approve, reject, reschedule bookings |
| 📅 **Slot Management** | Disable dates/times for unavailability |
| 💰 **Pricing Control** | Set session prices by therapy type |
| 🎟️ **Coupon Management** | Create/manage discount codes |
| 📨 **Contact Inquiries** | View and respond to contact forms |
| 🏢 **Corporate Requests** | Manage B2B and group inquiries |
| 🖼️ **QR Code Upload** | Update payment QR code |
| 🔑 **Password Management** | Change admin credentials |

### API Endpoints

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/forgot-password` - Admin password reset request
- `POST /api/admin/reset-password` - Reset admin password
- `POST /api/auth/forgot-password` - User password reset
- `POST /api/auth/reset-password` - Reset user password
- `GET /api/auth/resolve-username` - Check username availability

#### User Profile
- `GET /api/me` - Get current user profile
- `PATCH /api/me` - Update user profile
- `POST /api/me/profile-pic` - Upload profile picture
- `GET /api/me/bookings` - Get user's bookings
- `GET /api/me/messages` - Get user's messages

#### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings (admin)
- `PATCH /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/reschedule` - Reschedule booking

#### Slots & Pricing
- `GET /api/slots` - Get available time slots
- `POST /api/slots/disable` - Disable slots (admin)
- `GET /api/pricing` - Get session prices
- `PUT /api/pricing` - Update prices (admin)

#### Coupons
- `GET /api/coupons` - Get all coupons (admin)
- `POST /api/coupons` - Create coupon (admin)
- `POST /api/coupons/validate` - Validate coupon code

#### Forms & Inquiries
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contacts (admin)
- `POST /api/corporate` - Submit corporate inquiry
- `GET /api/corporate` - Get corporate requests (admin)

#### Miscellaneous
- `GET /api/health` - Health check
- `POST /api/chatbot` - AI chatbot interaction
- `GET /api/settings/qr` - Get payment QR URL
- `POST /api/settings/qr` - Update payment QR (admin)

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Accent | `#DD1764` | Buttons, links, highlights |
| Background | `#FFFFFF` | Main background |
| Background Alt | `#f5f5f5` | Secondary sections |
| Card | `#f0f0f0` | Card backgrounds |
| Text Primary | `#3F2965` | Headings, primary text |
| Text Soft | `#6b5b7f` | Secondary text, captions |

### Typography & Components

- Custom radius values for rounded corners
- Soft shadows for depth
- Smooth Framer Motion animations
- Accessible button styles and interactions
- Responsive typography scaling

**Design Intent**: The design system is intentionally minimal and calming, aimed at reducing cognitive load and supporting emotional safety for users navigating sensitive topics.

## Payment & Booking

### Payment Methods

- **UPI Payments** - Scan QR code and upload screenshot
- **Cash Payments** - Available for in-studio sessions

### Booking Flow

```
┌─────────────────┐
│  1. User Info   │ → Name, phone, session type, first session?
└────────┬────────┘
         ↓
┌─────────────────┐
│  2. Date/Time   │ → Select available slot
└────────┬────────┘
         ↓
┌─────────────────┐
│   3. Payment    │ → Scan QR, upload screenshot, apply coupon
└────────┬────────┘
         ↓
┌─────────────────┐
│  4. Confirm     │ → Review and submit
└────────┬────────┘
         ↓
┌─────────────────┐
│ Email + Calendar│ → Confirmation sent, Google Calendar sync
└─────────────────┘
```

### Chatbot Constraints

- 🤖 Chatbot provides navigation and informational guidance only
- 🚫 Does not offer psychological advice, diagnosis, or therapeutic suggestions
- 🔁 Redirects users to booking, contact, or corporate forms when appropriate
- 💬 Powered by Google Gemini AI with context about MindSettler services

### Cancellation & Refunds

- 48-hour cancellation notice for rescheduling
- No-show policy: session marked complete, no refund
- Cash vs UPI refund handling differs (see Non-Refund Policy)

## Important Disclaimer

**MindSettler provides psycho-education and guided self-reflection support.**

It does **not** offer:

- Psychotherapy or therapeutic treatment
- Psychiatric diagnosis or medical advice
- Emergency crisis intervention services

**Important**: Users experiencing acute distress, suicidal ideation, or psychiatric emergencies are advised to contact local emergency services or mental health helplines immediately.

See our [Confidentiality & Ethics Policy](./frontend/src/pages/ConfidentialityPage.jsx) for complete details on scope and limitations.

## Legal & Compliance

### Important Policies

- **Confidentiality**: Session information is strictly confidential with limited exceptions
- **Crisis Redirection**: Users in crisis directed to helplines (AASRA, iCall, Vandrevala)
- **Scope**: Psycho-education only—not therapy, diagnosis, or psychiatric care
- **Consent**: Users must acknowledge policies before first session

### Helplines (India)

| Service | Number |
|---------|--------|
| AASRA | 9820466726 |
| iCall | 9152987821 |
| Vandrevala Foundation | 9999 77 6555 |

## Development

### Scripts

**Frontend:**

```bash
npm run dev       # Start dev server (port 5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

**Admin Frontend:**

```bash
npm run dev       # Start dev server (port 5174)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

**Backend:**

```bash
npm start         # Start production server
npm run dev       # Start with nodemon (auto-reload)
```

### Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Firebase   │  │   REST API   │  │  Google Calendar │  │
│  │     Auth     │  │    Calls     │  │    (OAuth)       │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
└─────────┼─────────────────┼────────────────────┼────────────┘
          │                 │                    │
          ↓                 ↓                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │Firebase Admin│  │   MongoDB    │  │   Gemini AI      │  │
│  │     SDK      │  │  (Mongoose)  │  │   (Chatbot)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Nodemailer  │  │    Multer    │                        │
│  │   (Email)    │  │  (Uploads)   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Contributing

This is a private project for MindSettler. For changes, please coordinate with the team.

## Contact

**MindSettler by Parnika**

- Email: support@mindsettler.in
- Instagram: [@mindsettlerbypb](https://www.instagram.com/mindsettlerbypb/)

---

© 2026 MindSettler by Parnika. All rights reserved.
