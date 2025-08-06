const Job = require("../models/job");
const User = require("../models/user");

const calculateMatchScore = (user, job) => {
    let matchDetails = {
        certsMatched: [],
        certsMissing: []
    };

    if (job.certsRequired && job.certsRequired.length > 0) {
        const userCerts = user.certificates
        .filter(cert => {
            if (cert.expiresAt && new Date(cert.expiresAt) < new Date()) {
                return false;
            }
            return true;
        })
        .map(cert => cert.name.toLowerCase().trim());

        const requiredCerts = job.certsRequired.map(cert => cert?.toLowerCase().trim()) || [];

        requiredCerts.forEach(reqCerts => {
            if (userCerts.includes(reqCerts)) {
                matchDetails.certsMatched.push(reqCerts);
            } else {
                matchDetails.certsMissing.push(reqCerts);
            }
        });
    }

    return {
        matchDetails,
        isQualified: matchDetails.certsMissing.length === 0
    };
};

const findMatchingUserForJob = async (jobId) => {
    try {
        const job = await Job.findById(jobId).populate("postedBy", "name email");

        if (!job) {
            throw new Error ("Job not found");
        }

        const users = await User.find({ role: "user" });

        const userMatches = users.map(user => {
            const matchResult = calculateMatchScore(user, job);
            return {
                candidate: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    certificates: user.certificates,
                    profilePic: user.profilePic
                },
                ...matchResult
            }
        });

        return userMatches
            .filter(match => match.isQualified);
    } catch (error) {
        throw(error);
    }
};

module.exports = {
    calculateMatchScore,
    findMatchingUserForJob
};

