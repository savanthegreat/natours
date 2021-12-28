const express = require('express');

const port = 3000;
const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome', project: 'natours' });
});

app.post('/', (req, res) => {
  res.status(404).json({ message: 'You Can Post HERE !!', project: 'natours' });
});
app.listen(port, () => {
  console.log('listening on port ' + port);
});
