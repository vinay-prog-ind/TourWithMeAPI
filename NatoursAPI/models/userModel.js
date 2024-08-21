const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User requires a name'],
    unique: true,
    //     unique: [true, 'User already exists'],
  },
  email: {
    type: String,
    required: [true, 'Email Required'],
    uniques: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please Enter Password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Enter Password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(changedTimeStamp > JWTimestamp);
    return JWTimestamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
