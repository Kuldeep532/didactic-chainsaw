# Vercel Deployment Guide

## Overview
This guide explains the deployment setup for the Nexus Wave Technologies monorepo on Vercel.

## Architecture

### Monorepo Structure
```
/vercel/share/v0-project/
├── api/                          # Vercel serverless entry point
│   └── index.ts                 # Main handler (NEW)
├── artifacts/
│   ├── api-server/              # Express.js API backend
│   │   ├── src/
│   │   │   ├── app.ts           # Express app configuration
│   │   │   ├── index.ts         # Dev entry point
│   │   │   └── routes/          # API routes
│   │   └── dist/                # Built artifacts
│   ├── web/                     # React frontend (Vite)
│   │   ├── src/
│   │   └── dist/public/         # Built frontend
│   └── mockup-sandbox/          # Development tool (excluded from builds)
├── lib/
│   ├── api-client-react/        # React API client
│   ├── api-zod/                 # API validation schemas
│   ├── db/                      # Database layer
│   └── api-spec/                # API specification
├── scripts/                     # Build scripts
├── package.json                 # Root workspace config
├── pnpm-workspace.yaml         # Workspace definition
├── vercel.json                 # Vercel configuration
└── DEPLOYMENT_GUIDE.md         # This file
```

## Deployment Flow

### 1. Build Phase
```bash
npm run build
```

Steps executed:
1. TypeScript compilation check
2. Build api-server (Express app via esbuild)
3. Build web (Vite production build)
4. Skip mockup-sandbox (requires PORT env var)

### 2. Artifact Generation

**API Server** (`artifacts/api-server/dist/index.mjs`)
- Express app bundled with all dependencies
- Configured to handle API routes
- Mounted to `/api/` path

**Web Frontend** (`artifacts/web/dist/public/`)
- Vite build output
- Optimized JavaScript chunks
- CSS with Tailwind minification

### 3. Serverless Function Deployment

**Entry Point**: `api/index.ts`
```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../artifacts/api-server/src/app";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
```

This handler:
- Accepts Vercel serverless requests/responses
- Routes them through Express app
- Handles all API endpoints defined in `artifacts/api-server/src/routes/`

## Vercel Configuration (vercel.json)

```json
{
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@3"
    }
  },
  "build": {
    "env": {
      "SKIP_ENV_VALIDATION": "1"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/.*",
      "dest": "/artifacts/web/dist/public/index.html"
    }
  ]
}
```

Configuration breakdown:
- **functions**: Defines `api/index.ts` as a serverless function
- **build.env**: Sets build-time environment variables
- **routes**: 
  - `/api/*` → Serverless function handler
  - All other paths → React SPA (handled by Vite)

## Environment Variables

### Required for Build
```
SKIP_ENV_VALIDATION=1
```

### Database Configuration (if using database)
```
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url (optional)
```

### API Configuration
```
API_PORT=3001
NODE_ENV=production
BASE_URL=/
```

## Pre-deployment Checklist

- [ ] All tests passing
- [ ] Build completes without errors: `npm run build`
- [ ] TypeScript compilation passes: `pnpm run typecheck`
- [ ] No console warnings in build output
- [ ] All environment variables configured in Vercel
- [ ] `api/index.ts` properly configured as serverless function
- [ ] Frontend build outputs to correct directory
- [ ] API routes properly mapped to `/api/` path

## Troubleshooting

### Issue: "api/index.ts matches no serverless functions"

**Solution**: Ensure:
1. `api/index.ts` exists at project root
2. It exports a default function
3. Function signature matches Vercel handler type
4. File is properly committed to git

```bash
# Verify file exists
ls -la /api/index.ts

# Check git status
git status api/index.ts
```

### Issue: API routes not accessible

**Solution**: Verify routing in `vercel.json`:
```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.ts" }
  ]
}
```

### Issue: Build fails with "PORT not provided"

**Solution**: mockup-sandbox is excluded from builds. This is intentional.
Update build script in `package.json`:
```json
"build": "pnpm run typecheck && pnpm -r --if-present --filter '!./artifacts/mockup-sandbox' run build"
```

### Issue: Frontend not loading

**Solution**: Check Vite build output path in `vercel.json`:
```json
{ "src": "/.*", "dest": "/artifacts/web/dist/public/index.html" }
```

Verify Vite builds to `dist/public/` by checking:
```bash
ls -la artifacts/web/dist/public/
```

## Local Development

### Start all services
```bash
# Terminal 1: API Server
cd artifacts/api-server
npm run dev

# Terminal 2: Web Frontend
cd artifacts/web
npm run dev
```

### Build locally
```bash
npm run build
```

### Test serverless function locally
```bash
# Using Vercel CLI
vercel dev
```

## Deployment Commands

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy with production flag
```bash
vercel deploy --prod
```

### View deployment logs
```bash
vercel logs [deployment-url]
```

### Check function performance
```bash
vercel analytics
```

## Monitoring

### Key Metrics
- **Function Execution Time**: Target < 500ms
- **Deployment Time**: Monitor build duration
- **Error Rate**: Track 4xx/5xx responses
- **Bundle Size**: Monitor JS/CSS chunks

### Logs Location
- **Deployment logs**: Vercel Dashboard → Deployments → View
- **Function logs**: Vercel Dashboard → Functions → View Logs
- **Runtime errors**: Check Vercel error tracking

## Performance Optimization

### Current Build Sizes
- JavaScript: 713.60 KB (gzip: 213.19 KB)
- CSS: 146.33 KB (gzip: 22.35 KB)
- HTML: 1.42 KB

### Recommendations
1. Implement code splitting for large pages
2. Use dynamic imports for components
3. Consider route-based chunking in Vite
4. Enable Gzip compression in Vercel

## Security

### Best Practices
1. Use environment variables for sensitive data
2. Never commit `.env` files
3. Rotate database credentials regularly
4. Enable CORS only for trusted domains
5. Validate all API inputs

### Vercel Security Features
- HTTPS by default
- DDoS protection
- Automatic security patches
- Environment variable encryption

## Next Steps

1. ✅ Deploy to Vercel: `vercel deploy --prod`
2. ✅ Monitor initial deployment
3. ✅ Set up error tracking (Sentry, etc.)
4. ✅ Configure custom domain
5. ✅ Set up CI/CD pipeline
6. ✅ Enable analytics

## Support

For issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Review deployment logs in Vercel Dashboard
3. Test locally with `vercel dev`
4. Contact Vercel support for infrastructure issues
