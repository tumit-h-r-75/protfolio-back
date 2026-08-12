const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const Skill = require('../models/Skill');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio-skills',
        format: async (req, file) => 'png',
        public_id: (req, file) => 'skill-' + Date.now(),
    },
});

const upload = multer({ storage: storage });

const normalizeCategory = (category = '') => {
    const normalized = category.toLowerCase().trim();
    if (normalized === 'frontend') return 'Frontend';
    if (normalized === 'backend') return 'Backend';
    if (normalized === 'cms' || normalized === 'cms & data') return 'CMS';
    if (normalized === 'database' || normalized === 'data') return 'Database';
    if (normalized === 'devops') return 'DevOps';
    return 'Other';
};

// @route   GET api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ level: -1 });
        res.json(skills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/skills
// @desc    Create a new skill
// @access  Private
router.post('/', [authMiddleware, upload.single('image')], async (req, res) => {
    const { name, level, category } = req.body;

    if (!name || !level || !category) {
        return res.status(400).json({ msg: 'Name, level, and category are required' });
    }

    try {
        const newSkill = new Skill({
            name,
            level,
            category: normalizeCategory(category),
            imageUrl: req.file ? req.file.path : undefined
        });

        const skill = await newSkill.save();
        res.json(skill);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/skills/:id
// @desc    Update a skill
// @access  Private
router.put('/:id', [authMiddleware, upload.single('image')], async (req, res) => {
    const { name, level, category } = req.body;

    const skillFields = { name, level, category: normalizeCategory(category) };
    if (req.file) {
        skillFields.imageUrl = req.file.path;
    }

    try {
        let skill = await Skill.findById(req.params.id);
        if (!skill) return res.status(404).json({ msg: 'Skill not found' });

        skill = await Skill.findByIdAndUpdate(
            req.params.id,
            { $set: skillFields },
            { new: true }
        );

        res.json(skill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/skills/:id
// @desc    Delete a skill
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) return res.status(404).json({ msg: 'Skill not found' });

        // Optional: Delete image from Cloudinary
        if (skill.imageUrl) {
            // const publicId = skill.imageUrl.split('/').pop().split('.')[0];
            // await cloudinary.uploader.destroy(`portfolio-skills/${publicId}`);
        }

        await Skill.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Skill removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
