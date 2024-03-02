const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.registerUser = async(req, res) => {
    try {
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        const checkUser = await User.findOne({email: email});
        if(checkUser){
            res.status(400).json({message: "Email already exists"});
        }else{
            const user = new User(
                {name, email, password: hashedPassword}
            );
            await user.save();
            res.status(201).json({
                message: 'User saved successfully'
            });
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

exports.loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, createdAt, updatedAt, __v , ...others} = user._doc;
            const token = jwt.sign({
                id: others._id,
                email: others.email,
                profilePic: others.profilePic,
            }, process.env.SECRETKEY, {expiresIn: '1d'})
            others._token = token;
            res.json({message: 'Login successful', data: others});
        } else {
            res.status(401).json({ message: 'Email or password not match' });
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}