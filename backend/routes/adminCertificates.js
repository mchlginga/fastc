const express = require("express");
const router = express.Router();
const { protect, checkRoles } = require("../middlewares/index");
const {
    getCertificates,
    getCertificateById,
    updateCertificateStatus,
    bulkUpdateCertificateStatus,
    revokeCertificate,
    regenerateCertificate,
    deleteCertificate,
    getCertificateStats,
    downloadCertificate,
    verifyCertificate,
    createCertificate,
    bulkRegenerateCertificates,
    bulkExpireCertificates,
} = require("../controllers/adminCertificates");

// All routes are protected and require admin role
router.use(protect);
router.use(checkRoles(["admin", "superAdmin"]));

// Get all certificates with filters
router.get("/certificates", getCertificates);

// Get certificate statistics
router.get("/certificates/stats", getCertificateStats);

// Get specific certificate
router.get("/certificates/:id", getCertificateById);

// Download certificate
router.get("/certificates/:id/download", downloadCertificate);

// Verify certificate (admin version)
router.get("/certificates/verify", verifyCertificate);

router.post("/certificates", createCertificate);

router.post("/certificates/bulk/regenerate", bulkRegenerateCertificates);

// Update certificate status
router.patch("/certificates/:id/status", updateCertificateStatus);

// Revoke certificate
router.patch("/certificates/:id/revoke", revokeCertificate);

router.patch("/certificates/bulk/expire", bulkExpireCertificates);

// Regenerate certificate
router.post("/certificates/:id/regenerate", regenerateCertificate);

// Bulk update certificate status
router.patch("/certificates/bulk/status", bulkUpdateCertificateStatus);

// Delete certificate
router.delete("/certificates/:id", deleteCertificate);

module.exports = router;
