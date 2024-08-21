const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { token } = require('morgan');

const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    },
  );
};

exports.signup = async (req, res, next) => {
  try {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
      status: 'success',
      token: { token },
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    return next(new AppError('There was an error signing in user', 500));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1. if email and password exist
  if (!email || !password) {
    // res.status(400).json({
    //   status: 'fail',
    //   message: 'Please provide valid email and password',
    // kjkszpj
    // });
    return next(new AppError('Please provide valid email & password', 400));
  }

  // 2. check if user && password are correct
  const user = await User.findOne({ email }).select('+password -__v');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect login credentials'));
  }

  // 3. if everything is okay

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    message: `User ${user.name} logged in successfully`,
  });
};

exports.protect = async (req, res, next) => {
  // 1 Get the token & check if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in, Please log in to get access', 401),
    );
  }

  // 2 verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3 check if user still exists
  const freshUser = await User.findById(decoded.id);
  console.log(freshUser);
  if (!freshUser) {
    return next(
      new AppError('The User belonging to token does not exist', 401),
    );
  }

  // 4 check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    console.log(freshUser.changedPasswordAfter(decoded.iat));
    return next(
      new AppError('User Password Changed recently, please log in again', 401),
    );
  }

  req.user = freshUser;
  next();
};
