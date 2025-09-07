const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const generateToken = require("../utils/generateToken");
const config = require("../config/index");

// cookie config
const COOKIE_NAME = "token";
const cookieOptions = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 1000
};

const setCookieToken = (res, userId) => {
    const token = generateToken(userId);
    res.cookie(COOKIE_NAME, token, cookieOptions);
};

exports.register = async (req, res, next) => {
    const {
        username,
        firstName,
        surname,
        email,
        password,
        city,
        country,
        privacyAgreement
    } = req.body;

    try {
        const existing = await User.findOne({ email });
        
        if (existing) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "Email already exist." });
        }

        const user = await User.create({
            username,
            firstName,
            surname,
            email,
            password,
            city,
            country
        });

        setCookieToken(res, user.id);

        return res.status(statusCodes.CREATED).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: "Invalid Email or Password"} );
        }

        setCookieToken(res, user.id);
        
        return res.status(statusCodes.OK).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    const { _id, name, email, role } = req.user;

    try {
        return res.status(statusCodes.OK).json({
            user: { _id, name, email, role }
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res, next) => {
    try {
        res.clearCookie(COOKIE_NAME, {
            ...cookieOptions,
            maxAge: 0
        });

        return res.status(statusCodes.OK).json({ message: "Logged out successfully"});
    } catch (error) {
        next(error);
    }
};