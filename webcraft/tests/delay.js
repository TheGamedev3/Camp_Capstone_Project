
/*
errors randomly on url changes when too many workers test simultaneously at once
thats why there's only 1 worker
*/

const { execSync } = require('child_process');

const testPath = process.env.TEST_PATH || '';
const cmd = ['npx playwright test', testPath, '--workers=1'].filter(Boolean).join(' ');
console.log('[delay.js] Running:', cmd);

setTimeout(() => {
  execSync(cmd, { stdio: 'inherit' });
}, 3000);
