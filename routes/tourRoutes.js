const express = require('express');
const tourController = require('../controllers/tourController');
const { checkId } = require('../controllers/tourController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.route('/tour-status').get(tourController.getTourStats);
router.route('/monthly/:year').get(tourController.getMonthlyPlan);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour)
  .get(tourController.getAllTours);

router
  .route('/')
  .get(protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.editTour)
  .delete(tourController.deleteTour);

module.exports = router;
