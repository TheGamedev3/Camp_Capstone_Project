const { execSync } = require('child_process');

const testPath = process.env.TEST_PATH || '';
const cmd = ['npx playwright test', testPath].filter(Boolean).join(' ');
console.log('[delay.js] Running:', cmd);

setTimeout(() => {
  execSync(cmd, { stdio: 'inherit' });
}, 3000);
