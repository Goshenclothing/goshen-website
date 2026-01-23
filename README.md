# Goshen Clothing Website

A modern Next.js e-commerce website built with React, TypeScript, and Supabase.

## 📁 Project Structure

```
.
├── src/                          # Source code
│   ├── app/                      # Next.js App Router pages and API routes
│   │   ├── (public pages)        # Customer-facing pages
│   │   ├── admin/               # Admin dashboard pages
│   │   └── api/                 # API endpoints
│   ├── components/              # Reusable React components
│   ├── context/                 # Context providers for state management
│   ├── lib/                     # Utilities, services, and helpers
│   └── middleware.ts            # Next.js middleware
│
├── public/                       # Static assets (images, fonts, etc.)
│
├── config/                       # Configuration files
│   ├── next.config.ts           # Next.js configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── eslint.config.mjs        # ESLint configuration
│   ├── postcss.config.mjs       # PostCSS configuration
│   ├── netlify.toml             # Netlify deployment config
│   └── supabase_setup.sql       # Database setup scripts
│
├── docs/                         # Documentation
│   ├── README.md                # Main documentation
│   ├── API_REFERENCE.md         # API endpoint documentation
│   ├── DEPLOYMENT_GUIDE.md      # Deployment instructions
│   ├── DEVELOPMENT_GUIDE.md     # Development setup guide
│   └── ...                      # Additional guides and reports
│
├── scripts/                      # Build and utility scripts
│
├── legacy/                       # Legacy version 1 (archived)
│
└── Root Configuration Files
    ├── package.json             # Project dependencies
    ├── .env.example             # Environment variables template
    └── (Config loaders)         # Files that re-export from config/
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📚 Documentation

All documentation is organized in the `/docs` folder:

- **[README.md](./docs/README.md)** - Main project documentation
- **[API_REFERENCE.md](./docs/API_REFERENCE.md)** - API endpoint details
- **[DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)** - Production deployment steps
- **[DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md)** - Local development setup
- **[INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md)** - Integration instructions

## ⚙️ Configuration

Configuration files are centralized in the `/config` folder:

- `next.config.ts` - Next.js settings
- `tsconfig.json` - TypeScript settings
- `eslint.config.mjs` - Code linting rules
- `postcss.config.mjs` - CSS processing
- `netlify.toml` - Netlify deployment settings
- `supabase_setup.sql` - Database initialization

**Note:** Root-level loader files (next.config.ts, tsconfig.json, etc.) automatically import from the config folder.

## 📦 Project Dependencies

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database & authentication
- **Framer Motion** - Animations
- **Google Generative AI** - AI integration

## 🔐 Environment Variables

See `.env.example` for required environment variables.

## 📝 Notes

- Legacy v1 code is preserved in the `/legacy` folder for reference
- All API routes are in `src/app/api/`
- Page components are in `src/app/`
- Reusable components are in `src/components/`

## 📧 Support

For issues or questions, refer to the documentation in the `/docs` folder.
