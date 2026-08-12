const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a skill name']
    },
    level: {
        type: Number,
        required: [true, 'Please add a skill level (percentage from 1 to 100)'],
        min: 1,
        max: 100
    },
    imageUrl: {
        type: String,
        required: false // Making it optional as requested
    },
    category: {
        type: String,
        required: [true, 'Please specify a category (e.g., Frontend, Backend, Database)'],
        enum: ['Frontend', 'Backend', 'CMS', 'Database', 'DevOps', 'Other']
    }
}, { collection: 'skills' });

module.exports = mongoose.model('Skill', SkillSchema);
