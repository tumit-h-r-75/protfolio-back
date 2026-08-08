const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio-projects',
        format: async (req, file) => 'png', // supports promises as well
        public_id: (req, file) => 'project-' + Date.now(),
    },
});

const upload = multer({ storage: storage });

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/projects
// @desc    Create a new project
// @access  Private
const parseList = (value) => value ? value.split(',').map(item => item.trim()).filter(Boolean) : [];

router.post('/', [authMiddleware, upload.single('image')], async (req, res) => {
    const { title, description, liveLink, githubLink, tags, features, challenges, futurePlans } = req.body;

    // Basic validation
    if (!title || !description) {
        return res.status(400).json({ msg: 'Title and description are required' });
    }
    if (!req.file) {
        return res.status(400).json({ msg: 'Image is required' });
    }

    try {
        const newProject = new Project({
            title,
            description,
            liveLink,
            githubLink,
            tags: parseList(tags),
            features: parseList(features),
            challenges,
            futurePlans,
            imageUrl: req.file.path // URL from Cloudinary
        });

        const project = await newProject.save();
        res.json(project);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', [authMiddleware, upload.single('image')], async (req, res) => {
    const { title, description, liveLink, githubLink, tags, features, challenges, futurePlans } = req.body;

    const projectFields = { title, description, liveLink, githubLink, challenges, futurePlans };
    if (tags !== undefined) projectFields.tags = parseList(tags);
    if (features !== undefined) projectFields.features = parseList(features);
    if (req.file) {
        projectFields.imageUrl = req.file.path;
    }

    try {
        let project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ msg: 'Project not found' });

        project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: projectFields },
            { new: true }
        );

        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ msg: 'Project not found' });
        
        // Optional: Delete image from Cloudinary
        if (project.imageUrl) {
            const publicId = project.imageUrl.split('/').pop().split('.')[0];
            // Be careful with folder structure in public_id
            // await cloudinary.uploader.destroy(`portfolio-projects/${publicId}`);
        }

        await Project.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
