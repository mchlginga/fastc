const User = require("../models/user");
const Course = require("../models/course");
const Certificate = require("../models/certificate");
const Skill = require("../models/skill");
const ExportLog = require("../models/exportLog");
const { statusCodes } = require("../utils/constant");
const tf = require("@tensorflow/tfjs");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });

const filterTraineeDataForCompany = (trainees, companyProfileStatus) => {
    if (companyProfileStatus !== "pending") {
        return trainees; // Return full data for approved companies
    }

    // For pending companies, remove sensitive contact information
    return trainees.map((trainee) => ({
        ...trainee,
        email: "Contact details available after company approval", // 🆕 HIDE email
        contactNumber: undefined, // 🆕 REMOVE contact number
        // Keep all other data intact for job matching exploration
    }));
};

// Model and stats
let trainedModel = null;
let isTraining = false;
let trainingPromise = null;
let datasetStats = null;

const getDatasetStatistics = async () => {
    const cacheKey = "datasetStatistics";
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

        const skillCounts = [];
        const certCounts = [];
        const availabilityStats = {
            "Full-time": 0,
            "Part-time": 0,
            "Not specified": 0,
        };

        for (const trainee of trainees) {
            const skillSet = new Set();
            if (trainee.certificates) {
                trainee.certificates.forEach((cert) => {
                    cert.verifiedSkills?.forEach((vs) => {
                        if (vs.skill?.name) skillSet.add(vs.skill.name);
                    });
                });
            }
            skillCounts.push(skillSet.size);
            certCounts.push(trainee.certificates?.length || 0);
            availabilityStats[trainee.availability || "Not specified"]++;
        }

        // 🆕 IMPROVED: Better percentile calculation
        const calculatePercentiles = (arr) => {
            if (arr.length === 0) return [0, 0, 0, 0, 0];
            const sorted = [...arr].sort((a, b) => a - b);
            return [25, 50, 75, 90, 95].map(
                (p) => sorted[Math.floor((p / 100) * (sorted.length - 1))]
            );
        };

        const stats = {
            skillCounts: {
                max: Math.max(...skillCounts, 1),
                mean:
                    skillCounts.reduce((a, b) => a + b, 0) /
                    Math.max(skillCounts.length, 1),
                percentiles: calculatePercentiles(skillCounts),
            },
            certCounts: {
                max: Math.max(...certCounts, 1),
                mean:
                    certCounts.reduce((a, b) => a + b, 0) /
                    Math.max(certCounts.length, 1),
                percentiles: calculatePercentiles(certCounts),
            },
            availability: availabilityStats,
            totalTrainees: trainees.length,
        };

        cache.set(cacheKey, stats);
        return stats;
    } catch (error) {
        console.error("Failed to calculate dataset statistics:", error);
        return {
            skillCounts: { max: 5, mean: 2, percentiles: [1, 2, 3, 4, 5] },
            certCounts: { max: 3, mean: 1, percentiles: [1, 1, 2, 3, 3] },
            availability: {
                "Full-time": 50,
                "Part-time": 30,
                "Not specified": 20,
            },
            totalTrainees: 0,
        };
    }
};

// 🆕 IMPROVED: Enhanced dynamic skills data
const getDynamicSkillsData = async () => {
    const cacheKey = "dynamicSkillsData";
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const skills = await Skill.find({ isActive: true }).lean();
        const certificates = await Certificate.find({ status: "active" })
            .populate("verifiedSkills.skill")
            .lean();

        const skillPopularity = {};
        certificates.forEach((cert) => {
            cert.verifiedSkills?.forEach((vs) => {
                if (vs.skill) {
                    skillPopularity[vs.skill.name] =
                        (skillPopularity[vs.skill.name] || 0) + 1;
                }
            });
        });

        const result = {
            skills: skills.map((s) => s.name),
            categories: [...new Set(skills.map((s) => s.category))],
            certificates: [
                ...new Set(
                    certificates.map((cert) => cert.title).filter(Boolean)
                ),
            ],
            skillPopularity,
        };

        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Failed to fetch dynamic skills data:", error);
        return {
            skills: [],
            categories: [],
            certificates: [],
            skillPopularity: {},
        };
    }
};

