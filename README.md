# HealthKidz

## Project Overview

HealthKidz is an advanced, full-stack application built to help parents and guardians track, analyze, and improve their children's nutrition through AI-powered analytics, progress tracking, and educational tools. The platform is purpose-built for responsiveness, delightful UX on both mobile and desktop, and smooth integration with native mobile app capabilities via Capacitor.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Architecture & Folder Structure](#project-architecture--folder-structure)
4. [Major Features in Detail](#major-features-in-detail)
5. [Example User Flow](#example-user-flow)
6. [AI/ML Logic & Integration](#aiml-logic--integration)
7. [Database Schema and Supabase Integration](#database-schema-and-supabase-integration)
8. [Authentication](#authentication)
9. [Performance & Optimization Techniques](#performance--optimization-techniques)
10. [Mobile App Development & Capacitor](#mobile-app-development--capacitor)
11. [Security Considerations](#security-considerations)
12. [Extensibility & Adding New Features](#extensibility--adding-new-features)
13. [Development Workflow](#development-workflow)
14. [Getting Started (Installation & Setup)](#getting-started-installation--setup)
15. [Troubleshooting](#troubleshooting)
16. [Glossary](#glossary)
17. [FAQ](#faq)
18. [Contributing](#contributing)
19. [Deployment](#deployment)
20. [Acknowledgements](#acknowledgements)

---

## Features

- **Child Profile Management:** Add and manage multiple children/profiles.
- **Meal Tracking:** Log meals with macro and micro nutrient details, water intake, and notes.
- **Advanced Analytics:**
  - AI-powered "Smart Insights" & trend detection
  - Personalized nutrition & meal recommendations
- **AI Nutrition Coach:**
  - Conversational chatbot providing meal plans, nutrition guidance, and tackling picky eating
  - Rate limiting, profanity/inappropriate content filtering
  - Personalized answers based on child age, history, and profile
- **Education Corner:** Curated content for parents & caregivers (nutrition basics, handling picky eaters, etc.)
- **Performance Features:**
  - API query caching
  - Efficient pagination on meals & history
  - Memoization and performant React patterns
- **Mobile & Accessibility:**
  - Mobile-first, accessible UX throughout
  - Large touch targets and safe-area padding
  - Native app ready with Capacitor and Android Studio/iOS Xcode support

---

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend:** Supabase (Postgres, Auth, RLS, Edge Functions)
- **AI/External APIs:** Gemini (via Edge Function), Edamam, Spoonacular, USDA
- **Mobile:** Capacitor (Android/iOS)
- **Other:** @tanstack/react-query, Radix UI, class-variance-authority, zod, date-fns

---

## Project Architecture & Folder Structure

The project is organized for clarity, scalability, and maintainability. Here is a breakdown of the main folders and files:

```
nutri-kid-coach/
├── public/                  # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── App.tsx              # Main app component, sets up routes/layout
│   ├── App.css              # Global styles
│   ├── main.tsx             # Entry point, React root
│   ├── index.css            # Tailwind and design system setup
│   ├── components/          # All UI and feature components
│   │   ├── analytics/       # Analytics and insights components
│   │   ├── charts/          # Chart and graph components
│   │   ├── meal-form/       # Meal form and related UI
│   │   ├── meals/           # Meal list and meal-related UI
│   │   ├── mobile/          # Mobile-specific UI
│   │   ├── progress/        # Progress analytics and dashboard
│   │   ├── progress-mobile/ # Mobile progress UI
│   │   ├── ui/              # Design system and reusable UI primitives
│   │   └── ...              # Other feature components
│   ├── contexts/            # React context providers (e.g., AuthContext)
│   ├── hooks/               # Custom React hooks for data, logic, and state
│   ├── integrations/
│   │   └── supabase/        # Supabase client and types
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Main app pages/routes (Meals, Progress, etc.)
│   ├── services/            # API clients and business logic
│   │   ├── api/             # External API wrappers (Edamam, Spoonacular)
│   │   └── nutrition/       # Nutrition analysis logic
│   ├── utils/               # Calculation and transformation utilities
│   └── vite-env.d.ts        # TypeScript environment types
├── supabase/
│   ├── config.toml          # Supabase project config
│   ├── functions/           # Edge functions (AI, food photo analysis, etc.)
│   └── migrations/          # Database migrations
├── package.json             # Project dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS config
├── tsconfig*.json           # TypeScript configs
├── capacitor.config.ts      # Capacitor mobile config
└── README.md                # Project documentation
```

**Key Structure Notes:**
- All business logic is in `src/services/` and `src/utils/`.
- All UI is in `src/components/` and `src/pages/`.
- Supabase Edge Functions are in `supabase/functions/`.
- Mobile-specific code is in `src/components/mobile/` and `src/components/progress-mobile/`.

---

## Major Features in Detail

### 1. **Child Profile and Meal Management**
- Secure RLS policies with per-parent/child isolation
- Quick add/edit forms for children and meals
- Water intake: tracked by glass per day per meal

### 2. **Unified Nutrition Progress & Insights**
- Calendar-based selection of child and date
- Macro breakdown with charts, pie-graphs, and history
- Fiber and additional nutrient calculations

### 3. **AI Nutrition Coach**
- Conversation UI: role-based speaker icons, rate-limited requests
- Personalized nutrition advice (protected from sensitive queries)
- Automatic context from stored child data (age, weight, activity)
- Immediate, friendly fallback answers if AI service is down
- Integrated educational feed

### 4. **Mobile Optimization**
- 44px minimum touch targets globally
- Mobile gradients, animation, spacing adjustments
- All components use responsive Tailwind rules

### 5. **Advanced Performance**
- Caching for all analytics hooks (5min window, memory cache)
- Memoization of derived nutrition data
- Use of efficient map/filter/reduce for data processing
- Paginated meal lists with near-instant loading
- API error handling and user-facing toast notifications

---

## Example User Flow

### Logging and Analyzing a Meal
1. **User logs in** (handled by Supabase Auth and `AuthContext`).
2. **User selects a child profile** (from the dashboard or selector component).
3. **User adds a meal** using the "Add Meal" form:
   - Enters meal type, date, and time.
   - Adds food items (with quantity, unit, and optional notes).
   - Optionally logs water intake.
4. **Data is saved** to Supabase tables (`meals`, `food_items`).
5. **Nutrient analysis** is performed:
   - Macronutrients and micronutrients are calculated using utilities in `src/utils/` and `src/services/nutrition/`.
   - Results are displayed in real-time charts and summaries.
6. **Progress and analytics** are updated:
   - The dashboard and analytics components fetch and display updated data.
   - AI Coach can now use the new meal data for personalized advice.

---

## AI/ML Logic & Integration

- **Supabase Edge Functions (TypeScript):**
  - `ai-nutrition-coach` (Gemini-based conversational guidance with filtering & rate limits)
  - `edamam-recipes` (recipe search with age-aware constraints)
  - `spoonacular-recipes` (nutrient-aware recipe search)
  - `usda-food-search` (foundation foods lookup and mapping)
- **External APIs:** Gemini, Edamam, Spoonacular, USDA
- **Integration Flow:**
  1. User interacts with AI Coach or triggers a recipe/food search.
  2. Frontend invokes the corresponding Supabase Edge Function.
  3. Function calls the external API, applies safety/age rules, returns structured JSON.
  4. Frontend renders results and provides fallbacks if services are unavailable.
- **Security:**
  - API keys/secrets are stored in Supabase secrets. Service role keys are used only server-side.
  - The frontend uses the Supabase URL and anon key with RLS protections enforced.
- **Personalization:**
  - Child profile data informs AI context and age-appropriate constraints.

---

## Database Schema and Supabase Integration

### Main Tables

- `children`: ID, parent_id, name, birth_date, weight, height, gender, activity_level
- `meals`: Child, meal_type, date, total_calories, water_glasses, notes
- `food_items`: Per-meal breakdown (quantity, protein, carbs, fat, calories, name, unit)
- `profiles`: Linked to auth.users (auto-filled on signup)
- `notification_settings`: Per-parent notification controls

### Security: Row Level Security (RLS)
- All user/parent data strictly isolated
- RLS checks for parent_id on children and references on meals/items
- No raw SQL in Edge Functions – all client queries use Supabase client SDK

### Edge Functions
- `ai-nutrition-coach`: Secure invocation via Supabase for all AI tasks with API key protection
- Follows CORS best practices
- Public/private settings (toggle via `supabase/config.toml`)

---

## Authentication

- Signup and login flow with Supabase Auth (email/password)
- Signup option uses correct emailRedirectTo for password recovery etc.
- User and session objects managed per best practice to ensure token refresh and session persistence
- Auth context provided at `src/contexts/AuthContext.tsx`
- Login gating for all core resources/pages

---

## Performance & Optimization Techniques

- **React Query/Tanstack:** Used for seamless data fetching and caching where necessary.
- **Custom Hooks:** All data management in hooks with granular error/loading state.
- **Manual Query Caching:** Large queries (nutrient gaps, intakes, analytics) cached in-memory with eviction.
- **Memoization:** All slow calculations use `useMemo`.
- **Paginated Meals:** For massive meal histories, fetches partial records with fast "load more" and "refresh".
- **Toasts everywhere:** For error/success status, critical for mobile feedback.

---

## Mobile App Development & Capacitor

**HealthKidz is ready for native app builds. Capacitor is already configured.**

- Current config (`capacitor.config.ts`): `appId: com.NutriKid.app`, `appName: HealthKidz`, `webDir: dist`.

### Android

1. `npm install`
2. `npx cap add android` (first time only)
3. `npm run build`
4. `npx cap sync`
5. `npx cap open android` (run from Android Studio or `npx cap run android`)
6. For dev live reload on device: keep `npm run dev` running and use `npx cap run android --external`.

### iOS (macOS/Xcode)

1. `npx cap add ios` (first time only)
2. `npm run build`
3. `npx cap sync`
4. `npx cap open ios` (build/run from Xcode)

Tip: After web changes, run `npx cap sync` (or `npx cap copy`) before rebuilding in the native IDE.

---

## Security Considerations

- **CORS:** All Edge Functions use correct CORS headers
- **RLS:** All parent/child/user data access is tightly scoped
- **Input Validation:** Message filtering on AI and input forms (keywords, profanity, length)
- **Rate Limiting:** AI Coach requests are server-side rate limited inside the `ai-nutrition-coach` Edge Function (windowed requests, safe message length)

---

## Extensibility & Adding New Features

- **Adding a New Page:**
  - Create a new file in `src/pages/` and add a route in `App.tsx`.
- **Adding a New Component:**
  - Place reusable UI in `src/components/ui/` or feature-specific UI in the relevant subfolder.
- **Adding a New API Integration:**
  - Add a new service in `src/services/api/` and update hooks/components as needed.
- **Adding a New Supabase Edge Function:**
  - Create a new folder in `supabase/functions/`, implement the function, and deploy with Supabase CLI.
- **Adding a New Calculation/Utility:**
  - Place new logic in `src/utils/` and write tests if possible.
- **Best Practices:**
  - Keep components and hooks small and focused.
  - Use TypeScript for type safety.
  - Document new features in the README and code comments.

---

## Development Workflow

- **Local Development:**
  - `npm run dev` – Vite + HMR (configured on port 8080 in `vite.config.ts`)
  - `npm run lint` – ESLint
- **Code organization:**
  - Multiple pages, hooks, and components divided for maintainability
  - Intuitive folder names: pages, components (by domain), hooks, services, utils
  - Shared context and utility hooks for auth and toasts

---

## Getting Started (Installation & Setup)

**1. Requirements**

- Node.js 18+ (recommended 20+)
- npm 9+

**2. Clone**

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

**3. Install Dependencies**

```sh
npm install
```

**4. Run Locally**

```sh
npm run dev
```
Dev server runs at `http://localhost:8080` (see `vite.config.ts`). Use `npm run preview` to test the production build locally.

**5. Environment & Secrets**

- Frontend uses environment variables for Supabase:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  Create a `.env` file at the project root with these variables. In Vercel, add them in Project Settings → Environment Variables.

Example `.env` (do not commit real values):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```
- Edge Functions require secrets in your Supabase project:
  - `GEMINI_API_KEY`
  - `SPOONACULAR_API_KEY`
  - `EDAMAM_APP_ID`
  - `EDAMAM_APP_KEY`
  - `USDA_API_KEY`
  - `SUPABASE_URL` (project URL)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

Set via Supabase CLI:

```sh
supabase secrets set GEMINI_API_KEY=... SPOONACULAR_API_KEY=... EDAMAM_APP_ID=... EDAMAM_APP_KEY=... USDA_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Troubleshooting

- **Mobile live reload:** Use `npx cap run android --external` and ensure device and dev machine are on the same network. Dev server runs on port 8080.
- **Data not showing?** Check RLS policies (`children`, `meals`, `food_items`) and that you are authenticated.
- **AI Chat not responding?** You may be rate limited or secrets may be missing. Confirm `GEMINI_API_KEY`; check function logs in Supabase.
- **Recipe/food search failing?** Ensure `EDAMAM_*`, `SPOONACULAR_API_KEY`, and `USDA_API_KEY` are set as Supabase secrets.
- **Style issues?** Clear cache; rebuild with `npm run build` and test via `npm run preview`.
- **Supabase errors?** Apply migrations and verify `project_id` in `supabase/config.toml`.

---

## Glossary

- **Supabase:** Open-source Firebase alternative, used for database, auth, and edge functions.
- **Edge Function:** Serverless function deployed at the edge, used for AI and photo analysis.
- **RLS (Row Level Security):** Database feature to restrict data access per user/parent.
- **Capacitor:** Tool for building native mobile apps with web tech.
- **React Query:** Library for data fetching and caching in React.
- **Tanstack:** Modern data management library (used for React Query).
- **AI Coach:** Conversational AI assistant for nutrition advice.
- **Macronutrients:** Protein, carbohydrates, and fat.
- **Micronutrients:** Vitamins and minerals.

---

## FAQ

**Q: How do I deploy the app to production?**
A: Build with `npm run build` and deploy the `dist/` folder to your preferred static host. For mobile, follow the Capacitor steps above.

**Q: How do I deploy to Vercel?**
A: Use the included `vercel.json`. Set build command to `npm run build`, output directory to `dist`, and framework to Vite. Vercel will handle SPA rewrites.

**Q: How do I add a new AI feature?**
A: Add a new Supabase Edge Function in `supabase/functions/`, update the frontend to call it, and document the endpoint.

**Q: Where are API keys stored?**
A: All sensitive keys are stored in Supabase secrets and never exposed to the frontend.

**Q: How do I test on mobile?**
A: Use Capacitor to sync and run the app on Android/iOS emulators or devices.

**Q: What if the AI Coach is not responding?**
A: Check rate limits, API key configuration, and Supabase function logs.

**Q: How do I contribute?**
A: Fork the repo, make your changes, and submit a pull request. See the Contributing section for more.

---

## Contributing

- Pull requests welcome! 
- Keep components/hook files small and focused.
- Always test on mobile and desktop for every PR.
- Document significant hook/component changes in this README.

---

## Deployment

- Static hosting: run `npm run build` and deploy `dist/`.
- Vercel: uses `vercel.json` for SPA rewrites to `/index.html`.

---

## Acknowledgements

- Lovable.dev for AI IDE and preview system
- [Shadcn/ui](https://ui.shadcn.com/) design system and Radix UI
- [Supabase](https://supabase.com/) for the backend, Edge Functions, and auth
- [OpenAI](https://openai.com/) for LLM-powered suggestions
- Contributors, beta-users, and everyone helping to improve child nutrition worldwide!

---

_Last Updated: June 20, 2025_
