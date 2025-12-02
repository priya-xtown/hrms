# Fix Shift Table Errors - Step by Step Guide

## Problem
The database table `shifts` doesn't have the new columns that the application expects:
- `shift_type` (missing)
- `is_night_shift` (missing)
- `status` (missing)
- `min_in_time` (should be renamed from `minimum_in_time`)
- `max_out_time` (should be renamed from `maximum_out_time`)

## Solution - Choose ONE method:

---

### ✅ METHOD 1: Automatic Sync (RECOMMENDED - Easiest)

1. **Stop your backend server** (if running)

2. **Run the sync script:**
```bash
cd backendnew/backend
node sync-shift-model.js
```

3. **Restart your backend server:**
```bash
npm start
```

**Done!** The table will be automatically updated to match the model.

---

### METHOD 2: Manual SQL Script

1. **Open your MySQL client** (phpMyAdmin, MySQL Workbench, or command line)

2. **Select your database** (probably `hrms_demo` or similar)

3. **Run this SQL:**
```sql
-- Add new columns
ALTER TABLE shifts 
  ADD COLUMN shift_type VARCHAR(255) NULL AFTER shift_name,
  ADD COLUMN is_night_shift BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';

-- Rename columns (only if they exist with old names)
ALTER TABLE shifts 
  CHANGE COLUMN minimum_in_time min_in_time TIME NULL,
  CHANGE COLUMN maximum_out_time max_out_time TIME NULL;

-- Make total_hours nullable
ALTER TABLE shifts 
  MODIFY COLUMN total_hours FLOAT NULL;

-- Verify
DESCRIBE shifts;
```

4. **Restart your backend server**

---

### METHOD 3: Migration Script (Advanced)

1. **Stop your backend server**

2. **Run the migration:**
```bash
cd backendnew/backend
node migrations/update-shift-table.js
```

3. **Restart your backend server**

---

## Verify the Fix

After applying any method above:

1. **Check the backend console** - should start without errors

2. **Test in frontend:**
   - Navigate to Shift page
   - Click "Add Shift"
   - Fill the form and submit
   - Should see success message

3. **Check the database:**
```sql
SELECT * FROM shifts;
DESCRIBE shifts;
```

---

## Common Issues

### Issue: "Column already exists"
**Solution:** The column was already added. Skip that ALTER statement.

### Issue: "Unknown column 'minimum_in_time'"
**Solution:** The column was already renamed. Skip the CHANGE COLUMN statement.

### Issue: "Cannot drop 'is_active': check that column/key exists"
**Solution:** The column doesn't exist. This is fine, skip it.

### Issue: Still getting errors after migration
**Solution:** 
1. Restart the backend server completely
2. Clear browser cache and reload frontend
3. Check backend console for any startup errors

---

## What Changed

### Backend Model (`shift.model.js`)
- ✅ Added `shift_type` field
- ✅ Added `is_night_shift` field
- ✅ Changed `is_active` → `status` (enum)
- ✅ Renamed `minimum_in_time` → `min_in_time`
- ✅ Renamed `maximum_out_time` → `max_out_time`
- ✅ Made `total_hours` nullable

### Backend Validation (`shift.zod.js`)
- ✅ Updated to validate all new fields
- ✅ Changed time format to `HH:mm:ss`
- ✅ Made `total_hours` optional

### Frontend (`Shiftform.jsx`)
- ✅ Converts `total_hours` to number (parseFloat)
- ✅ Sends correct field names to backend

---

## Need Help?

If you still see errors after trying these methods:

1. **Check backend logs** - Look for specific error messages
2. **Check database connection** - Ensure backend can connect to DB
3. **Verify table name** - Confirm the table is called `shifts`
4. **Check MySQL version** - Some syntax may vary by version

**Contact your database admin if you don't have permission to ALTER tables.**
