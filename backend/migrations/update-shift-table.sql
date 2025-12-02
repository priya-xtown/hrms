-- SQL Migration Script for Shifts Table
-- Run this in your MySQL database

-- Add new columns
ALTER TABLE shifts 
  ADD COLUMN IF NOT EXISTS shift_type VARCHAR(255) NULL AFTER shift_name,
  ADD COLUMN IF NOT EXISTS is_night_shift BOOLEAN NOT NULL DEFAULT false AFTER max_out_time,
  ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' AFTER is_night_shift;

-- Rename columns (if they exist with old names)
-- Note: Check if columns exist first
ALTER TABLE shifts 
  CHANGE COLUMN minimum_in_time min_in_time TIME NULL,
  CHANGE COLUMN maximum_out_time max_out_time TIME NULL;

-- Make total_hours nullable
ALTER TABLE shifts 
  MODIFY COLUMN total_hours FLOAT NULL;

-- Migrate data from is_active to status (if is_active exists)
-- UPDATE shifts 
-- SET status = CASE 
--   WHEN is_active = 1 THEN 'active' 
--   ELSE 'inactive' 
-- END;

-- Remove is_active column (after migrating data)
-- ALTER TABLE shifts DROP COLUMN IF EXISTS is_active;

-- Verify the changes
DESCRIBE shifts;
