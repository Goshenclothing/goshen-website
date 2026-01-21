# Goshen Clothing - AI-Powered African Fashion

A premium, interactive web application celebrating African heritage through contemporary fashion. Built with Next.js and powered by Gemini AI.

## 🚀 Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4 + Modern Vanilla CSS
- **Animations**: Framer Motion
- **AI**: Google Gemini API
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React
- **Hosting**: Netlify

## 🛠️ Features

- **AI Fashion Assistant**: Real-time styling advice and product discovery.
- **Admin Dashboard**: Secure management of products and AI settings.
- **AI Admin Agent**: Natural language commands for store management.
- **Dynamic Collections**: Real-time product updates from Supabase.
- **Premium UI**: Dark mode, glassmorphism, and smooth scroll animations.

## 📦 Deployment Instructions

### 1. Environment Variables
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Database Setup
Run the SQL script found in `supabase/init.sql` within your Supabase SQL Editor to initialize the tables and Row Level Security.

### 3. Netlify Push
Connect this repository to Netlify and add the environment variables in the Netlify site settings.

---
Handcrafted with love by Goshen Clothing 🇬🇭
