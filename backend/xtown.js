import app from './src/db/xtown.js';
import dotenv from 'dotenv';
import { att } from './src/db/xtown.js';

dotenv.config();
const port = process.env.PORT

app.listen(port, async () => {
  try {
    await att.sync();
    console.log(` Server is running on port ${port}`);
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
});






