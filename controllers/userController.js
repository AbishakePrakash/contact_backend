const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// @GET - Get All Contacts      @path - /api/contacts           @access - private
const GET_ALL_USERS = asyncHandler(async (req, res) => {
    console.log(req.header);
    const user = await User.find();
    res.status(200).json(user)
})

// @GET - Get All Contacts      @path - /api/contacts           @access - private
const GET_AN_USER = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json(user)
})

// @GET - Get All Contacts      @path - /api/contacts           @access - private
const UPDATE_AN_USER = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404)
        throw new Error("Contact not found")
    }

    console.log("User found");

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        console.log("User updated successfully");

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log('err', error);
    }
})

// @GET - Get All Contacts      @path - /api/contacts           @access - private
const DELETE_AN_USER = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404)
        throw new Error("Contact not found")
    }

    console.log("User found");

    try {
        await User.deleteOne({ _id: req.params.id })
        console.log("User deleted");
    } catch (error) {
        console.log("error", error);
    }
    res.status(200).json(User)
})

// @POST - Register a User      @path - /api/users/register     @access - public
const REGISTER_USER = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        res.statusCode(400)
        throw new Error("All fields are mandatory")
    };

    const emailAvailable = await User.findOne({ email });

    if (emailAvailable) {
        res.status(400)
        throw new Error("User already registered")
    };

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("hashedPassword: ", hashedPassword, "password: ", password);

    const user = await User.create({
        username, email, password: hashedPassword
    })

    console.log(`User created: ${user}`);

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email, username: user.username })
    } else {
        res.status(400)
        throw new Error("User data is not valid")
    }

    res.json({ message: "Register the User" })
});

// @POST - Login a User         @path - /api/users/login        @access - public
const LOGIN_USER = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({ email })

    // if (!user) {
    //     res.status(400);
    //     throw new Error("User not found")
    // }

    if (user && (await bcrypt.compare(password, user.password))) {

        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id,
            },
        }, process.env.ACCESS_TOKEN,
            { expiresIn: "15m" }
        );
        res.status(200).json({ accessToken, user });
    } else {
        res.status(401);
        throw new Error("Invalid Username or Password");
    }
});

// @POST - Current User Info    @path - /api/users/current      @access - private
const CURRENT_USER_INFO = asyncHandler(async (req, res) => {
    console.log(req.user);
    res.json(req.user)
});

module.exports = { REGISTER_USER, LOGIN_USER, CURRENT_USER_INFO, GET_ALL_USERS, GET_AN_USER, UPDATE_AN_USER, DELETE_AN_USER }