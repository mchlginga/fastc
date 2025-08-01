const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const existing = await User.findOne({ email });
        
        if (existing) {
            res.status(statusCodes.BAD_REQUEST).json({ message: "Email already exist." });
        }

        const user = await User.create({ name, email, password });

        res.status(statusCodes.CREATED).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
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
            res.status(statusCodes.UNAUTHORIZED).json({ message: "Invalid Email or Password"} );
        }

        res.status(statusCodes.OK).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        });
    } catch (error) {
        next(error);
    }
};