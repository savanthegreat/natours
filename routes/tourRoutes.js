const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-best-cheap')
  .get(tourController.aliasCheapTours, tourController.GetAllTours);

router.route('/').get(tourController.GetAllTours).post(tourController.PostTour);

router
  .route('/:id')
  .get(tourController.GetTour)
  .patch(tourController.UpdateTour)
  .delete(tourController.DeleteTour);

module.exports = router;
