const User = require("../models/user");
const Course = require("../models/course");
const Certificate = require("../models/certificate");
const Skill = require("../models/skill");
const ExportLog = require("../models/exportLog");
const { statusCodes } = require("../utils/constant");
const tf = require("@tensorflow/tfjs");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache

// 🆕 IMPROVED: Pre-trained model with lazy loading
let trainedModel = null;
let isTraining = false;
let trainingPromise = null;

// 🆕 NEW: Get skills dynamically from Skills collection (cached)
const getDynamicSkillsData = async () => {
    const cacheKey = "dynamicSkillsData";
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        // Get all active skills from Skills taxonomy
        const skills = await Skill.find({ isActive: true }).lean();

        // Get unique categories
        const categories = [...new Set(skills.map((s) => s.category))];

        // Get skill names for filtering
        const skillNames = skills.map((s) => s.name);

        // Get all active certificates with populated course info
        const certificates = await Certificate.find({ status: "active" })
            .populate({
                path: "verifiedSkills.skill",
                select: "name category",
            })
            .lean();

        // Extract certificate titles for filtering
        const certificateTitles = [
            ...new Set(certificates.map((cert) => cert.title).filter(Boolean)),
        ];

        const result = {
            skills: skillNames,
            categories: categories,
            certificates: certificateTitles,
        };

        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Failed to fetch dynamic skills data:", error);
        return {
            skills: [],
            categories: [],
            certificates: [],
        };
    }
};

// 🆕 IMPROVED: Training data using verified skills (optimized)
async function generateTrainingData() {
    const cacheKey = "trainingData";
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const trainees = await User.find({
            role: "user",
            profileStatus: "approved",
        })
            .populate({
                path: "certificates",
                match: { status: "active" },
                populate: { path: "verifiedSkills.skill" },
            })
            .lean();

        const dynamicData = await getDynamicSkillsData();
        const maxSkills = Math.max(10, dynamicData.skills.length / 2);
        const maxCerts = Math.max(5, dynamicData.certificates.length / 2);

        let trainingData = [];

        for (const trainee of trainees) {
            // Get verified skills count
            const skillSet = new Set();
            if (trainee.certificates) {
                trainee.certificates.forEach((cert) => {
                    if (cert.verifiedSkills) {
                        cert.verifiedSkills.forEach((vs) => {
                            if (vs.skill && vs.skill.name) {
                                skillSet.add(vs.skill.name);
                            }
                        });
                    }
                });
            }

            const skillCount = skillSet.size;
            const certCount = trainee.certificates?.length || 0;

            // Calculate matches
            const skillMatch = Math.min(skillCount / maxSkills, 1);
            const certMatch = Math.min(certCount / maxCerts, 1);

            const availability =
                trainee.availability === "Full-time"
                    ? 1.0
                    : trainee.availability === "Part-time"
                    ? 0.67
                    : 0.33;

            // Baseline output with enhanced factors
            const completionBonus = certCount > 0 ? 0.1 : 0;
            const output = Math.min(
                0.15 +
                    0.5 * skillMatch +
                    0.25 * certMatch +
                    0.1 * availability +
                    completionBonus,
                0.95
            );

            trainingData.push({
                input: { skillMatch, certMatch, availability },
                output,
            });
        }

        // Add specialized training cases
        const certificates = await Certificate.find({ status: "active" })
            .populate("user")
            .populate("verifiedSkills.skill")
            .lean();

        certificates.forEach((cert) => {
            if (
                cert.user &&
                cert.verifiedSkills &&
                cert.verifiedSkills.length > 0
            ) {
                const skillMatch = 1.0;
                const certMatch = 1.0;
                const availability =
                    cert.user.availability === "Full-time"
                        ? 1.0
                        : cert.user.availability === "Part-time"
                        ? 0.67
                        : 0.33;

                trainingData.push({
                    input: { skillMatch, certMatch, availability },
                    output: Math.min(
                        0.9 + 0.05 * skillMatch + 0.05 * certMatch,
                        0.98
                    ),
                });
            }
        });

        const result =
            trainingData.length > 0 ? trainingData : getFallbackTrainingData();

        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Failed to generate training data:", error);
        return getFallbackTrainingData();
    }
}

