const Shortlist = require("../models/shortlist");
const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const tf = require("@tensorflow/tfjs");

// Generate dynamic training data from users collection
async function generateTrainingData() {
    try {
        const trainees = await User.find({
            role: "user",
            profileStatus: "approved",
        }).select("skills certificates availability");
        const maxSkills = 5; // Max expected skills for normalization
        const maxCerts = 5; // Max expected certificates

        const trainingData = trainees.map((trainee) => {
            const skillMatch = (trainee.skills?.length || 0) / maxSkills;
            const certMatch = (trainee.certificates?.length || 0) / maxCerts;
            const availability =
                trainee.availability === "Full-time"
                    ? 1.0
                    : trainee.availability === "Part-time"
                    ? 0.67
                    : 0;
            // Weighted output: 40% skills, 30% certs, 10% availability, 20% base
            const output = Math.min(
                0.2 + 0.4 * skillMatch + 0.3 * certMatch + 0.1 * availability,
                0.98
            );

            return {
                input: { skillMatch, certMatch, availability },
                output,
            };
        });

        return trainingData.length > 0
            ? trainingData
            : [
                  // Fallback mock data if no trainees found
                  {
                      input: {
                          skillMatch: 1.0,
                          certMatch: 1.0,
                          availability: 0.67,
                      },
                      output: 0.95,
                  },
                  {
                      input: {
                          skillMatch: 0.5,
                          certMatch: 0.0,
                          availability: 1.0,
                      },
                      output: 0.6,
                  },
                  {
                      input: {
                          skillMatch: 0.0,
                          certMatch: 0.0,
                          availability: 0.67,
                      },
                      output: 0.25,
                  },
              ];
    } catch (error) {
        console.error("Failed to generate training data:", error);
        // Return fallback mock data on error
        return [
            {
                input: { skillMatch: 1.0, certMatch: 1.0, availability: 0.67 },
                output: 0.95,
            },
            {
                input: { skillMatch: 0.5, certMatch: 0.0, availability: 1.0 },
                output: 0.6,
            },
            {
                input: { skillMatch: 0.0, certMatch: 0.0, availability: 0.67 },
                output: 0.25,
            },
        ];
    }
}

// Simple TensorFlow.js model
let model;
async function trainModel() {
    if (model) return model;

    const trainingData = await generateTrainingData();
    model = tf.sequential();
    model.add(
        tf.layers.dense({ units: 10, activation: "relu", inputShape: [3] })
    );
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
    model.compile({ optimizer: "adam", loss: "meanSquaredError" });

    const xs = tf.tensor2d(
        trainingData.map((d) => [
            d.input.skillMatch,
            d.input.certMatch,
            d.input.availability,
        ]),
        [trainingData.length, 3]
    );
    const ys = tf.tensor2d(
        trainingData.map((d) => [d.output]),
        [trainingData.length, 1]
    );

    await model.fit(xs, ys, {
        epochs: 100,
        shuffle: true,
        verbose: 0,
    });

    xs.dispose();
    ys.dispose();
    return model;
}

const calculateJobMatch = async (
    trainee,
    filterSkills = [],
    filterCerts = []
) => {
    let recommendedCategory = "General Labor";

    // Prepare input features
    let skillMatch = 0;
    if (filterSkills.length > 0) {
        const matchedSkills =
            trainee.skills?.filter((s) => filterSkills.includes(s)).length || 0;
        skillMatch = matchedSkills / filterSkills.length;
    } else {
        skillMatch = (trainee.skills?.length || 0) / 5; // Normalize by max expected skills
    }

    let certMatch = 0;
    if (filterCerts.length > 0) {
        const matchedCerts =
            trainee.certificates?.filter((c) => filterCerts.includes(c.name))
                .length || 0;
        certMatch = matchedCerts / filterCerts.length;
    } else {
        certMatch = (trainee.certificates?.length || 0) / 5; // Normalize by max expected certs
    }

    const availability =
        trainee.availability === "Full-time"
            ? 1.0
            : trainee.availability === "Part-time"
            ? 0.67
            : 0;

    // Predict match score using TensorFlow.js
    const model = await trainModel();
    const inputTensor = tf.tensor2d(
        [[skillMatch, certMatch, availability]],
        [1, 3]
    );
    const prediction = model.predict(inputTensor);
    const score = (await prediction.data())[0] * 100; // Convert to percentage
    const matchPercentage = Math.min(Math.round(score), 100);

    inputTensor.dispose();
    prediction.dispose();

    // Category determination
    if (
        trainee.skills?.includes("Welding") ||
        trainee.skills?.includes("Masonry") ||
        trainee.skills?.includes("Carpentry")
    ) {
        recommendedCategory = "Construction & Trades";
    } else if (
        trainee.skills?.includes("Beauty Care") ||
        trainee.skills?.includes("Hairdressing") ||
        trainee.skills?.includes("Massage Therapy")
    ) {
        recommendedCategory = "Beauty & Wellness";
    } else if (
        trainee.skills?.includes("Bread and Pastry") ||
        trainee.skills?.includes("Housekeeping")
    ) {
        recommendedCategory = "Hospitality & Food Service";
    } else if (trainee.skills?.includes("Computer Software and Services")) {
        recommendedCategory = "Technology & IT";
    } else if (trainee.skills?.includes("Events Management")) {
        recommendedCategory = "Events & Coordination";
    } else if (
        trainee.skills?.includes("Dress-making") ||
        trainee.skills?.includes("Lantern Making")
    ) {
        recommendedCategory = "Arts & Crafts";
    }

    return {
        score: matchPercentage,
        category: recommendedCategory,
        matchLevel:
            matchPercentage >= 75
                ? "strong"
                : matchPercentage >= 50
                ? "medium"
                : "weak",
    };
};

