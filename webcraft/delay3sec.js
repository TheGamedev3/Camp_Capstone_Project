// delayStart.js
const { exec } = require('child_process');
const proc = exec('npm run dev');

setTimeout(() => {
  console.log('Waited 3 seconds');
  process.exit(0);
}, 3000);
