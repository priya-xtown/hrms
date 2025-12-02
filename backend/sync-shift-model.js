// Quick script to sync the Shift model with database
// Run this once: node sync-shift-model.js

import { sequelize } from './src/db/index.js';
import Shift from './src/modules/shiftmaster/models/shift.model.js';

async function syncShiftModel() {
  try {
    console.log('🔄 Syncing Shift model with database...');
    
    // This will alter the table to match the model
    await Shift.sync({ alter: true });
    
    console.log('✅ Shift table synced successfully!');
    console.log('📋 Current table structure:');
    
    // Show the table structure
    const [results] = await sequelize.query('DESCRIBE shifts');
    console.table(results);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

syncShiftModel();