exports.getJobMatches = async (req, res, next) => {
    try {
        const { skills, certifications, availability, issuer } = req.query;
        const shortlister = req.user.id;

        // Build query for approved trainees
        let query = { role: "user", profileStatus: "approved" };

        // Apply filters if provided
        let filterSkills = [];
        if (skills) {
            filterSkills = skills.split(",");
            query.skills = { $in: filterSkills };
        }
        let filterCerts = [];
        if (certifications) {
            filterCerts = certifications.split(",");
            query["certificates.name"] = { $in: filterCerts };
        }
        if (availability) {
            const availArray = availability.split(",");
            query.availability = { $in: availArray };
        }
        if (issuer) {
            const issuerArray = issuer.split(",");
            query["certificates.issuer"] = { $in: issuerArray };
        }

        // Fetch trainees
        const trainees = await User.find(query).select("-password");

        // Fetch shortlisted trainees for the current user
        const shortlisted = await Shortlist.find({ shortlister }).select(
            "trainee"
        );
        const shortlistedIds = new Set(
            shortlisted.map((s) => s.trainee.toString())
        );

        // Calculate matches for each trainee
        const traineesWithMatches = await Promise.all(
            trainees.map(async (trainee) => ({
                ...trainee.toObject(),
                match: await calculateJobMatch(
                    trainee,
                    filterSkills,
                    filterCerts
                ),
                isShortlisted: shortlistedIds.has(trainee._id.toString()),
            }))
        );

        res.status(statusCodes.OK).json({
            trainees: traineesWithMatches,
            shortlistedCount: shortlistedIds.size,
        });
    } catch (error) {
        next(error);
    }
};

// Shortlist controllers (unchanged)
exports.addShortlist = async (req, res, next) => {
    try {
        const { traineeId } = req.body;
        const shortlister = req.user.id;

        const existing = await Shortlist.findOne({
            shortlister,
            trainee: traineeId,
        });
        if (existing) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Already shortlisted." });
        }

        const shortlist = await Shortlist.create({
            shortlister,
            trainee: traineeId,
        });

        res.status(statusCodes.CREATED).json({ shortlist });
    } catch (error) {
        next(error);
    }
};

exports.removeShortlist = async (req, res, next) => {
    try {
        const { traineeId } = req.params;
        const shortlister = req.user.id;

        const deleted = await Shortlist.findOneAndDelete({
            shortlister,
            trainee: traineeId,
        });

        if (!deleted) {
            return res
                .status(statusCodes.NOT_FOUND)
                .json({ message: "Not shortlisted." });
        }

        res.status(statusCodes.OK).json({ message: "Removed from shortlist." });
    } catch (error) {
        next(error);
    }
};

exports.getShortlisted = async (req, res, next) => {
    try {
        const shortlister = req.user.id;
        const shortlisted = await Shortlist.find({ shortlister }).populate(
            "trainee",
            "-password"
        );

        res.status(statusCodes.OK).json({
            shortlisted: shortlisted.map((s) => s.trainee),
        });
    } catch (error) {
        next(error);
    }
};
