fetch('https://niji-backend.onrender.com/auth/bootstrap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'YOUR_BOOTSTRAP_KEY',
    username: 'admin',
    password: 'admin123'
  })
});