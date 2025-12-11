

// // index.js

// import app from './src/index.js';
// import dotenv from 'dotenv';
// import os from 'os';


// // Import two separate Sequelize instances with different names
// import { sequelize  } from './src/db/index.js';
// import { att as attnSequelize } from './src/db/xtown.js';

// // ← Add this import:
// // import { sequelize } from './src/db/index.js';


// dotenv.config();

// const port = process.env.PORT ||4001
// const host = process.env.HOST || getLocalIP();

// // Function to get the local IP address
// function getLocalIP() {
//   const interfaces = os.networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const iface of interfaces[name]) {
//       if (iface.family === 'IPv4' && !iface.internal) {
//         return iface.address;
//       }
//     }
//   }
//   return '0.0.0.0';
// }


// // Start server and sync both databases
// app.listen(port, host, async () => {
//   try {
//     // Sync tables for both databases
//     await Sequelize.sync({alter:false});      // Sync hrms_demo
//     // await attnSequelize.sync({alter:true});  // Sync xtown / att


//     console.log(`Server is running on http://${host}:${port}`,);
//   } catch (err) {
//     console.error('Failed to start server:', err);
//     process.exit(1);
//   }
// });




// // Start server and sync both databases

// //   (async () => {
// //   try {
// //     // await hrmsSequelize.sync({ alter: false });
// //     // await attnSequelize.sync({ alter: true } );

// //     app.listen(port, '192.168.1.17', () => {
// //       console.log(`✅ Server running on http://192.168.1.17:${port}`);
// //     });
// //   } catch (err) {
// //     console.error('❌ Failed to start server:', err);
// //     process.exit(1);
// //   }
// // })();







// index.js

// index.js

import app from './src/index.js';
import dotenv from 'dotenv';
import os from 'os';


// Import two separate Sequelize instances with different names
import { sequelize as hrmsSequelize } from './src/db/index.js';
import { att as attnSequelize } from './src/db/xtown.js';


// ← Add this import:
// import { sequelize } from './src/db/index.js';


dotenv.config();

const port = process.env.PORT ||4001
const host = process.env.HOST || getLocalIP();


// Function to get the local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}
      

// Start server and sync both databases
app.listen(port, host, async () => {
  try {
    // Sync tables for both databases

    await hrmsSequelize.sync({});     
    // await hrmsSequelize.sync({force : true});      // Sync hrms_demo
    await attnSequelize.sync();  // Sync xtown / att


    console.log(`Server is running on http://${host}:${port}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
});