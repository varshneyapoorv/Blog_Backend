const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { createCategoryCtrl, fetchCategoryCtrl, singleCategoyCtrl, updateCategoryCtrl, deleteCategoryCtrl } = require("../controllers/categoryController");


// create category
router.post('/create-category', authMiddleware,createCategoryCtrl)

// get all category
router.get('/get-all', authMiddleware, fetchCategoryCtrl)

// get single category
router.get("/single-category/:id", authMiddleware, singleCategoyCtrl)

// update category
router.put('/updatecategory/:id',authMiddleware, updateCategoryCtrl)

// delete category
router.delete('/delete-category/:id',authMiddleware, deleteCategoryCtrl )


module.exports = router;
