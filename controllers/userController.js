const User = require('../models/user');
const fs = require('fs');

exports.userProfile = async (req, res) => {
    const {_id, name, email, profilePic} = await User.findById(req.user.id);
    let profileOriginalPath = `http://localhost:${process.env.PORT}/${profilePic}`;
    res.status(200).json({data: {_id, name, email, profileOriginalPath}});
}

exports.updateUserProfile = async (req, res) => {
    try{
        const userData = await User.findById(req.user.id);
        userData.name = req.body.name;
        await userData.save();
        res.status(200).json({message: "Success"});
    }catch(error){
        res.status(400).json({message: "Error"});
    }
}

exports.userProfilePhoto = async (req, res) => {
    if(!req.file){
        res.status(400).json({message: "Profile not update"});
        return;
    }
    const { path } = req.file;
    try {
        // await User.findById(req.user.id).update({profilePic: path}); // simple update
        const userData = await User.findById(req.user.id); // update with save method

        // Delete old profile photo
        if(userData.profilePic){
            fs.unlink(userData.profilePic, (err) => {
                if (err) {
                    console.log("File not found.");
                    // throw err;
                }else{
                    console.log("Old File deleted successfully.");
                }
            });
        }
        
        userData.profilePic = path.replace(/\\/g, '/');
        await userData.save();
        
        let profileOriginalPath = `http://localhost:${process.env.PORT}/${userData.profilePic}`;

        res.status(200).json({message: "Success", data: {profile: profileOriginalPath}});
    } catch (error) {
        res.status(400).json({message: "Profile not update"});
    }
}

exports.logout = async (req, res) => {
    res.status(200).json({message: "logout successfully"});
}