const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    desc: {
        type: String,
        max: 500
    },

    img: {
        type: String
    },

    like: {
        type: Array,
        default: []
    },

    comments: {
        type: [
            {
                userId: {
                    type: String,
                    required: true
                },

                username: {
                    type: String,
                    required: true
                },

                profilePicture: {
                    type: String,
                    default: ""
                },

                text: {
                    type: String,
                    required: true,
                    max: 200
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        default: []
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);
