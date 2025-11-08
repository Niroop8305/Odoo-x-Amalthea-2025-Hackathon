# Quick Start - My Profile Feature

## 🚀 Quick Setup (3 Steps)

### Step 1: Apply Database Migration

```powershell
# Navigate to backend directory
cd backend

# Run the migration SQL
mysql -u root -p workzen_hrms < src/database/add_resume_fields.sql
```

**OR** manually run in MySQL Workbench:

```sql
USE workzen_hrms;

ALTER TABLE employee_profiles
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS what_i_love TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT,
ADD COLUMN IF NOT EXISTS skills JSON,
ADD COLUMN IF NOT EXISTS certifications JSON;

UPDATE employee_profiles
SET skills = JSON_ARRAY(),
    certifications = JSON_ARRAY()
WHERE skills IS NULL OR certifications IS NULL;
```

### Step 2: Start Backend

```powershell
# From backend directory
npm start
# Backend should be running on http://localhost:5000
```

### Step 3: Start Frontend

```powershell
# From frontend directory
cd ../frontend
npm run dev
# Frontend should be running on http://localhost:5173
```

## 🎯 Test the Feature

1. **Open browser**: http://localhost:5173
2. **Login** with your credentials
3. **Click** "My Profile" button on dashboard
4. **You should see** the profile page with Resume tab active

## ✅ Quick Test Checklist

- [ ] Can access `/profile` page
- [ ] See profile avatar with initials
- [ ] Resume tab is active by default
- [ ] Can click "Edit Profile" button
- [ ] Can edit text in About section
- [ ] Can click "+ Add Skills"
- [ ] Can save changes
- [ ] Data persists after refresh

## 🐛 Quick Troubleshooting

### Problem: "Cannot read property of undefined"

**Fix**: Make sure you're logged in and the token is valid

### Problem: Skills/Certifications not saving

**Fix**: Check if database migration was applied successfully

### Problem: Page is blank

**Fix**: Check browser console for errors, verify API is running

### Problem: Styles look broken

**Fix**: Clear browser cache (Ctrl + Shift + R)

## 📸 Expected Result

Your profile page should look like the screenshot with:

- ✅ Dark theme
- ✅ Purple Odoo branding
- ✅ Sidebar navigation
- ✅ Tabbed interface
- ✅ Two-column resume layout
- ✅ Edit functionality

## 🎉 Success!

If you can see and edit your profile, the feature is working!

**Next Steps**:

- Add your real information
- Upload profile picture (coming soon)
- Explore other tabs
- Test on mobile devices

---

For detailed documentation, see:

- `MY_PROFILE_FEATURE.md` - Feature details
- `MY_PROFILE_SETUP.md` - Complete setup guide
- `MY_PROFILE_OVERVIEW.md` - Technical overview
