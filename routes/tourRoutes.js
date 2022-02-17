const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
  .route('/top-5-best-cheap')
  .get(tourController.aliasCheapTours, tourController.GetAllTours);

router.route('/').get(tourController.GetAllTours).post(tourController.PostTour);

router.route('/tour-stats').get(tourController.getTourstats);
router.route('/monthly-stats').get(tourController.getMonthlystats);

router
  .route('/:id')
  .get(tourController.GetTour)
  .patch(tourController.UpdateTour)
  .delete(tourController.DeleteTour);

module.exports = router;
