const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apiFeatures');

exports.aliasCheapTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage';
  req.query.sort = '-ratingsAverage,price';
  console.log('....');
  next();
};

exports.GetAllTours = async (req, res) => {
  try {
    // Executing Query

    const features = new APIfeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limiting()
      .pagination();

    const tours = await features.query;

    res.status(200).json({
      Status: 'success',
      Count: tours.length,
      Data: {
        tours,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.GetTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      Status: 'success',
      Data: {
        tour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data',
    });
  }
};

exports.PostTour = async (req, res) => {
  try {
    const newtour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newtour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data',
    });
  }
};

exports.UpdateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      Status: 'success',
      Data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data',
    });
  }
};

exports.DeleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      Status: 'success',
      Data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data',
    });
  }
};

exports.getTourstats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    // console.log(stats);
    res.status(200).json({
      Status: 'success',
      Data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data',
    });
  }
};

exports.getMonthlystats = async (req, res) => {
  try {
    const monthly = await Tour.aggregate([]);
    res.status(200).json({
      Status: 'success',
      Data: {
        monthly,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data',
    });
  }
};
