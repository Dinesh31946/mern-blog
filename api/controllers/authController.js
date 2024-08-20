const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { errorHandler } = require('../utils/error');

const signup = async (req, res, next) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === '') {
        // return res.status(400).json({error: 'All fields are required'});
        return next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        const user = await newUser.save();
        res.status(201).json({message: 'User successfully signup.', data: user});
    } catch (error) {
        if(error.code === 11000){
            // return res.status(400).json({ error: 'Username or email already exists' });
            next(errorHandler(400, 'Username or email already exists'));
        }
        next(error);
    }

}

module.exports = {
    signup
};