// Fallback training data if no real data exists
function getFallbackTrainingData() {
    return [
        {
            input: { skillMatch: 0.0, certMatch: 0.0, availability: 0.33 },
            output: 0.15,
        },
        {
            input: { skillMatch: 0.5, certMatch: 0.5, availability: 0.67 },
            output: 0.55,
        },
        {
            input: { skillMatch: 1.0, certMatch: 1.0, availability: 1.0 },
            output: 0.95,
        },
        {
            input: { skillMatch: 0.8, certMatch: 0.6, availability: 1.0 },
            output: 0.75,
        },
        {
            input: { skillMatch: 0.3, certMatch: 0.2, availability: 0.67 },
            output: 0.35,
        },
    ];
}

// 🆕 IMPROVED: Train TensorFlow model with singleton pattern
async function getTrainedModel() {
    if (trainedModel) return trainedModel;
    if (isTraining) return trainingPromise;

    isTraining = true;
    trainingPromise = trainModelInternal();
    trainedModel = await trainingPromise;
    isTraining = false;

    return trainedModel;
}

async function trainModelInternal() {
    const trainingData = await generateTrainingData();

    const inputs = trainingData.map((d) => [
        d.input.skillMatch,
        d.input.certMatch,
        d.input.availability,
    ]);
    const outputs = trainingData.map((d) => [d.output]);

    const inputTensor = tf.tensor2d(inputs);
    const outputTensor = tf.tensor2d(outputs);

    const model = tf.sequential({
        layers: [
            tf.layers.dense({ inputShape: [3], units: 8, activation: "relu" }),
            tf.layers.dense({ units: 4, activation: "relu" }),
            tf.layers.dense({ units: 1, activation: "sigmoid" }),
        ],
    });

    model.compile({ optimizer: "adam", loss: "meanSquaredError" });

    await model.fit(inputTensor, outputTensor, {
        epochs: 50,
        verbose: 0,
        batchSize: 32,
    });

    inputTensor.dispose();
    outputTensor.dispose();

    console.log("✅ TensorFlow model trained successfully");
    return model;
}