// 🆕 IMPROVED: Enhanced training data with better distribution
async function generateTrainingData() {
    const cacheKey = "trainingData";
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
        const stats = await getDatasetStatistics();
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

        let trainingData = [];

        for (const trainee of trainees) {
            const skillSet = new Set();
            trainee.certificates?.forEach((cert) => {
                cert.verifiedSkills?.forEach((vs) => {
                    if (vs.skill?.name) skillSet.add(vs.skill.name);
                });
            });

            const skillCount = skillSet.size;
            const certCount = trainee.certificates?.length || 0;

            // 🆕 IMPROVED: Better percentile calculation
            const skillPercentile = calculatePercentile(
                stats.skillCounts.percentiles,
                skillCount
            );
            const certPercentile = calculatePercentile(
                stats.certCounts.percentiles,
                certCount
            );

            const availability =
                trainee.availability === "Full-time"
                    ? 1.0
                    : trainee.availability === "Part-time"
                    ? 0.67
                    : 0.33;

            // 🆕 IMPROVED: More realistic scoring distribution
            const baseScore = 0.25;
            const skillContribution = 0.4 * skillPercentile;
            const certContribution = 0.3 * certPercentile;
            const availabilityContribution = 0.05 * availability;

            const output = Math.min(
                baseScore +
                    skillContribution +
                    certContribution +
                    availabilityContribution,
                0.9 // Lower cap to leave room for filter bonuses
            );

            trainingData.push({
                input: { skillPercentile, certPercentile, availability },
                output,
                metadata: {
                    skillCount,
                    certCount,
                    availability: trainee.availability,
                },
            });
        }

        // 🆕 IMPROVED: Add more realistic training cases
        const enhancedTraining = [
            // Baseline cases
            {
                input: {
                    skillPercentile: 0.0,
                    certPercentile: 0.0,
                    availability: 0.33,
                },
                output: 0.2,
            },
            {
                input: {
                    skillPercentile: 0.0,
                    certPercentile: 0.0,
                    availability: 0.67,
                },
                output: 0.25,
            },
            {
                input: {
                    skillPercentile: 0.0,
                    certPercentile: 0.0,
                    availability: 1.0,
                },
                output: 0.3,
            },

            // Typical cases (2 skills, 2 certs)
            {
                input: {
                    skillPercentile: 0.5,
                    certPercentile: 0.5,
                    availability: 0.67,
                },
                output: 0.54,
            },
            {
                input: {
                    skillPercentile: 0.5,
                    certPercentile: 0.5,
                    availability: 1.0,
                },
                output: 0.56,
            },

            // Single skill/cert cases
            {
                input: {
                    skillPercentile: 0.3,
                    certPercentile: 0.5,
                    availability: 0.67,
                },
                output: 0.49,
            },
            {
                input: {
                    skillPercentile: 0.3,
                    certPercentile: 0.3,
                    availability: 1.0,
                },
                output: 0.46,
            },

            // Top performers
            {
                input: {
                    skillPercentile: 1.0,
                    certPercentile: 1.0,
                    availability: 1.0,
                },
                output: 0.85,
            },
        ];

        const result = [...trainingData, ...enhancedTraining];
        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Failed to generate training data:", error);
        return getFallbackTrainingData();
    }
}

// 🆕 IMPROVED: Better percentile calculation
function calculatePercentile(percentiles, value) {
    if (percentiles.length === 0 || value === 0) return 0;

    for (let i = 0; i < percentiles.length; i++) {
        if (value <= percentiles[i]) {
            return (i + 1) / (percentiles.length + 1);
        }
    }
    return 1.0;
}

