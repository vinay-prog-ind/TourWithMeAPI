const User = require('../models/userModel');
const AppError = require('../utils/appError');

// class APIFeature {
// }

exports.getAllUsers = async (req, res, next) => {
  try {
    let fields;
    if (req.query.fields) {
      fields = req.query.fields.split(',').join(' ');
    } else {
      fields = '-__v';
    }

    const data = await User.find().select(fields);
    console.log(data.length == 0);
    if (data.length == 0) {
      res.status(404).json({
        status: ' ',
        message: 'NO USER AVAILABLE',
      });
    }
    res.status(200).json({
      status: 'success',
      users: data.length,
      data: data,
    });
  } catch (err) {
    // console.log(err);
    // res.status(404).json({
    //   status: 'fail',
    //   message: 'Cannot get user',
    // });
    next(new AppError('Cannot get user', 404));
  }
  // res.status(500).json({
  //   status: 'error',
  //   message: 'Cannot get users; Route under construction',
  //   query: query,
  // });
};

exports.createUser = (req, res) => {
  //
  // res.status(500).json({
  //   status: 'error',
  //   message: 'Cannot create user; Route under construction',
  // });
};

exports.getUser = async (req, res, next) => {
  try {
    let field;
    if (req.query.fields) {
      field = req.query.fields.split(',').join(' ');
    }

    const data = await User.findById(req.params.id).select(field);
    res.status(200).json({
      status: 'success',
      message: data,
    });
  } catch (err) {
    // res.status(404).json({
    //   status: 'fail',
    //   message: err,
    // });

    next(new AppError('Cannot get user', 404));
  }

  // res.status(500).json({
  //   status: 'error',
  //   message: 'Cannot get User; Route under construction',
  // });
};

exports.editUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
    });
  } catch (err) {
    // res.status(404).json({
    //   status: 'fail',
    //   message: err,
    // });

    next(new AppError('Failed to edit user', 404));
  }

  // res.status(500).json({
  //   status: 'error',
  //   message: 'Cannot update user; Route under construction',
  // });
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id, { new: true });
    res.status(201).json({
      status: 'success',
      message: `Successfully Deleted User ${req.params.id}`,
    });
  } catch (err) {
    // res.status(404).json({
    //   status: 'fail',
    //   message: "Could't delete user",
    // });
    next(new AppError("Couldn't delete user", 404));
  }

  // res.status(500).json({
  //   status: 'error',
  //   message: 'Cannot delete user; Route under construction',
  // });
};
