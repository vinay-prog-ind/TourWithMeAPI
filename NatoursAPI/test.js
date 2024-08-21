const express = require('express');

exports.getUser = async (req, res) => {
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
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
