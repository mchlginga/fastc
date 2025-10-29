const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const bcrypt = require("bcrypt");

// Get all users with filtering and pagination
exports.getUsers = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = "",
            role = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build filter object
        let filter = {};

        // Search filter
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { surname: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
            ];
        }

        // Status filter
        if (status && status !== "all") {
            filter.profileStatus = status;
        }

        // Role filter
        if (role && role !== "all") {
            filter.role = role;
        }

        // Sort configuration
        const sortConfig = {};
        sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Execute query with pagination
        const users = await User.find(filter)
            .select("-password -verificationCode -resetPasswordToken")
            .sort(sortConfig)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Get total count for pagination
        const total = await User.countDocuments(filter);

        res.status(statusCodes.OK).json({
            success: true,
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                usersPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select(
            "-password -verificationCode -resetPasswordToken"
        );

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Create new user (Add User function)
exports.createUser = async (req, res, next) => {
    try {
        const {
            firstName,
            surname,
            companyName,
            email,
            password,
            role,
            contactNumber,
            address,
            profileStatus = "approved", // Default to approved for admin-created users
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(statusCodes.CONFLICT).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Validate required fields based on role
        if (role === "company" && !companyName) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Company name is required for company users",
            });
        }

        if (role !== "company" && (!firstName || !surname)) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "First name and surname are required",
            });
        }

        // Create user object
        const userData = {
            email: email.toLowerCase(),
            password: password || "defaultPassword123", // In production, generate a random password and send email
            role: role || "user",
            privacyAgreement: true,
            profileStatus,
            contactNumber,
            address,
            isEmailVerified: true, // Admin-created users are auto-verified
        };

        // Add role-specific fields
        if (role === "company") {
            userData.companyName = companyName;
        } else {
            userData.firstName = firstName;
            userData.surname = surname;
        }

        const user = await User.create(userData);

        // Return user without sensitive data
        const userResponse = await User.findById(user._id).select(
            "-password -verificationCode -resetPasswordToken"
        );

        res.status(statusCodes.CREATED).json({
            success: true,
            message: "User created successfully",
            user: userResponse,
        });
    } catch (error) {
        next(error);
    }
};

// Update user status
exports.updateUserStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { profileStatus: status },
            { new: true, runValidators: true }
        ).select("-password -verificationCode -resetPasswordToken");

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: `User status updated to ${status}`,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Bulk update user status
exports.bulkUpdateUserStatus = async (req, res, next) => {
    try {
        const { userIds, status } = req.body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "User IDs array is required",
            });
        }

        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const result = await User.updateMany(
            { _id: { $in: userIds } },
            { profileStatus: status }
        );

        res.status(statusCodes.OK).json({
            success: true,
            message: `Updated ${result.modifiedCount} users to ${status}`,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        next(error);
    }
};

// Update user details
exports.updateUser = async (req, res, next) => {
    try {
        const {
            firstName,
            surname,
            companyName,
            email,
            role,
            contactNumber,
            address,
            skills,
            availability,
        } = req.body;

        const updateData = {};

        // Only include fields that are provided
        if (email) updateData.email = email.toLowerCase();
        if (role) updateData.role = role;
        if (contactNumber) updateData.contactNumber = contactNumber;
        if (address) updateData.address = address;
        if (skills) updateData.skills = skills;
        if (availability) updateData.availability = availability;

        // Role-specific fields
        if (role === "company" && companyName) {
            updateData.companyName = companyName;
        } else if (firstName && surname) {
            updateData.firstName = firstName;
            updateData.surname = surname;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }).select("-password -verificationCode -resetPasswordToken");

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
