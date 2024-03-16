const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth')
const upload = require('../helper/uploadFile')

router.get('/userProfile', auth ,userController.userProfile);
router.post('/updateUserProfile', auth, userController.updateUserProfile);
router.post('/userProfilePhoto', auth, upload.single('image'), userController.userProfilePhoto);

// user chat routes
router.get('/all-users', auth, userController.allUsers)
router.post('/send-message', auth, userController.sendMessage)
router.post('/get-user-message', auth, userController.getUserMessage)
router.get('/logout', auth, userController.logout);

module.exports = router;
