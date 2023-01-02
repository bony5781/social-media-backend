const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//Create a post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
})

//update a post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post updated");
        } else {
            res.status(403).json("You can only update your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Post has been deleted");
        } else {
            res.status(403).json("You can only delete your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//like/dislike a post
router.put('/:id/like', async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);
        if (!post.like.includes(req.body.userId)) {
            await post.updateOne({ $push: { like: req.body.userId } });
            res.status(200).json("Post has been liked");
        } else {
            await post.updateOne({ $pull: { like: req.body.userId } });
            res.status(200).json("Post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
})

//get timeline posts
router.get('/timeline/:userId', async (req, res) => {
    try {
        const currUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currUser._id });
        //If you are using loops, you should use promise all otherwise it
        //not fetch all the data for async functions
        const friendPosts = await Promise.all(
            currUser.following.map(friendId => {
                return Post.find({ userId: friendId });
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
})

//get user's all posts
router.get('/profile/:username', async (req, res) => {
    try {
        const user =  await User.findOne({ username: req.params.username });
        const posts =  await Post.find({userId : user._id});
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;