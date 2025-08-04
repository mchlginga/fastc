const fs = require("fs/promises");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");

const { PATHS } = require("./constant");
const ensureFileExist = require("./ensureFileExist");

ensureFileExist(PATHS.certsHbsFile);

const generateCert = async (data) => {
    const templatePath = PATHS.certsHbsFile;
    const templateHtml = await fs.readFile(templatePath, "utf-8");

    const template = handlebars.compile(templateHtml);
    const html = template(data);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent( html, {waitUntil: "load" });

    const pdfBuffer = await page.pdf({ format: "A4", landscape: true });

    await browser.close();
    return pdfBuffer;
};

module.exports = generateCert;