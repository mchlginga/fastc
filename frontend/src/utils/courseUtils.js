// Image URL helper function
export const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-course.jpg";

    if (imagePath.startsWith("http")) return imagePath;

    if (imagePath.startsWith("/uploads")) {
        const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        return `${backendUrl}${imagePath}`;
    }

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    return `${backendUrl}/uploads/courses/${imagePath}`;
};

// Helper function to format enrollment deadline
export const getEnrollmentDeadline = (course) => {
    if (!course.endDate) {
        return {
            text: "Enrollment Open",
            status: "open",
            color: "bg-green-100 text-green-800",
        };
    }

    const now = new Date();
    const endDate = new Date(course.endDate);
    const timeDiff = endDate - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysRemaining > 0) {
        return {
            text: `Enroll until ${endDate.toLocaleDateString()}`,
            status: "open",
            color: "bg-blue-100 text-blue-800",
        };
    } else {
        return {
            text: "Enrollment Closed",
            status: "closed",
            color: "bg-red-100 text-red-800",
        };
    }
};

// Helper function to get course access type with better formatting
export const getCourseAccessType = (course) => {
    if (
        course.enrollmentPeriod === 0 ||
        course.enrollmentPeriod === undefined
    ) {
        return {
            text: "Self-paced",
            color: "bg-purple-100 text-purple-800",
            displayText: "Self-paced",
        };
    } else {
        let text;

        if (course.enrollmentPeriod >= 30) {
            const months = Math.round(course.enrollmentPeriod / 30);
            text = `${months} month${months > 1 ? "s" : ""} access`;
        } else if (course.enrollmentPeriod >= 7) {
            const weeks = Math.round(course.enrollmentPeriod / 7);
            text = `${weeks} week${weeks > 1 ? "s" : ""} access`;
        } else {
            text = `${course.enrollmentPeriod} day${
                course.enrollmentPeriod > 1 ? "s" : ""
            } access`;
        }

        return {
            text: text,
            color: "bg-orange-100 text-orange-800",
            displayText: text,
        };
    }
};

// Helper function to format course duration for display
export const getCourseDurationDisplay = (course) => {
    const accessType = getCourseAccessType(course);
    return accessType.displayText;
};
