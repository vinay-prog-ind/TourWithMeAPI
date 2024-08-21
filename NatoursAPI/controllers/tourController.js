const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/appError');
const asyncCatch = require('./../utils/asyncCatch');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage';
  next();
};

// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter() {
//     const queryObj = { ...this.queryString };
//     // BUILD QUERY
//     // 1-A) Filtering

//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     // 1-B) Advanced filtering
//     let queryStr = JSON.stringify(queryObj);

//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     // let query = Tour.find(JSON.parse(queryStr));
//     this.query = this.query.find(JSON.parse(queryStr));
//     return this;
//   }
//   sort() {
//     // let query = Tour.find(JSON.parse(queryStr));

//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(',').join(' ');
//       this.query = this.query.sort(sortBy);
//     } else {
//       // query = query.sort('-createdAt');
//     }
//     return this;
//   }
//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(',').join(' ');
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select('-__v');
//     }
//     return this;
//   }
//   pagination() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 100;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);

//     return this;
//   }
// }

exports.getAllTours = async (req, res, next) => {
  try {
    // ^
    // const queryObj = { ...req.query };
    // console.log(req.query);
    // // BUILD QUERY
    // // 1-A) Filtering
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // // 1-B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);

    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // // let query = Tour.find(JSON.parse(queryStr));
    // //2) Sorting

    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   // query = query.sort('-createdAt');
    // }

    // 3) Limiting Field
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // 4) Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const newTour = await Tour.countDocuments();
    //   if (skip >= newTour) {
    //     throw new Error('This is an invalid page');
    //   }
    // }

    // EXECUTE QUERY

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    // const tours = await query;
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'failed',
      message: err,
    });
    // next(new AppError(err.message, 404));
  }
};

exports.getTour = async (req, res, next) => {
  try {
    // let tour = await Tour.findById(req.params.id); // const tour = await Tour.findOne({ _id: req.params.id });
    const features = new APIFeatures(Tour.findById(req.params.id), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    // const tours = await query;
    const tour = await features.query;
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'error',
      message: err,
    });
    // return next(new AppError(err.message, 404));
  }
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.editTour = async (req, res) => {
  //{
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);

  // if (!tour) {
  //   res
  //     .status(404)
  //     .json({ status: 'fail', message: `failed to load tour ${id}` });
  // }
  // }
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ status: 'success', message: 'tour updated successfully' });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: `Tour ${req.params.id} not found`,
  //   });
  // }
  try {
    await Tour.findByIdAndDelete(req.params.id, { new: true });
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      // {
      // $match: { ratingsAverage: { $gte: 4.5 } },
      // },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          totalTours: { $sum: 1 },
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
    res.status(200).json({ status: 'success', message: stats });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          totalTours: { $sum: 1 },
          tours: { $push: '$name' },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$ratingsAverage' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      { $sort: { totalTours: -1 } },
      {
        $project: { _id: 0 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: { plan },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: 'fail', message: err });
  }
};

// .....................................................................................................
// .....................................................................................................
// .....................................................................................................

// exports.getAllTours = asyncCatch(async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .pagination();
//   const tours = await features.query;
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: { tours },
//   });
// });

// exports.getTour = asyncCatch(async (req, res, next) => {
//   // const features = new APIFeatures(
//   //   Tour.findById(req.params.id),
//   //   req.query,
//   //   (err) => {
//   //     return next(new AppError('Could fond tour', 404));
//   //   },
//   // )
//   //   .filter()
//   //   .sort()
//   //   .limitFields()
//   //   .pagination();
//   // const tour = await features.query;

//   const tour = await Tour.findById(req.params.id);
//   if (!tour) return next(new AppError('Could fond tour', 404));

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// exports.createTour = asyncCatch(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({ status: 'success', data: { tour: newTour } });
// });

// exports.editTour = asyncCatch(async (req, re, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   res
//     .status(200)
//     .json({ status: 'success', message: 'tour updated successfully' });
// });

// exports.deleteTour = asyncCatch(async (req, res, next) => {
//   await Tour.findByIdAndDelete(req.params.id, { new: true });
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

// exports.getTourStats = asyncCatch(async (req, res, next) => {
//   const stats = await Tour.aggregate([
//     // {
//     // $match: { ratingsAverage: { $gte: 4.5 } },
//     // },
//     {
//       $group: {
//         _id: { $toUpper: '$difficulty' },
//         totalTours: { $sum: 1 },
//         avgRating: { $avg: '$ratingsAverage' },
//         avgPrice: { $avg: '$price' },
//         minPrice: { $min: '$price' },
//         maxPrice: { $max: '$price' },
//       },
//     },
//     {
//       $sort: { avgPrice: 1 },
//     },
//   ]);
//   res.status(200).json({ status: 'success', message: stats });
// });

// exports.getMonthlyPlan = asyncCatch(async (req, res, next) => {
//   const year = req.params.year * 1;
//   const plan = await Tour.aggregate([
//     {
//       $unwind: '$startDates',
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`),
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { $month: '$startDates' },
//         totalTours: { $sum: 1 },
//         tours: { $push: '$name' },
//         avgPrice: { $avg: '$price' },
//         avgRating: { $avg: '$ratingsAverage' },
//       },
//     },
//     {
//       $addFields: {
//         month: '$_id',
//       },
//     },
//     { $sort: { totalTours: -1 } },
//     {
//       $project: { _id: 0 },
//     },
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: { plan },
//   });
// });
