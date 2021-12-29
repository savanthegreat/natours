const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({
      Status: 'failed',
      message: 'No tour with this ID is available in Database',
    });
  }
  next();
};

exports.checkData = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      Status: 'failed',
      message:
        'Name and Price are mandatory parameters. please provide name and price.',
    });
  }
  next();
};
exports.GetAllTours = (req, res) => {
  res.status(200).json({
    Status: 'success',
    Count: tours.length,
    Data: {
      tours,
    },
  });
};

exports.GetTour = (req, res) => {
  const tourID = req.params.id * 1;
  const tourDetail = tours.find((el) => el.id === tourID);

  res.status(200).json({
    Status: 'success',
    Data: {
      tour: tourDetail,
    },
  });
};

exports.PostTour = (req, res) => {
  const idNew = tours.length + 1;
  const toursUpdated = { id: idNew, ...req.body };
  tours.push(toursUpdated);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          NewTour: toursUpdated,
        },
      });
    }
  );
};

exports.UpdateTour = (req, res) => {
  const tourID = req.params.id * 1;

  res.status(200).json({
    Status: 'success',
    Data: {
      tour: `We have Updated tour with ID ${tourID}`,
    },
  });
};

exports.DeleteTour = (req, res) => {
  // const tourID = req.params.id * 1;

  res.status(204).json({
    Status: 'success',
    Data: null,
  });
};
