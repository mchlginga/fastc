const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { PATHS } = require("../utils/constant");
const ensureDirExist = require("../utils/ensureDirExist");

const user = { _id: "68da91eea8b1dbf0dfcc96b8", name: "Sample Sample" };
const course = { _id: "68e06045fbb1331af3defc02", title: "Masonry" };
const completionDate = new Date("2024-10-04");
const expirationDate = new Date("2026-10-04");

const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });
const fileName = `certificate_${user._id}_${course._id}.pdf`;
const filePath = path.join(PATHS.certDir, fileName);

ensureDirExist(PATHS.certDir);
const stream = fs.createWriteStream(filePath);
doc.pipe(stream);

// helper para center text safely sa loob ng border
function centerText(text, y, options = {}) {
    doc.text(text, 50, y, {
        width: doc.page.width - 100, // respect 50 margin left/right
        align: "center",
        ...options,
    });
}

// === BORDER ===
doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .lineWidth(4)
    .strokeColor("#3B82F6")
    .stroke();

doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70)
    .lineWidth(1)
    .strokeColor("#93C5FD")
    .stroke();

// === WATERMARK ===
doc.fontSize(120)
    .fillColor("#F3F4F6")
    .opacity(0.25)
    .rotate(-30, { origin: [400, 300] })
    .text("FAST-C", 100, 250, { align: "center", width: 600 });
doc.rotate(30, { origin: [400, 300] }).opacity(1);

// === HEADER ===
doc.font("Times-Bold").fontSize(24).fillColor("#1E3A8A");
centerText("FERNANDINO ASSESSMENT AND SKILLS TRAINING CENTER", 80);

doc.font("Times-Roman").fontSize(18).fillColor("#374151");
centerText("Certificate of Completion", 120);

// === BODY ===
doc.font("Times-Roman").fontSize(14).fillColor("#111827");
centerText("This certificate is proudly presented to", 180);

doc.font("Times-Bold").fontSize(30).fillColor("#000000");
centerText(user.name, 215);

doc.font("Times-Roman").fontSize(14).fillColor("#111827");
centerText("For successfully completing the training course on", 260);

doc.font("Times-Bold").fontSize(22).fillColor("#1E3A8A");
centerText(course.title, 290);

// === DATES ===
doc.font("Times-Roman").fontSize(12).fillColor("#374151");
centerText(`Completion Date: ${completionDate.toDateString()}`, 360);
centerText(`Expiration Date: ${expirationDate.toDateString()}`, 380);

// === SIGNATURES (centered layout) ===
const sigY = 460;
const marginX = 70; // start inside border
const sectionWidth = (doc.page.width - marginX * 2) / 2; // hati page sa 2

// left signature
doc.moveTo(marginX, sigY)
    .lineTo(marginX + sectionWidth - 40, sigY)
    .strokeColor("#6B7280")
    .stroke();

doc.fontSize(10)
    .fillColor("#111827")
    .text("Authorized Signature", marginX, sigY + 5, {
        width: sectionWidth - 40,
        align: "center",
    });

// right signature
const rightStart = marginX + sectionWidth + 40;
doc.moveTo(rightStart, sigY)
    .lineTo(marginX + sectionWidth * 2, sigY) // hanggang loob ng border
    .stroke();

doc.text("Training Director", rightStart, sigY + 5, {
    width: sectionWidth - 40,
    align: "center",
});

// === FOOTER ===
doc.fontSize(8).fillColor("#6B7280");
centerText(
    "Issued by FAST-C Digital Profiling and Certification System",
    doc.page.height - 60
);

doc.end();

stream.on("finish", () => console.log(`PDF saved to ${filePath}`));
stream.on("error", (err) => console.error(err));
