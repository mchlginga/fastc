const express = require("express");
const router = express.Router();

const { protect, checkRoles } = require("../middlewares/index");
const {
    createJob,
    getJobs,
    getJobById,
    updateJobById,
    deleteJobById
} = require("../controllers/job");

router.post("/", protect, checkRoles(["admin", "company"]), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, checkRoles(["admin", "company"]), updateJobById);
router.delete("/:id", protect, checkRoles(["admin", "company"]), deleteJobById);
module.exports = router;