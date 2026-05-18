const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployee,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/search', protect, searchEmployees);
router.route('/').get(protect, getAllEmployees).post(protect, addEmployee);
router
  .route('/:id')
  .get(protect, getEmployee)
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
