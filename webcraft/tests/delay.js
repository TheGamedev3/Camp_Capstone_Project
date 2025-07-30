
// waits to startup the tests, to let the server connect to mongodb

setTimeout(() => {
  const { execSync } = require('child_process');
  execSync('npx playwright test', { stdio: 'inherit' });
}, 3000);