function getFallbackTrainingData() {
    return [
        {
            input: {
                skillPercentile: 0.0,
                certPercentile: 0.0,
                availability: 0.33,
            },
            output: 0.2,
        },
        {
            input: {
                skillPercentile: 0.5,
                certPercentile: 0.5,
                availability: 0.67,
            },
            output: 0.54,
        },
        {
            input: {
                skillPercentile: 0.5,
                certPercentile: 0.5,
                availability: 1.0,
            },
            output: 0.56,
        },
        {
            input: {
                skillPercentile: 1.0,
                certPercentile: 1.0,
                availability: 1.0,
            },
            output: 0.85,
        },
    ];
}

// Train TensorFlow model
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
        d.input.skillPercentile,
        d.input.certPercentile,
        d.input.availability,
    ]);
    const outputs = trainingData.map((d) => [d.output]);

    const inputTensor = tf.tensor2d(inputs);
    const outputTensor = tf.tensor2d(outputs);

    const model = tf.sequential({
        layers: [
            tf.layers.dense({ inputShape: [3], units: 12, activation: "relu" }),
            tf.layers.dense({ units: 8, activation: "relu" }),
            tf.layers.dense({ units: 4, activation: "relu" }),
            tf.layers.dense({ units: 1, activation: "sigmoid" }),
        ],
    });

    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: "meanSquaredError",
    });

    await model.fit(inputTensor, outputTensor, {
        epochs: 100,
        verbose: 0,
        batchSize: 16,
        validationSplit: 0.2,
    });

    inputTensor.dispose();
    outputTensor.dispose();

    console.log("✅ TensorFlow model trained successfully");
    return model;
}

