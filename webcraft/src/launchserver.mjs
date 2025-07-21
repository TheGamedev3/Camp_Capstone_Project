


// triggered by npm run dev at the start (see package.json scripts)

const http = await import('http');

setTimeout(() => {
  http.get('http://localhost:3000/api/startServer')
  .on('error', err => {
    console.error('❌ Startup ping failed:', err.message);
  });
}, 2000); // wait 2 seconds for the server to launch

