# 🎯 Quick Reference - ApplyTrack Frontend

## 🚀 Getting Started

```bash
# Start servers (already running)
npm run dev

# Servers:
Frontend: http://localhost:5173
API: http://localhost:3001
```

## 🔑 Demo Accounts

```
Admin: admin@applytrack.dev / Password123!
User:  demo@applytrack.dev / Password123!
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open command palette |
| `ESC` | Close dialogs/palettes |
| `Tab` | Navigate UI |
| `Enter` | Confirm actions |

## 🎨 New Features at a Glance

### Applications Page
✅ **Kanban Board** - Drag cards between status columns  
✅ **Table View** - Traditional data table  
✅ **View Toggle** - Switch between Kanban/Table  
✅ **Stats Cards** - Total, Applied, Interviews, Offers  
✅ **Search** - Real-time filtering  
✅ **Toast Notifications** - Success/error feedback  

### Navigation
✅ **Command Palette** - `⌘K` for quick search  
✅ **Sidebar** - Professional icons + user profile  
✅ **Header** - Breadcrumbs + theme toggle  
✅ **Demo Banner** - Credentials at top  

### Design System
✅ **11 UI Components** - Badge, Skeleton, Sheet, Tabs, etc.  
✅ **Lucide Icons** - 200+ professional icons  
✅ **Framer Motion** - Smooth animations  
✅ **Radix UI** - Accessible components  
✅ **Sonner** - Toast notifications  

## 📦 New Dependencies (15)

```json
{
  "framer-motion": "Animations",
  "sonner": "Toasts",
  "cmdk": "Command palette",
  "lucide-react": "Icons",
  "@dnd-kit/*": "Drag & drop",
  "@radix-ui/*": "UI primitives",
  "react-hook-form": "Forms"
}
```

## 🎨 Color Codes

| Status | Color | Hex |
|--------|-------|-----|
| Wishlist | Gray | #6B7280 |
| Applied | Blue | #3B82F6 |
| Interview | Purple | #8B5CF6 |
| Offer | Green | #10B981 |
| Rejected | Red | #EF4444 |
| Ghosted | Orange | #F59E0B |

## 📁 Key Files

### New Components
```
apps/web/src/components/ui/
├── Badge.tsx
├── Skeleton.tsx
├── EmptyState.tsx
├── Sheet.tsx
├── Tabs.tsx
├── CommandPalette.tsx
├── Toaster.tsx
├── Dialog.tsx
└── Select.tsx

apps/web/src/components/applications/
└── KanbanBoard.tsx

apps/web/src/components/layout/
└── DemoBanner.tsx
```

### Updated Files
```
apps/web/src/components/layout/
├── Sidebar.tsx (icons, styling)
├── Header.tsx (command palette)
└── ProtectedLayout.tsx (banner)

apps/web/src/pages/
└── ApplicationsPage.tsx (redesign)

apps/web/
├── package.json (dependencies)
└── src/App.tsx (toaster)
```

## 🎯 Testing Checklist

- [ ] Login with demo account
- [ ] Press `⌘K` → command palette works
- [ ] Navigate to Applications
- [ ] See Kanban board with 6 columns
- [ ] Drag a card between columns
- [ ] See toast notification
- [ ] Toggle to Table view
- [ ] Search for an application
- [ ] Create new application
- [ ] Edit existing application
- [ ] Archive an application
- [ ] Check sidebar icons
- [ ] Try theme toggle
- [ ] Dismiss demo banner

## 🐛 Troubleshooting

**Q: Drag and drop not working?**  
A: Make sure you're grabbing the grip icon (appears on hover)

**Q: Command palette not opening?**  
A: Try both `⌘K` (Mac) and `Ctrl+K` (Windows)

**Q: Styles look broken?**  
A: Refresh the page, Vite might need to rebuild

**Q: Toast not appearing?**  
A: Check console for errors, Toaster should be in App.tsx

**Q: TypeScript errors?**  
A: Minor unused import warnings are OK, app still works

## 📊 Stats

- Components: 11 new + 7 updated
- Dependencies: 15 new packages
- Lines of Code: ~2,500 added
- Features: 8 major additions

## 🎨 Design Tokens

```css
/* Spacing */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */

/* Radius */
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */

/* Animation */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

## 🔗 Useful Links

- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [dnd-kit](https://dndkit.com/)
- [Lucide Icons](https://lucide.dev/)
- [Sonner](https://sonner.emilkowal.ski/)
- [cmdk](https://cmdk.paco.me/)

## 💡 Pro Tips

1. Use `⌘K` for quick navigation
2. Drag cards to change status quickly
3. Right-click for context menu (coming soon)
4. Theme toggle syncs across tabs
5. Search is case-insensitive
6. Table view is better for bulk operations
7. Kanban view is better for workflow

## 🎉 What's Complete

✅ Kanban board with drag & drop  
✅ Command Palette (⌘K)  
✅ View switching  
✅ Professional icons  
✅ Toast notifications  
✅ Loading states  
✅ Empty states  
✅ Animations  
✅ Demo banner  
✅ Enhanced layout  
✅ Stats cards  
✅ Search & filters  

## 🔮 Coming Next

- Dashboard KPI enhancements
- Admin panel upgrades
- Sheet/Drawer form
- Mobile optimization
- Bulk operations
- Export functionality

---

**Happy coding!** 🚀
