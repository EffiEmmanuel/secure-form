const express = require('express');
const router = express.Router();

const { getGoals, setGoal, updateGoal, deleteGoal } = require('../controllers/goalsController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getGoals).post(protect, setGoal);
router.route('/:id').delete(protect, deleteGoal).put(protect, updateGoal);

module.exports = router;