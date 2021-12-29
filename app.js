const express = require('express');
const fs = require('fs');
const { STATUS_CODES } = require('http');
const { isNull } = require('util');
const port = 3000;

const app = express();
app.use(express.json());
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const GetAllTours = (req, res) => {
  res.status(200).json({
    Status: 'success',
    Count: tours.length,
    Data: {
      tours,
    },
  });
};

const GetTour = (req, res) => {
  const tourID = req.params.id * 1;
  const tourDetail = tours.find((el) => el.id === tourID);

  if (!tourDetail) {
    return res.status(404).json({
      Status: 'failed',
      message: 'No tour with this ID is available in Database',
    });
  }

  res.status(200).json({
    Status: 'success',
    Data: {
      tour: tourDetail,
    },
  });
};

const PostTour = (req, res) => {
  const ID_new = tours.length + 1;
  const toursUpdated = Object.assign(
    {
      ID: ID_new,
    },
    req.body
  );
  tours.push(toursUpdated);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          NewTour: toursUpdated,
        },
      });
    }
  );
};

const UpdateTour = (req, res) => {
  const tourID = req.params.id * 1;

  if (tourID > tours.length) {
    return res.status(404).json({
      Status: 'failed',
      message: 'No tour with this ID is available in Database',
    });
  }
  res.status(200).json({
    Status: 'success',
    Data: {
      tour: `We have Updated tour with ID ${tourID}`,
    },
  });
};

const DeleteTour = (req, res) => {
  const tourID = req.params.id * 1;

  if (tourID > tours.length) {
    return res.status(404).json({
      Status: 'failed',
      message: 'No tour with this ID is available in Database',
    });
  }
  res.status(204).json({
    Status: 'success',
    Data: null,
  });
};

const GetAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is yet to be implemented',
  });
};

const PostUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is yet to be implemented',
  });
};

const GetUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is yet to be implemented',
  });
};

const UpdateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is yet to be implemented',
  });
};

const DeleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is yet to be implemented',
  });
};

app.route('/api/v1/tours').get(GetAllTours).post(PostTour);
app
  .route('/api/v1/tours/:id')
  .get(GetTour)
  .patch(UpdateTour)
  .delete(DeleteTour);

app.route('/api/v1/users').get(GetAllUsers).post(PostUser);
app
  .route('/api/v1/users/:id')
  .get(GetUser)
  .patch(UpdateUser)
  .delete(DeleteUser);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