// 🆕 COMPLETELY REWRITTEN: Enhanced matching algorithm with proper filter stacking
const calculateJobMatch = async (
    trainee,
    filterSkills = [],
    filterCerts = [],
    filterAvailability = []
) => {
    let recommendedCategory = "General Labor";

    try {
        if (!datasetStats) {
            datasetStats = await getDatasetStatistics();
        }

        // Get verified skills and certificates
        const userSkillsData = await trainee.getSkills();
        const userSkills = userSkillsData.map((us) => us.skill.name);
        const certificates = await Certificate.find({
            user: trainee._id,
            status: "active",
        })
            .populate("verifiedSkills.skill")
            .lean();

        const skillCount = userSkills.length;
        const certCount = certificates.length;

        // Calculate base percentiles
        const baseSkillPercentile = calculatePercentile(
            datasetStats.skillCounts.percentiles,
            skillCount
        );
        const baseCertPercentile = calculatePercentile(
            datasetStats.certCounts.percentiles,
            certCount
        );

        // 🆕 IMPROVED: Availability scoring with filter consideration
        const traineeAvailability = trainee.availability || "Not specified";
        let availabilityScore =
            traineeAvailability === "Full-time"
                ? 1.0
                : traineeAvailability === "Part-time"
                ? 0.67
                : 0.33;

        // 🆕 NEW: Availability filter bonus/penalty
        let availabilityBonus = 0;
        let availabilityPenalty = 0;

        if (filterAvailability.length > 0) {
            if (filterAvailability.includes(traineeAvailability)) {
                // Bonus for matching availability
                availabilityBonus = 0.08; // 8% bonus for matching availability
            } else {
                // Penalty for mismatched availability
                availabilityPenalty = 0.1; // 10% penalty for availability mismatch
            }
        }

        // 🆕 IMPROVED: Enhanced filter matching with stacking bonuses
        let skillFilterBonus = 0;
        let certFilterBonus = 0;

        // Skill filter matching (STACKING - each match adds more)
        if (filterSkills.length > 0) {
            const matchedSkills = userSkills.filter((s) =>
                filterSkills.some(
                    (fs) =>
                        s.toLowerCase().includes(fs.toLowerCase()) ||
                        fs.toLowerCase().includes(s.toLowerCase())
                )
            );

            const matchRatio = matchedSkills.length / filterSkills.length;

            // Base bonus for any match
            skillFilterBonus += matchRatio * 0.1; // 10% base bonus

            // 🆕 ADDITIONAL bonus for multiple matches (STACKING)
            if (matchedSkills.length > 1) {
                skillFilterBonus += (matchedSkills.length - 1) * 0.05; // 5% extra per additional match
            }

            // Extra bonus for perfect match
            if (matchRatio === 1.0) {
                skillFilterBonus += 0.05; // 5% perfect match bonus
            }
        }

        // Certificate filter matching (STACKING - each match adds more)
        if (filterCerts.length > 0) {
            const matchedCerts = certificates.filter((cert) =>
                filterCerts.some((fc) =>
                    cert.title.toLowerCase().includes(fc.toLowerCase())
                )
            );

            const matchRatio = matchedCerts.length / filterCerts.length;

            // Base bonus for any match
            certFilterBonus += matchRatio * 0.08; // 8% base bonus

            // 🆕 ADDITIONAL bonus for multiple matches (STACKING)
            if (matchedCerts.length > 1) {
                certFilterBonus += (matchedCerts.length - 1) * 0.04; // 4% extra per additional match
            }

            // Extra bonus for perfect match
            if (matchRatio === 1.0) {
                certFilterBonus += 0.04; // 4% perfect match bonus
            }
        }

        // Calculate base score using TensorFlow
        const model = await getTrainedModel();
        const inputTensor = tf.tensor2d([
            [baseSkillPercentile, baseCertPercentile, availabilityScore],
        ]);
        const prediction = model.predict(inputTensor);
        let baseScore = (await prediction.data())[0] * 100;

        inputTensor.dispose();
        prediction.dispose();

        // 🆕 IMPROVED: Apply all bonuses and penalties
        let finalScore = baseScore;

        // Apply filter bonuses (can stack)
        finalScore += skillFilterBonus * 100;
        finalScore += certFilterBonus * 100;

        // Apply availability bonus/penalty
        finalScore += availabilityBonus * 100;
        finalScore -= availabilityPenalty * 100;

        // Ensure score stays within bounds
        finalScore = Math.max(0, Math.min(finalScore, 100));
        finalScore = Math.round(finalScore);

        // Enhanced category determination
        const categorySkillMap = {};
        userSkillsData.forEach((us) => {
            const category = us.skill.category;
            categorySkillMap[category] = (categorySkillMap[category] || 0) + 1;
        });

        let maxCount = 0;
        for (const [category, count] of Object.entries(categorySkillMap)) {
            if (count > maxCount) {
                maxCount = count;
                recommendedCategory = category;
            }
        }

        // Determine match level
        let matchLevel = "weak";
        if (finalScore >= 70) matchLevel = "strong";
        else if (finalScore >= 45) matchLevel = "medium";

        return {
            score: finalScore,
            category: recommendedCategory,
            matchLevel,
            factors: {
                verifiedSkills: skillCount,
                certificates: certCount,
                availability: availabilityScore,
                skillMatch: skillFilterBonus * 100,
                certMatch: certFilterBonus * 100,
                availabilityBonus: availabilityBonus * 100,
                availabilityPenalty: availabilityPenalty * 100,
                filterBonus: (skillFilterBonus + certFilterBonus) * 100,
                baseScore: Math.round(baseScore),
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
            score: 25,
            category: "General Labor",
            matchLevel: "weak",
            factors: {
                verifiedSkills: 0,
                certificates: 0,
                availability: 0.33,
                skillMatch: 0,
                certMatch: 0,
                availabilityBonus: 0,
                availabilityPenalty: 0,
                filterBonus: 0,
                baseScore: 25,
                skillDetails: [],
            },
        };
    }
};

exports.getJobMatches = async (req, res, next) => {
    try {
        const { skills, certifications, availability, issuer, category } =
            req.query;

        const cacheKey = `jobMatches_${JSON.stringify(req.query)}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log("📦 Serving job matches from cache");
            return res.status(statusCodes.OK).json(cached);
        }

        // Build query
        let query = { role: "user", profileStatus: "approved" };
        let filterSkills = skills ? skills.split(",") : [];
        let filterCerts = certifications ? certifications.split(",") : [];
        let filterAvailability = availability ? availability.split(",") : [];

        if (availability) {
            query.availability = { $in: filterAvailability };
        }

        // Optimized query
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

        // Process trainees
        const batchSize = 5;
        const traineesWithMatches = [];

        for (let i = 0; i < trainees.length; i += batchSize) {
            const batch = trainees.slice(i, i + batchSize);
            const batchPromises = batch.map(async (trainee) => {
                const userInstance = new User(trainee);
                const match = await calculateJobMatch(
                    userInstance,
                    filterSkills,
                    filterCerts,
                    filterAvailability // 🆕 NEW: Pass availability filters
                );
                return { ...trainee, match };
            });

            const batchResults = await Promise.all(batchPromises);
            traineesWithMatches.push(...batchResults);
        }

        // Apply additional filters
        let filteredTrainees = traineesWithMatches;

        if (category) {
            const categoryArray = category.split(",");
            filteredTrainees = filteredTrainees.filter((t) =>
                categoryArray.includes(t.match.category)
            );
        }

        if (issuer) {
            const issuerArray = issuer.split(",");
            filteredTrainees = filteredTrainees.filter((t) =>
                t.certificates?.some((cert) =>
                    issuerArray.includes(cert.issuedBy)
                )
            );
        }

        // 🆕 NEW: Filter contact details for pending companies
        const companyProfileStatus = req.user?.profileStatus;
        const finalTrainees = filterTraineeDataForCompany(
            filteredTrainees,
            companyProfileStatus
        );

        // Get dynamic data
        const dynamicData = await getDynamicSkillsData();

        const response = {
            trainees: finalTrainees, // 🆕 UPDATED: Use filtered trainees
            filterOptions: {
                skills: dynamicData.skills,
                certifications: dynamicData.certificates,
                categories: dynamicData.categories,
                issuer: ["FAST-C", "TESDA", "Other"],
                availability: ["Full-time", "Part-time"],
            },
            datasetStats: {
                totalTrainees: datasetStats?.totalTrainees || 0,
                maxSkills: datasetStats?.skillCounts.max || 5,
                maxCerts: datasetStats?.certCounts.max || 3,
            },
        };

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
        if (cached) return res.status(statusCodes.OK).json(cached);

        const stats = await getDatasetStatistics();
        const dynamicData = await getDynamicSkillsData();

        const response = {
            stats: {
                totalTrainees: stats.totalTrainees,
                traineesWithCertificates: await Certificate.distinct("user", {
                    status: "active",
                }).then((users) => users.length),
                fullTimeTrainees: stats.availability["Full-time"] || 0,
                partTimeTrainees: stats.availability["Part-time"] || 0,
                topSkills: Object.entries(dynamicData.skillPopularity || {})
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([name, count]) => ({ name, count })),
            },
        };

        cache.set(cacheKey, response);
        res.status(statusCodes.OK).json(response);
    } catch (error) {
        console.error("Matching stats error:", error);
        next(error);
    }
};

// Clear cache endpoint
exports.clearCache = async (req, res, next) => {
    try {
        cache.flushAll();
        trainedModel = null;
        isTraining = false;
        trainingPromise = null;
        datasetStats = null;

        res.status(statusCodes.OK).json({
            message: "Cache cleared successfully",
        });
    } catch (error) {
        console.error("Clear cache error:", error);
        next(error);
    }
};
