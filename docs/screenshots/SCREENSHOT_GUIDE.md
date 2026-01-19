# 📸 Screenshot Guide for ApplyTrack

Take the following screenshots to complete the README documentation. Use full browser window (preferably 1920x1080 or similar) with a clean, professional appearance.

## 📋 Required Screenshots (11 Total)

### 1. **login-page.png**
- **Page**: Login page
- **Account**: Not logged in
- **What to capture**: 
  - Full login form (email, password fields)
  - **Demo credentials banner** showing both recruiter and applicant accounts
  - Gradient background and modern design
- **Notes**: This is a key screenshot showing the sleek demo credentials feature

---

### 2. **signup-page.png**
- **Page**: Signup page
- **Account**: Not logged in
- **What to capture**: 
  - Signup form with name, email, password, confirm password
  - **Role selection** (Applicant vs Recruiter radio buttons/toggle)
  - Clean, professional layout
- **Notes**: Shows the two-sided marketplace role selection

---

### 3. **applicant-dashboard.png**
- **Page**: Dashboard (/)
- **Account**: Login as `john.doe@email.com` / `Password123!`
- **What to capture**: 
  - All KPI cards (Total, Wishlist, Applied, Interviews, Offers)
  - **Bar chart** with gradient fills showing status distribution
  - **Pie chart** showing application overview
  - Activity feed on the right side
- **Notes**: Should show multiple applications with data in the charts

---

### 4. **recruiter-dashboard.png**
- **Page**: Dashboard (/)
- **Account**: Login as `recruiter@meta.com` / `Password123!`
- **What to capture**: 
  - KPI cards (Total, Applied, Interviews, Offers - no Wishlist)
  - Bar chart and pie chart with recruiter data
  - Activity feed showing recruiter-specific events
- **Notes**: Compare with applicant dashboard to show role differences

---

### 5. **browse-jobs.png**
- **Page**: Browse Jobs (/jobs)
- **Account**: `john.doe@email.com` (applicant)
- **What to capture**: 
  - Job listing cards with company, role, location, salary
  - Search bar and filter buttons (Company, Work Mode, Employment Type)
  - Clean grid layout of job cards
  - At least 4-6 job postings visible
- **Notes**: Shows the job marketplace from applicant perspective

---

### 6. **job-management.png**
- **Page**: Job Postings (/job-postings)
- **Account**: `recruiter@meta.com` (recruiter)
- **What to capture**: 
  - List of job postings created by recruiter
  - "Create New Job" button
  - Job cards showing applicant count, status (Open/Closed)
  - Edit and delete options
- **Notes**: Shows recruiter job posting management

---

### 7. **applicant-kanban.png**
- **Page**: Applications (/applications)
- **Account**: `john.doe@email.com` (applicant)
- **What to capture**: 
  - Full Kanban board with columns: Wishlist, Applied, Interview, Offer, Rejected, Ghosted
  - Multiple application cards distributed across columns
  - **Export CSV button** visible at top
  - Search bar and filter options
  - Stats cards showing counts
- **Notes**: Capture the full drag-and-drop board, ideally with a card being dragged

---

### 8. **recruiter-kanban.png**
- **Page**: Applications (/applications)
- **Account**: `recruiter@meta.com` (recruiter)
- **What to capture**: 
  - Kanban board showing applicants (with **applicant names** visible on cards)
  - Applied, Interview, Offer, Rejected columns
  - **Export CSV button** at top
  - Company filter showing only Meta jobs
- **Notes**: Shows recruiter view with applicant information

---

### 9. **csv-export.png**
- **Page**: Applications (/applications)
- **Account**: Either role
- **What to capture**: 
  - Close-up of the **Export CSV button** (with Download icon)
  - Toast notification showing successful export (if possible, take screenshot right after clicking export)
  - Example: "Exported 12 applications to applications-2026-01-18.csv"
- **Alternative**: Show the downloaded CSV file opened in Excel/Numbers with data visible
- **Notes**: Demonstrates the new CSV export functionality

---

### 10. **activity-log.png**
- **Page**: Activity (/activity)
- **Account**: Either role (preferably applicant with more activity)
- **What to capture**: 
  - Full activity timeline with event icons (➕✏️🔄📦♻️📝)
  - Multiple activity entries showing different event types
  - Timestamps and descriptions
  - Pagination controls if available
- **Notes**: Shows comprehensive audit trail

---

### 11. **admin-panel.png** (OPTIONAL - if you want to showcase admin features)
- **Page**: Users (/admin/users)
- **Account**: `medomoust@gmail.com` / `Medo1234$` (admin)
- **What to capture**: 
  - User management table with all users
  - Admin badge/indicator
  - User roles, email addresses
  - Edit/delete/deactivate options
- **Notes**: Optional but shows the admin role system

---

## 📝 Screenshot Tips

### Best Practices:
1. **Resolution**: Use 1920x1080 or 1440x900 for clarity
2. **Browser**: Chrome or Firefox with dev tools closed
3. **Zoom**: 100% browser zoom (not zoomed in/out)
4. **Data**: Make sure you have sample data populated
   - Create a few applications if needed
   - Add some activity by changing statuses
5. **Clean UI**: 
   - No browser extensions visible
   - Close unnecessary tabs
   - Hide bookmarks bar for cleaner look
6. **Consistent Theme**: All screenshots should be in the same theme (dark mode is default)
7. **Crop**: Crop out unnecessary browser chrome if needed, but keep the app fully visible

### Tools:
- **macOS**: Cmd+Shift+4 (select area), Cmd+Shift+3 (full screen)
- **Windows**: Snipping Tool or Win+Shift+S
- **Browser Extension**: Awesome Screenshot, Fireshot for full-page captures

### Editing:
- Use Preview (Mac) or Paint (Windows) for quick annotations if needed
- Add subtle arrows or highlights only if necessary
- Keep original quality (PNG format preferred)

---

## 🎯 Priority Order

If you're short on time, prioritize in this order:

1. **login-page.png** - Shows demo credentials (key feature)
2. **applicant-dashboard.png** - Shows charts and modern UI
3. **applicant-kanban.png** - Shows drag-and-drop with CSV export
4. **browse-jobs.png** - Shows two-sided marketplace
5. **recruiter-dashboard.png** - Shows role differences
6. **csv-export.png** - Shows new export feature
7. Rest in any order

---

## 📤 After Taking Screenshots

1. Save all screenshots to this directory: `/docs/screenshots/`
2. Use exact filenames as listed above
3. PNG format preferred (high quality, no compression)
4. Commit and push to repo
5. Screenshots will automatically appear in README.md

```bash
git add docs/screenshots/
git commit -m "docs: add comprehensive screenshots for README"
git push
```

---

**Note**: The README is already updated with links to these screenshots. Once you add them to the `docs/screenshots/` folder, they'll display automatically on GitHub!
