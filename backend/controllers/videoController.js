const Video = require('../models/Video');

// @desc    Get all videos (with search and filter)
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        let query = {};

        // Search text
        if (search) {
            query.$text = { $search: search };
        }

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Sorting
        let sortOption = { createdAt: -1 }; // Default: Latest
        if (sort === 'views') {
            sortOption = { views: -1 };
        } else if (sort === 'likes') {
            sortOption = { likes: -1 }; // Count of likes is trickier with array, but we'll sort by likes array length in aggregation or just use -1 if it was a number. Actually $size sorting needs aggregation. For MVP, we'll keep it simple and just do latest / views initially if likes array sorting is complex in basic find.
            // For MVP, letting sort by views suffice as the main option.
        }

        const videos = await Video.find(query)
            .populate('uploader', 'username avatar')
            .sort(sortOption);

        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('uploader', 'username avatar bio');

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (filePath, folder, resourceType) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: resourceType,
            chunk_size: 6000000 // 6MB chunks for stability on large videos
        });
        return result;
    } catch (error) {
        throw error;
    }
};

// @desc    Add a video
// @route   POST /api/videos
// @access  Private
const createVideo = async (req, res) => {
    let uploadedFiles = []; // Track to delete from disk

    try {
        const { title, description, category, tags, sourceType } = req.body;
        
        let finalVideoUrl = req.body.videoUrl;
        let finalThumbnailUrl = req.body.thumbnailUrl;

        // Validation for title, desc, cat (shared fields)
        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Please provide required base fields' });
        }

        if (sourceType === 'cloudinary') {
            if (!req.files || !req.files['video'] || !req.files['thumbnail']) {
                return res.status(400).json({ message: 'Please provide both video and thumbnail files for Cloudinary upload.' });
            }

            const videoFilePath = req.files['video'][0].path;
            const thumbnailFilePath = req.files['thumbnail'][0].path;
            uploadedFiles.push(videoFilePath, thumbnailFilePath);

            try {
                // Upload Video
                console.log("Starting video upload to Cloudinary (Disk Stream)...");
                const videoResult = await uploadToCloudinary(
                    videoFilePath,
                    'skillshare/videos',
                    'video' // Cloudinary SDK upload() chunks this natively reliably when reading from path.
                );
                finalVideoUrl = videoResult.secure_url;
                console.log("Video uploaded successfully:", finalVideoUrl);

                // Upload Thumbnail
                console.log("Starting thumbnail upload to Cloudinary (Disk Stream)...");
                const thumbnailResult = await uploadToCloudinary(
                    thumbnailFilePath,
                    'skillshare/thumbnails',
                    'image'
                );
                finalThumbnailUrl = thumbnailResult.secure_url;
                console.log("Thumbnail uploaded successfully:", finalThumbnailUrl);

            } catch (uploadError) {
                console.error("CLOUDINARY UPLOAD ERROR:", uploadError);
                return res.status(500).json({ 
                    message: 'Cloudinary upload failed: ' + (uploadError.message || JSON.stringify(uploadError)), 
                    error: uploadError 
                });
            }
        } else {
            // Telegram processing
            if (!finalVideoUrl || !finalThumbnailUrl) {
                 return res.status(400).json({ message: 'Please provide both videoUrl and thumbnailUrl for telegram links.' });
            }
        }

        const video = await Video.create({
            title,
            description,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            thumbnailUrl: finalThumbnailUrl,
            videoUrl: finalVideoUrl,
            sourceType: sourceType || 'telegram',
            uploader: req.user.id,
        });

        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        // Clean up uploads directory
        uploadedFiles.forEach(file => {
            fs.unlink(file, (err) => {
                if (err) console.error("Error deleting local file:", err);
            });
        });
    }
};

// @desc    Update video view count
// @route   PUT /api/videos/:id/view
// @access  Public
const addView = async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json({ message: 'View added', views: video.views });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's uploaded videos
// @route   GET /api/videos/user/:userId
// @access  Public
const getUserVideos = async (req, res) => {
    try {
        const videos = await Video.find({ uploader: req.params.userId })
            .sort({ createdAt: -1 });
            
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVideos,
    getVideoById,
    createVideo,
    addView,
    getUserVideos
};
