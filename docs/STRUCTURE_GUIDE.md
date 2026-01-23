# Project Structure Guide

## Overview

This document explains the reorganized project structure for clarity and maintainability.

## Directory Structure

### `/src` - Source Code
All application code lives here, organized by function:

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── layout.tsx         # Root layout wrapper
│   ├── page.tsx           # Home page
│   ├── not-found.tsx      # 404 error page
│   ├── globals.css        # Global styles
│   │
│   ├── (auth)            # Public auth pages
│   │   ├── login/         
│   │   ├── signup/        
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── 2fa/          # Two-factor authentication
│   │
│   ├── admin/            # Admin panel
│   │   ├── login/        # Admin login
│   │   └── dashboard/    # Admin dashboard
│   │
│   ├── account/          # User account pages
│   │   ├── page.tsx      # Account overview
│   │   └── profile/      # Profile management
│   │
│   ├── collections/      # Product collections
│   │   └── [id]/         # Collection detail page
│   │
│   └── api/              # API endpoints
│       ├── auth/         # Authentication endpoints
│       ├── chat/         # Chat API
│       └── admin/        # Admin API endpoints
│
├── components/           # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Cart*.tsx         # Cart-related components
│   ├── Product*.tsx      # Product-related components
│   ├── Admin*.tsx        # Admin-specific components
│   └── ...other components
│
├── context/              # Context providers
│   ├── UserAuthContext.tsx
│   ├── CartContext.tsx
│   └── AdminContext.tsx
│
├── lib/                  # Utilities & Services
│   ├── supabase.ts      # Supabase client
│   ├── apiClient.ts     # API request utilities
│   ├── emailService.ts  # Email handling
│   ├── envConfig.ts     # Environment config
│   └── ...other utilities
│
└── middleware.ts         # Next.js middleware
```

### `/public` - Static Assets
```
public/
├── images/
│   └── goshen/          # Product and brand images
├── _redirects           # Netlify redirects
└── ...other static files
```

### `/config` - Configuration Files
All configuration files are centralized here:

```
config/
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript settings
├── eslint.config.mjs           # ESLint rules
├── postcss.config.mjs          # PostCSS configuration
├── netlify.toml                # Netlify deployment settings
├── next-env.d.ts               # TypeScript environment types
├── supabase_setup.sql          # Database initialization
├── user_auth_setup.sql         # Auth table setup
├── lint_report.txt             # Linting results
└── lint_results.txt            # Additional lint results
```

### `/docs` - Documentation
Complete project documentation:

```
docs/
├── README.md                       # Main documentation
├── API_REFERENCE.md               # API endpoints
├── DEPLOYMENT_GUIDE.md            # Deployment instructions
├── DEVELOPMENT_GUIDE.md           # Development setup
├── INTEGRATION_GUIDE.md           # Integration steps
├── QUICK_REFERENCE.md            # Quick tips
├── COMPLETE_SYSTEM_STATUS.md     # System overview
├── PROJECT_COMPLETION_REPORT.md  # Completion details
├── MVP_READINESS_REPORT.md       # MVP status
├── MVP_TEST_PLAN.md              # Testing plan
├── MVP_TEST_GUIDE.md             # Testing guide
├── SECURITY_FIXES_SUMMARY.md     # Security notes
└── FINAL_SUMMARY.md              # Summary report
```

### `/scripts` - Build & Utility Scripts
Helper scripts for development and deployment.

### `/legacy` - Archived Code
Old version 1 files preserved for reference:
```
legacy/
├── index.html
├── script.js
├── styles.css
└── enhancements.*
```

## Root Level Files

### Configuration Loaders
These files re-export from the `/config` directory:
- `next.config.ts` → imports from `config/next.config.ts`
- `tsconfig.json` → extends from `config/tsconfig.json`
- `eslint.config.mjs` → imports from `config/eslint.config.mjs`
- `postcss.config.mjs` → imports from `config/postcss.config.mjs`

### Essential Files
- `package.json` - Project dependencies and scripts
- `.env.example` - Environment variables template
- `README.md` - Project overview
- `.github/workflows/` - CI/CD workflows (if any)

## Key Organization Principles

1. **Configuration Separation** - All config files are in `/config` for easy management
2. **Documentation Centralization** - All docs are in `/docs` for easy access
3. **Clear Source Structure** - `/src` follows Next.js conventions
4. **Root Clarity** - Root directory only contains essential files
5. **Backward Compatibility** - Configuration loaders maintain tool compatibility

## Navigation Tips

- **To view documentation:** Navigate to `/docs/README.md`
- **To check configuration:** Look in `/config/`
- **To find components:** Browse `/src/components/`
- **To find API routes:** Check `/src/app/api/`
- **To find pages:** Browse `/src/app/`

## File Paths for Common Tasks

| Task | Path |
|------|------|
| Configure Next.js | `config/next.config.ts` |
| Update TypeScript | `config/tsconfig.json` |
| Configure linting | `config/eslint.config.mjs` |
| Database setup | `config/supabase_setup.sql` |
| Deploy to Netlify | `config/netlify.toml` |
| Learn to deploy | `docs/DEPLOYMENT_GUIDE.md` |
| API documentation | `docs/API_REFERENCE.md` |
| Setup development | `docs/DEVELOPMENT_GUIDE.md` |
