const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  
  console.log("Cookies received:", req.cookies); // Debug log
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const decodeData = JWT.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decodeData._id);
    
    if (!req.user) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized User"
        });
    }

    next();
}catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(401).send({
      success: false,
      message: "Admin only",
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
