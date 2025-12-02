// Migration script to update shifts table
// Run this once: node migrations/update-shift-table.js

import { sequelize } from '../src/db/index.js';

async function migrateShiftTable() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    console.log('🔄 Starting shift table migration...');

    // Check if columns exist before adding them
    const tableDescription = await queryInterface.describeTable('shifts');
    
    // Add shift_type column if it doesn't exist
    if (!tableDescription.shift_type) {
      await queryInterface.addColumn('shifts', 'shift_type', {
        type: sequelize.Sequelize.STRING,
        allowNull: true,
      });
      console.log('✅ Added shift_type column');
    }

    // Add is_night_shift column if it doesn't exist
    if (!tableDescription.is_night_shift) {
      await queryInterface.addColumn('shifts', 'is_night_shift', {
        type: sequelize.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
      console.log('✅ Added is_night_shift column');
    }

    // Add status column if it doesn't exist
    if (!tableDescription.status) {
      await queryInterface.addColumn('shifts', 'status', {
        type: sequelize.Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      });
      console.log('✅ Added status column');
    }

    // Rename minimum_in_time to min_in_time if needed
    if (tableDescription.minimum_in_time && !tableDescription.min_in_time) {
      await queryInterface.renameColumn('shifts', 'minimum_in_time', 'min_in_time');
      console.log('✅ Renamed minimum_in_time to min_in_time');
    }

    // Rename maximum_out_time to max_out_time if needed
    if (tableDescription.maximum_out_time && !tableDescription.max_out_time) {
      await queryInterface.renameColumn('shifts', 'maximum_out_time', 'max_out_time');
      console.log('✅ Renamed maximum_out_time to max_out_time');
    }

    // Remove is_active column if it exists and status was added
    if (tableDescription.is_active && tableDescription.status) {
      // First, migrate data from is_active to status
      await sequelize.query(`
        UPDATE shifts 
        SET status = CASE 
          WHEN is_active = 1 THEN 'active' 
          ELSE 'inactive' 
        END
        WHERE status IS NULL OR status = ''
      `);
      
      await queryInterface.removeColumn('shifts', 'is_active');
      console.log('✅ Removed is_active column (migrated to status)');
    }

    // Make total_hours nullable
    if (tableDescription.total_hours && tableDescription.total_hours.allowNull === false) {
      await queryInterface.changeColumn('shifts', 'total_hours', {
        type: sequelize.Sequelize.FLOAT,
        allowNull: true,
        validate: {
          min: 0,
          max: 24,
        },
      });
      console.log('✅ Made total_hours nullable');
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateShiftTable();
