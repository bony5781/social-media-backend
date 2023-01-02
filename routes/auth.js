const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//Register new user
router.post('/register', async (req, res) => {

    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            city: req.body.city,
            relationship: req.body.relationship,
            from: req.body.from,
            profilePicture: req.body.profilePicture,
            coverPicture: req.body.coverPicture,
        });

        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/login', async (req, res) => {
    try {
        //Returns one document that satisfies the specified query criteria on the collection or view. If
        //multiple documents satisfy the query, this method returns the first document according to
        //the natural order which reflects the order of documents on the disk.
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("Wrong password");

        console.log("Successfull Login");
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router