const router = require('express').Router();

const Post = require('../models/Post');

const User = require('../models/User');


// Create a post
router.post('/', async (req, res) => {

    const newPost = new Post(req.body);

    try {

        const savedPost = await newPost.save();

        res.status(200).json(savedPost);

    } catch (err) {

        res.status(500).json({
            message: "Failed to create post"
        });
    }
});


// Update a post
router.put('/:id', async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {

            await post.updateOne({
                $set: req.body
            });

            res.status(200).json("Post updated");

        } else {

            res.status(403).json("You can only update your own post");
        }

    } catch (err) {

        res.status(500).json({
            message: "Failed to update post"
        });
    }
});


// Delete a post
router.delete('/:id', async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {

            await post.deleteOne();

            res.status(200).json("Post deleted");

        } else {

            res.status(403).json("You can only delete your own post");
        }

    } catch (err) {

        res.status(500).json({
            message: "Failed to delete post"
        });
    }
});


// Like / Dislike a post
router.put('/:id/like', async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post.like.includes(req.body.userId)) {

            await post.updateOne({
                $push: { like: req.body.userId }
            });

            res.status(200).json("Post liked");

        } else {

            await post.updateOne({
                $pull: { like: req.body.userId }
            });

            res.status(200).json("Post disliked");
        }

    } catch (err) {

        res.status(500).json({
            message: "Failed to like post"
        });
    }
});


// Add comment to post
router.put('/:id/comment', async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (!req.body.text || req.body.text.trim() === "") {

            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const newComment = {

            userId: req.body.userId,

            username: req.body.username,

            profilePicture: req.body.profilePicture || "",

            text: req.body.text,

            createdAt: new Date()
        };

        await post.updateOne({
            $push: {
                comments: newComment
            }
        });

        res.status(200).json("Comment added successfully");

    } catch (err) {

        res.status(500).json({
            message: "Failed to add comment"
        });
    }
});


// Get single post
router.get('/:id', async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        res.status(200).json(post);

    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch post"
        });
    }
});


// Get timeline posts
router.get('/timeline/:userId', async (req, res) => {

    try {

        const currUser = await User.findById(req.params.userId);

        const userPosts = await Post.find({
            userId: currUser._id
        });

        const friendPosts = await Promise.all(

            currUser.following.map(friendId => {

                return Post.find({
                    userId: friendId
                });
            })
        );

        res.status(200).json(
            userPosts.concat(...friendPosts)
        );

    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch timeline"
        });
    }
});


// Get user's posts
router.get('/profile/:username', async (req, res) => {

    try {

        const user = await User.findOne({
            username: req.params.username
        });

        const posts = await Post.find({
            userId: user._id
        });

        res.status(200).json(posts);

    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch profile posts"
        });
    }
});

module.exports = router;
