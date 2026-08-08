const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    liveLink: {
        type: String
    },
    githubLink: {
        type: String
    },
    tags: {
        type: [String],
        default: []
    },
    features: {
        type: [String],
        default: []
    },
    challenges: {
        type: String
    },
    futurePlans: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'projects' });

module.exports = mongoose.model('Project', ProjectSchema);
