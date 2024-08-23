const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { errorHandler } = require('../utils/error');
const jwt = require('jsonwebtoken');

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

const signin = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }
    try {

        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400, 'Invalid username or password'));
        }

        const token = jwt.sign(
            {id: validUser._id},
            process.env.JWT_SECRET,
            { expiresIn: '15m' },
        )

        const {password: pass, ...rest} = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true
        })
        .json(rest);
        
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

const google = async (req, res, next) => {
    const {name, email, googlePhotoUrl} = req.body;
    try {
        const user =  await User.findOne({email});
        if(user) {
            const token = jwt.sign(
                {id: user._id},
                process.env.JWT_SECRET,
                { expiresIn: '15m' },
            )

            const {password, ...rest} = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest);
        }else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });
            await newUser.save();
            const token = jwt.sign(
                {id: newUser._id},
                process.env.JWT_SECRET,
                { expiresIn: '15m' },
            )
            const {password,...rest} = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest);
        }
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

module.exports = {
    signup,
    signin,
    google,
};