const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   if (val > tours.length) {
//     return res.status(404).json({
//       Status: 'failed',
//       message: 'No tour with this ID is available in Database',
//     });
//   }
//   next();
// };

// exports.checkData = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       Status: 'failed',
//       message:
//         'Name and Price are mandatory parameters. please provide name and price.',
//     });
//   }
//   next();
// };

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObject[field]);

    // Advance Filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limiting() {
    if (this.queryString.fields) {
      const fieldsSelect = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsSelect);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

exports.aliasCheapTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage';
  req.query.sort = '-ratingsAverage,price';
  console.log('....');
  next();
};

exports.GetAllTours = async (req, res) => {
  try {
    // Filtering
    // const queryObject = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((field) => delete queryObject[field]);

    // // Advance Filtering
    // let queryString = JSON.stringify(queryObject);
    // queryString = queryString.replace(
    //   /\b(gte|gt|lt|lte)\b/g,
    //   (match) => `$${match}`
    // );
    // let query = Tour.find(JSON.parse(queryString));

    // Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // Fields Limiting
    // if (req.query.fields) {
    //   const fieldsSelect = req.query.fields.split(',').join(' ');
    //   query = query.select(fieldsSelect);
    // } else {
    //   query = query.select('-__v');
    // }

    // Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('Page Does not exist');
    // }
    // console.log(query);
    // Executing Query

    const features = new APIfeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limiting()
      .pagination();

    const tours = await features.query;
    // console.log(tours);

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
