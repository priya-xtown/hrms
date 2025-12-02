import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from 'url';

/**
 * Generates a PDF from an EJS template and data.
 *
 * @param {string} templatePath - Path to the EJS template (relative to project root or absolute)
 * @param {object} data - Data to render in the template
 * @returns {Promise<Buffer>} PDF file as buffer
 */
const exportToPdf = async (templatePath, data) => {
    try {
        // Resolve __dirname (needed for ES module)
        const __filename = fileURLToPath(import.meta.url);  
        const __dirname = path.dirname(__filename);

        const fullTemplatePath = path.isAbsolute(templatePath)
            ? templatePath
            : path.resolve(__dirname, "../views", templatePath);

        const html = await ejs.renderFile(fullTemplatePath, data);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" }
        });

        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error("PDF Export Error:", error);
        throw error;
    }
};

export default exportToPdf;