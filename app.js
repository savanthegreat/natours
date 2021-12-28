const express = require('express');
const fs = require('fs');
const port = 3000;

const app = express();
app.use(express.json());
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    Status: 'success',
    Count: tours.length,
    Data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const ID = tours.length + 1;
  const toursUpdated = Object.assign({ ID: ID }, req.body);
  tours.push(toursUpdated);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      console.log('written');
    }
  );
  res.status(201).send('Done');
});

app.listen(port, () => {
  console.log('listening on port ' + port);
});
