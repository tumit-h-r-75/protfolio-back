const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/media
// @desc    Get all images from Cloudinary folders
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Fetch images from the projects folder
        const projectsImages = await cloudinary.search
            .expression('folder:portfolio-projects')
            .sort_by('public_id', 'desc')
            .max_results(50)
            .execute();

        // Fetch images from the skills folder
        const skillsImages = await cloudinary.search
            .expression('folder:portfolio-skills')
            .sort_by('public_id', 'desc')
            .max_results(50)
            .execute();

        const allImages = {
            projects: projectsImages.resources.map(file => ({
                url: file.secure_url,
                public_id: file.public_id,
                created_at: file.created_at
            })),
            skills: skillsImages.resources.map(file => ({
                url: file.secure_url,
                public_id: file.public_id,
                created_at: file.created_at
            })),
        };

        res.json(allImages);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/media
// @desc    Delete an image from Cloudinary
// @access  Private
router.delete('/', authMiddleware, async (req, res) => {
    const { public_id } = req.body;

    if (!public_id) {
        return res.status(400).json({ msg: 'Public ID is required' });
    }

    try {
        await cloudinary.uploader.destroy(public_id);
        res.json({ msg: 'Image deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
