import app from './src/index.js';
import dotenv from 'dotenv';
import { sequelize } from './src/db/index.js';

dotenv.config();
const port = process.env.PORT || 4001;


app.listen(port, async () => {
  try {
    await sequelize.sync();


    console.log(`✅ Server is running on port ${port}`);
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
});
