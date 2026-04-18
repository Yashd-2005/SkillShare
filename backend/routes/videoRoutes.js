const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure Multer to use disk storage
const upload = multer({ dest: 'uploads/' });

const {
    getVideos,
    getVideoById,
    createVideo,
    addView,
    getUserVideos
} = require('../controllers/videoController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getVideos)
    .post(protect, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createVideo);

router.route('/:id')
    .get(getVideoById);

router.put('/:id/view', addView);
router.get('/user/:userId', getUserVideos);

module.exports = router;
