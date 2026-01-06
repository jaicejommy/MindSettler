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
├── backend/                    # Node.js backend
│   ├── index.js
│   ├── package.json
│   ├── config/
│   │   └── db.js              # Database configuration
│   └── models/
│       ├── User.js
│       ├── Booking.js
│       ├── Contact.js
│       ├── CorporateRequest.js
│       └── DisabledSlot.js
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── CorporatePage.jsx
│   │   │   ├── FAQsPage.jsx
│   │   │   ├── PsychoEducationPage.jsx
│   │   │   ├── JourneyPage.jsx
│   │   │   ├── PrivacyPage.jsx
│   │   │   ├── NonRefundPage.jsx
│   │   │   ├── ConfidentialityPage.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   └── AdminDashboardPage.jsx
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.jsx     # Header, Footer, Chatbot
│   │   │   └── DesiGallery.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useInView.js
│   │   │   └── useParallax.js
│   │   ├── api.js             # API calls
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── *.css              # Styling files
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md

```

## Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **CSS** - Custom styling with design system variables

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework (implied from structure)
- **MongoDB** - Database (from config/db.js)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173/`

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Features

### Pages

- **Home** - Landing page with hero, stats, and CTA
- **About** - MindSettler's mission, values, and process
- **Psycho-Education** - Educational content and resources
- **Journey** - Structured pathway for sessions
- **Booking** - Session booking form
- **Corporate** - B2B offerings and group programs
- **FAQs** - Common questions answered
- **Contact** - Contact form for inquiries
- **Privacy Policy** - Data privacy, usage data, and third-party tools
- **Non-Refund Policy** - Refund, cancellation, and payment handling terms
- **Confidentiality & Ethics** - Session confidentiality, ethical boundaries, and crisis redirection
- **Admin Dashboard** - Admin panel for managing bookings and inquiries

### Key Features

- 📱 Responsive design
- 💬 In-app chatbot guide (navigation & informational guidance only)
- 📅 Session booking system
- 👥 Corporate/group inquiries
- 📋 Admin dashboard
- 🔐 Confidential session management
- 🎨 Calming, accessible UI

## Design System

### Color Palette

- **Primary Accent**: #DD1764 (Rose/Pink)
- **Background**: #FFFFFF (White)
- **Background Alt**: #f5f5f5 (Light Gray)
- **Card**: #f0f0f0 (Gray)
- **Text**: #3F2965 (Deep Purple)
- **Text Soft**: #6b5b7f (Muted Purple)

### Typography & Components

- Custom radius values for rounded corners
- Soft shadows for depth
- Smooth animations and transitions
- Accessible button styles and interactions

**Design Intent**: The design system is intentionally minimal and calming, aimed at reducing cognitive load and supporting emotional safety for users navigating sensitive topics.

## Payment & Booking

### Payment Methods

- UPI payments
- Cash payments (in-studio)

### Booking Flow

1. User fills booking or contact form
2. MindSettler reviews and confirms via email/WhatsApp
3. Payment details shared after confirmation
4. Session scheduled

### Chatbot Constraints

- 🤖 Chatbot provides navigation and informational guidance only
- 🚫 Does not offer psychological advice, diagnosis, or therapeutic suggestions
- 🔁 Redirects users to booking, contact, or corporate forms when appropriate

See [Layout.jsx](./frontend/src/components/Layout.jsx) for chatbot implementation.

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

### Admin Capabilities

- Manage available time slots and disable dates
- Approve or reject booking requests
- View pending and confirmed sessions
- Manage contact and corporate inquiries
- Track user information securely

### Helplines (India)

- AASRA: 9820466726
- iCall: 9152987821
- Vandrevala Foundation: 9999 77 6555

## Environment Variables

The backend requires environment variables for database connection and server configuration.

Refer to `config/db.js` for required database setup and create a `.env` file in the `backend/` directory with necessary credentials (database URI, server port, etc.).

Frontend environment variables (if needed) should be defined in `.env` at the `frontend/` root level.

## Development

### Scripts

**Frontend:**

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

**Backend:**

```bash
npm run dev       # Start backend server
```

## Contributing

This is a private project for MindSettler. For changes, please coordinate with the team.

## Contact

**MindSettler by Parnika**

- Email: support@mindsettler.in
- Instagram: [@mindsettlerbypb](https://www.instagram.com/mindsettlerbypb/)

---

© 2026 MindSettler by Parnika. All rights reserved.
