const express = require('express');
const app = express();

const SUB_CONTENT = `
【你的 Base64 放这里】
`.trim();

const PORT = process.env.PORT || 3000;

app.get('/sub', (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send(SUB_CONTENT);
});

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