// 🆕 IMPROVED: Enhanced matching algorithm using Skills taxonomy
const calculateJobMatch = async (
    trainee,
    filterSkills = [],
    filterCerts = []
) => {
    let recommendedCategory = "General Labor";

    try {
        // 🆕 Get verified skills using new method
        const userSkillsData = await trainee.getSkills();
        const userSkills = userSkillsData.map((us) => us.skill.name);

        // Get certificates for matching
        const certificates = await Certificate.find({
            user: trainee._id,
            status: "active",
        })
            .populate("verifiedSkills.skill")
            .lean();

        // Calculate skill match
        let skillMatch = 0;
        if (filterSkills.length > 0) {
            const matchedSkills = userSkills.filter((s) =>
                filterSkills.some(
                    (fs) =>
                        s.toLowerCase().includes(fs.toLowerCase()) ||
                        fs.toLowerCase().includes(s.toLowerCase())
                )
            ).length;
            skillMatch = matchedSkills / filterSkills.length;
        } else {
            const maxSkills = 5;
            skillMatch = Math.min(userSkills.length / maxSkills, 1);
        }

        // Calculate certificate match
        let certMatch = 0;
        if (filterCerts.length > 0) {
            const matchedCerts = certificates.filter((cert) =>
                filterCerts.some((fc) =>
                    cert.title.toLowerCase().includes(fc.toLowerCase())
                )
            ).length;
            certMatch = matchedCerts / filterCerts.length;
        } else {
            const maxCerts = 3;
            certMatch = Math.min(certificates.length / maxCerts, 1);
        }

        // Calculate availability score
        const availability =
            trainee.availability === "Full-time"
                ? 1.0
                : trainee.availability === "Part-time"
                ? 0.67
                : 0.33;

        // Predict match score using TensorFlow (with pre-trained model)
        const model = await getTrainedModel();
        const inputTensor = tf.tensor2d(
            [[skillMatch, certMatch, availability]],
            [1, 3]
        );
        const prediction = model.predict(inputTensor);
        const score = (await prediction.data())[0] * 100;
        const matchPercentage = Math.min(Math.round(score), 100);

        inputTensor.dispose();
        prediction.dispose();

        // 🆕 Enhanced category determination using Skills taxonomy
        const categorySkillMap = {};

        // Build category map from user's verified skills
        userSkillsData.forEach((us) => {
            const category = us.skill.category;
            if (!categorySkillMap[category]) {
                categorySkillMap[category] = 0;
            }
            categorySkillMap[category]++;
        });

        // Find category with most skills
        let maxCount = 0;
        for (const [category, count] of Object.entries(categorySkillMap)) {
            if (count > maxCount) {
                maxCount = count;
                recommendedCategory = category;
            }
        }

        // Fallback to General Labor if no skills found
        if (maxCount === 0) {
            recommendedCategory = "General Labor";
        }

        return {
            score: matchPercentage,
            category: recommendedCategory,
            matchLevel:
                matchPercentage >= 80
                    ? "strong"
                    : matchPercentage >= 60
                    ? "medium"
                    : "weak",
            factors: {
                verifiedSkills: userSkills.length,
                certificates: certificates.length,
                availability: availability,
                skillDetails: userSkillsData.map((us) => ({
                    name: us.skill.name,
                    category: us.skill.category,
                    level: us.level,
                    certCount: us.certificateCount,
                })),
            },
        };
    } catch (error) {
        console.error("Error calculating job match:", error);
        return {
            score: 0,
            category: "General Labor",
            matchLevel: "weak",
            factors: {
                verifiedSkills: 0,
                certificates: 0,
                availability: 0.33,
                skillDetails: [],
            },
        };
    }
};

