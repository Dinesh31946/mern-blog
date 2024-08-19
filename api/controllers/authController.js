const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === '') {
        return res.status(400).json({error: 'All fields are required'});
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        const user = await newUser.save();
        res.status(201).json({user});
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        console.error(error);
        res.status(500).json({error: error.message});
    }

}

module.exports = {
    signup
};