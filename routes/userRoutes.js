const express = require('express');
const router = express.Router();
const {registerController,
    loginController,
    logoutController, 
    updatePasswordController,
    getUserProfileController,
    updateProfileController,
    updateProfilePicController,
    forgotPasswordController,
    whoViewedProfileController,
    deleteAccountCtrl} = require('../controllers/userController');
const multer = require("multer")
const singleUpload = require('../middleware/uploadMiddleware')
const allupload = multer ({dest: 'uploads/'})
const { authMiddleware } = require('../middleware/authMiddleware');
const rateLimit = require("express-rate-limit")
// for limiting the rate
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// register
router.post('/register', limiter, singleUpload, registerController);

// Login
router.post('/login', limiter, loginController);

// Logout
router.post('/logout', limiter, logoutController);

// get user profile (protected route)
router.get('/profile', authMiddleware, getUserProfileController)


// GEt/api/v1/user/:id
router.get("/profile-viewers/:id/viewers", authMiddleware,whoViewedProfileController)
// update profile
router.put('/profile-update', authMiddleware, updateProfileController);

// update password
router.put('/update-password', authMiddleware, updatePasswordController);

// update profile picture
router.put('/update-picture', authMiddleware, singleUpload, updateProfilePicController);

//delete user account
router.delete('/delete-user', authMiddleware, deleteAccountCtrl)

// forgot password
router.post('/reset-password', forgotPasswordController)

module.exports = router;