// 🆕 IMPROVED: Enhanced job matching with Skills taxonomy and caching
exports.getJobMatches = async (req, res, next) => {
    try {
        const { skills, certifications, availability, issuer, category } =
            req.query;

        // Create cache key based on query parameters
        const cacheKey = `jobMatches_${JSON.stringify(req.query)}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log("📦 Serving job matches from cache");
            return res.status(statusCodes.OK).json(cached);
        }

        // Build query for approved trainees
        let query = { role: "user", profileStatus: "approved" };

        // Apply filters
        let filterSkills = [];
        if (skills) {
            filterSkills = skills.split(",");
        }

        let filterCerts = [];
        if (certifications) {
            filterCerts = certifications.split(",");
        }

        if (availability) {
            const availArray = availability.split(",");
            query.availability = { $in: availArray };
        }

        // 🆕 OPTIMIZED: Fetch only necessary fields
        const trainees = await User.find(query)
            .populate({
                path: "certificates",
                match: { status: "active" },
                select: "title issuedBy verifiedSkills",
                populate: {
                    path: "verifiedSkills.skill",
                    model: "Skill",
                    select: "name category",
                },
            })
            .select("name email contactNumber availability profileStatus")
            .lean();

        // 🆕 OPTIMIZED: Calculate matches in parallel with limit
        const traineesWithMatches = await Promise.all(
            trainees.map(async (trainee) => {
                // Convert lean object to User instance for method access
                const userInstance = new User(trainee);
                const match = await calculateJobMatch(
                    userInstance,
                    filterSkills,
                    filterCerts
                );

                return {
                    ...trainee,
                    match,
                };
            })
        );

        // Apply additional filters based on match results
        let filteredTrainees = traineesWithMatches;

        // Filter by category if specified
        if (category) {
            const categoryArray = category.split(",");
            filteredTrainees = filteredTrainees.filter((t) =>
                categoryArray.includes(t.match.category)
            );
        }

        // Filter by issuer if specified
        if (issuer) {
            const issuerArray = issuer.split(",");
            filteredTrainees = filteredTrainees.filter((t) =>
                t.certificates?.some((cert) =>
                    issuerArray.includes(cert.issuedBy)
                )
            );
        }

        // Get dynamic filter options
        const dynamicData = await getDynamicSkillsData();

        const response = {
            trainees: filteredTrainees,
            filterOptions: {
                skills: dynamicData.skills,
                certifications: dynamicData.certificates,
                categories: dynamicData.categories,
                issuer: ["FAST-C", "TESDA", "Other"],
                availability: ["Full-time", "Part-time"],
            },
        };

        // Cache the response
        cache.set(cacheKey, response);

        res.status(statusCodes.OK).json(response);
    } catch (error) {
        console.error("Job matching error:", error);
        next(error);
    }
};

// Enhanced CSV export logging
exports.logCsvExport = async (req, res, next) => {
    try {
        const { exportType, recordsCount, filters, matchCriteria } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const validTypes = [
            "trainees",
            "courses",
            "certificates",
            "job-matching",
        ];
        if (!validTypes.includes(exportType)) {
            return res.status(statusCodes.BAD_REQUEST).json({
                message: "Invalid export type",
            });
        }

        await ExportLog.create({
            user: userId,
            role: userRole,
            exportType,
            recordsCount: recordsCount || 0,
            filters: filters || {},
            matchCriteria: matchCriteria || {},
            exportedAt: new Date(),
        });

        res.status(statusCodes.CREATED).json({
            message: "Export logged successfully",
        });
    } catch (error) {
        console.error("Export logging error:", error);
        next(error);
    }
};

// Get matching statistics
exports.getMatchingStats = async (req, res, next) => {
    try {
        const cacheKey = "matchingStats";
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.status(statusCodes.OK).json(cached);
        }

        const totalTrainees = await User.countDocuments({
            role: "user",
            profileStatus: "approved",
        });

        // Get trainees with active certificates
        const traineesWithCertificates = await Certificate.distinct("user", {
            status: "active",
        });

        const fullTimeTrainees = await User.countDocuments({
            role: "user",
            profileStatus: "approved",
            availability: "Full-time",
        });

        const partTimeTrainees = await User.countDocuments({
            role: "user",
            profileStatus: "approved",
            availability: "Part-time",
        });

        // Get top skills from Skills taxonomy
        const topSkills = await Skill.aggregate([
            {
                $lookup: {
                    from: "certificates",
                    localField: "_id",
                    foreignField: "verifiedSkills.skill",
                    as: "certificates",
                },
            },
            {
                $match: {
                    "certificates.status": "active",
                },
            },
            {
                $project: {
                    name: 1,
                    category: 1,
                    count: { $size: "$certificates" },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 10,
            },
        ]);

        const response = {
            stats: {
                totalTrainees,
                traineesWithCertificates: traineesWithCertificates.length,
                fullTimeTrainees,
                partTimeTrainees,
                topSkills,
            },
        };

        cache.set(cacheKey, response);
        res.status(statusCodes.OK).json(response);
    } catch (error) {
        console.error("Matching stats error:", error);
        next(error);
    }
};

// 🆕 NEW: Clear cache endpoint (for development)
exports.clearCache = async (req, res, next) => {
    try {
        cache.flushAll();
        trainedModel = null;
        isTraining = false;
        trainingPromise = null;

        res.status(statusCodes.OK).json({
            message: "Cache cleared successfully",
        });
    } catch (error) {
        console.error("Clear cache error:", error);
        next(error);
    }
};
