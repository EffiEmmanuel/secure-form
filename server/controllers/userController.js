const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const crypto = require('crypto-js')
// const user = require('../models/user');

const registerUser = asyncHandler(async (req, res) => {

    // This function decrypts encrypted texts
    const decryptWithAES = (ciphertext) => {
        const passphrase = process.env.DECRYPTION_KEY;
        const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    };

    let body = req.body;

    // For some reason, req.body returns the first field as the key to all the other fields
    // So, I'm taking out the first field which is meant to be the firstname field
    let index = Object.keys(req.body)[0];
    
    // Getting the remaining part of our data
    let remainingParts = req.body[`${index}`].split(',');
    
    let result = remainingParts.filter(element => {
        return element !== '';
    });

    // Adding the firstname field to the result array so I can correct the Utf8 data all at once
    result.unshift(index);

    // I noticed all + signs in the encrypted texts were replaced by ' '
    // This causes the decryption to fail 60% of the time which makes the system inefficient
    // So, I am replacing all intances of ' ' with + signs like they are originally meant to be
    let correctUtfData = result.map((data) => {
        return data.replaceAll(' ', '+');
    });

    // Decrypt all the corrected Utf8 data
    let decryptedValues = correctUtfData.map((data) => {
        return decryptWithAES(data);
    });

    // Use destructuring to get all fields in plain text
    const [firstname, lastname, email, username, password ] = decryptedValues;

    // If any field is missing, throw an error, Missing fields
    if(!firstname || !lastname || !email || !username || !password) {
        res.status(400);
        throw new Error('Missing fields');
    }

    // Checking the database if the email provided is already registered
    const userExists = await User.findOne({email});

    // If the user already exists, throw an error
    if(userExists) {
        throw new Error('User already exists!');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        firstname,
        lastname,
        email,
        username,
        password: hashedPassword,
    });

    // If user is successully created, log user details to the console
    if(user) {
        console.log({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            username: user.username,
            password: user.password,
            token: generateToken(user._id)
            // token: generateToken(user._id, user.firstname, user.lastname, user.email, user.username, user.password)
        })
    }

});

// @public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            username: user.username,
            password: user.password,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error('Invalid Credentials');
    }

    // res.json({message: 'Login User'})
});

// @private
const getMe = asyncHandler(async (req, res) => {
    const { _id, firstname, lastname, email } = await User.findById(req.user.id);
    res.status(200).json({
        _id,
        firstname,
        lastname,
        email
    });
});


const generateToken = (id) => {
    return jwt.sign({ id, firstname, lastname, email, username, password }, process.env.JWTPRIVATEKEY, {
        expiresIn: "30d"
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
};