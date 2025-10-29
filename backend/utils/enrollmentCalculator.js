class EnrollmentCalculator {
    /**
     * Calculate when a user's access to a course should expire
     * @param {Object} course - The course object
     * @param {Date} enrolledAt - When the user enrolled
     * @returns {Date} - When access expires
     */
    static calculateAccessExpiry(course, enrolledAt = new Date()) {
        // If course has a fixed end date, use that
        if (course.courseEndDate) {
            return new Date(course.courseEndDate);
        }

        // Default: 1 year from enrollment for self-paced courses
        const oneYearFromNow = new Date(enrolledAt);
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        return oneYearFromNow;
    }

    /**
     * Check if a user can still enroll in a course
     * @param {Object} course - The course object
     * @returns {boolean} - Whether enrollment is allowed
     */
    static canEnroll(course) {
        if (!course.isActive) return false;

        if (course.enrollmentDeadline) {
            return new Date() <= new Date(course.enrollmentDeadline);
        }

        return true; // Always open for enrollment
    }

    /**
     * Check if a user's enrollment has expired
     * @param {Object} enrollment - The enrollment object
     * @returns {boolean} - Whether enrollment has expired
     */
    static isEnrollmentExpired(enrollment) {
        return new Date() > new Date(enrollment.accessExpiresAt);
    }

    /**
     * Check if course content is still accessible
     * @param {Object} course - The course object
     * @returns {boolean} - Whether course content is accessible
     */
    static isCourseAccessible(course) {
        if (!course.isActive) return false;

        if (course.courseEndDate) {
            return new Date() <= new Date(course.courseEndDate);
        }

        return true; // Always accessible
    }
}

module.exports = EnrollmentCalculator;
