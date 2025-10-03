const Completion = require("../models/completion");
const Course = require("../models/course");
const Attendance = require("../models/attendance");
const { statusCodes } = require("../utils/constant");

exports.getCompletions = async (req, res, next) => {
    try {
        const { user, isAdmin } = req.query;
        const query = isAdmin ? {} : { user };
        const completions = await Completion.find(query).lean();
        const courses = completions.map((completion) => ({
            courseId: completion.course.toString(),
            title: completion.title,
            status: completion.status,
            progress: completion.progress,
            timeRemaining: calculateTimeRemaining(completion.endDate),
            completedLessons: completion.completedLessons.map((id) =>
                id.toString()
            ),
        }));
        res.status(statusCodes.OK).json({ courses });
    } catch (error) {
        next(error);
    }
};

exports.createCompletions = async (req, res, next) => {
    try {
        const { courseId, userId, endDate } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Course not found",
            });
        }
        const completion = await Completion.create({
            user: userId,
            course: courseId,
            title: course.title,
            endDate,
        });
        res.status(statusCodes.CREATED).json({
            courseId: completion.course.toString(),
            title: completion.title,
            status: completion.status,
            progress: completion.progress,
            timeRemaining: calculateTimeRemaining(completion.endDate),
            completedLessons: completion.completedLessons.map((id) =>
                id.toString()
            ),
        });
    } catch (error) {
        next(error);
    }
};

exports.completeLesson = async (req, res, next) => {
    try {
        const { courseId, lessonId, userId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Course not found",
            });
        }
        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Lesson not found",
            });
        }
        const completion = await Completion.findOne({
            user: userId,
            course: courseId,
        });
        if (!completion) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Completion not found",
            });
        }
        if (!completion.completedLessons.includes(lessonId)) {
            completion.completedLessons.push(lessonId);
            const totalLessons = course.lessons.length;
            const completedCount = completion.completedLessons.length;
            completion.progress = Math.round(
                (completedCount / totalLessons) * 100
            );
            await completion.save();
        }
        res.status(statusCodes.OK).json({
            courseId: completion.course.toString(),
            title: completion.title,
            status: completion.status,
            progress: completion.progress,
            timeRemaining: calculateTimeRemaining(completion.endDate),
            completedLessons: completion.completedLessons.map((id) =>
                id.toString()
            ),
        });
    } catch (error) {
        next(error);
    }
};

exports.markAttendance = async (req, res, next) => {
    try {
        const { courseId, lessonId, userId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Course not found",
            });
        }
        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Lesson not found",
            });
        }
        const attendance = await Attendance.create({
            user: userId,
            course: courseId,
            lesson: lessonId,
            timestamp: new Date(),
        });
        res.status(statusCodes.CREATED).json({
            attendanceId: attendance._id.toString(),
            userId: attendance.user.toString(),
            courseId: attendance.course.toString(),
            lessonId: attendance.lesson.toString(),
            timestamp: attendance.timestamp,
        });
    } catch (error) {
        next(error);
    }
};

const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Expired";
};
