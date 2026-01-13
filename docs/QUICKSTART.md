# ApplyTrack - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd applytrack
npm install
```

### Step 2: Start Database
```bash
docker compose up -d
```

Wait ~10 seconds for PostgreSQL to be ready.

### Step 3: Setup Database
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Step 4: Start Development Servers
```bash
npm run dev
```

This starts:
- API server on http://localhost:3001
- Web app on http://localhost:5173

### Step 5: Login

Open http://localhost:5173 and use:

**Demo User:**
- Email: `demo@applytrack.dev`
- Password: `Password123!`

**Admin User:**
- Email: `admin@applytrack.dev`
- Password: `Password123!`

## 🎯 What You'll See

### Demo User Account
- 35 pre-populated job applications
- Various statuses (wishlist, applied, interview, offer, rejected, ghosted)
- Activity logs for all actions
- Dashboard with statistics and charts

### Admin User Account
- Access to user management
- Can change user roles
- Can activate/deactivate accounts
- Has 5 sample applications

## 📂 Project Structure

```
applytrack/
├── apps/
│   ├── api/              # Backend (Express + Prisma)
│   └── web/              # Frontend (React + Vite)
├── packages/
│   └── shared/           # Shared types & validation
├── docker-compose.yml    # PostgreSQL container
└── README.md            # Full documentation
```

## 🛠 Common Commands

```bash
# Start everything
npm run dev

# Stop database
docker compose down

# Reset database
docker compose down -v
docker compose up -d
npm run db:migrate
npm run db:seed

# View database
npm run db:studio
# Opens Prisma Studio at http://localhost:5555

# Build for production
npm run build

# Type checking
npm run typecheck

# Run tests
npm test
```

## 🔍 Testing Features

### Try These Actions:

1. **Create Application**
   - Go to Applications page
   - Click "New Application"
   - Fill in details and save

2. **Filter & Search**
   - Use status dropdown to filter
   - Type in search box for company/role
   - Toggle "Show Archived"

3. **Update Status**
   - Click "Edit" on any application
   - Change status to see activity log

4. **View Dashboard**
   - Check KPI cards
   - See charts update in real-time

5. **Admin Features** (login as admin)
   - Go to Admin → Users
   - Change a user's role
   - Deactivate/activate accounts

6. **Dark Mode**
   - Click moon icon in header
   - Everything switches to dark theme

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps

# Restart database
docker compose restart

# Check logs
docker compose logs postgres
```

### Port Already in Use
```bash
# API port 3001 or Web port 5173 in use
# Change ports in:
# - .env (PORT and VITE_API_URL)
# - apps/web/vite.config.ts (server.port)
```

### TypeScript Errors
```bash
# Regenerate Prisma client
npm run db:generate

# Clear and reinstall
npm run clean
npm install
```

### Frontend Won't Connect to API
1. Check `.env` has `VITE_API_URL=http://localhost:3001`
2. Restart frontend: `npm run dev --workspace=apps/web`
3. Check browser console for errors

## 📚 Next Steps

1. Read [README.md](../README.md) for full documentation
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Review API endpoints in README
4. Explore the codebase:
   - Backend routes in `apps/api/src/routes/`
   - Frontend pages in `apps/web/src/pages/`
   - Shared schemas in `packages/shared/src/`

## 💡 Tips

- **Seed Data**: The demo account has 35 applications across all statuses
- **Activity Tracking**: Every change is logged automatically
- **Real-time**: Dashboard updates when you create/edit applications
- **Responsive**: Try it on mobile - sidebar becomes a menu
- **Keyboard Friendly**: Tab through forms efficiently

## 🎨 Customization

### Change Theme Colors
Edit `apps/web/src/index.css` - modify CSS variables

### Add More Seed Data
Edit `apps/api/prisma/seed.ts` and run `npm run db:seed`

### Modify Validation Rules
Update schemas in `packages/shared/src/*.schemas.ts`

---

**Need Help?** Check the full README.md for detailed documentation and API reference.
