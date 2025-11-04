import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = [
    {
        url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-weights_manifest.json",
        name: "tiny_face_detector_model-weights_manifest.json",
    },
    {
        url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-shard1",
        name: "tiny_face_detector_model-shard1",
    },
    {
        url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-weights_manifest.json",
        name: "face_landmark_68_model-weights_manifest.json",
    },
    {
        url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-shard1",
        name: "face_landmark_68_model-shard1",
    },
    {
        url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-weights_manifest.json",
        name: "face_recognition_model-weights_manifest.json",
    },
    {
        url: "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard1",
        name: "face_recognition_model-shard1",
    },
];

const modelsDir = path.join(__dirname, "../public/models");
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

async function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);

        https
            .get(url, (response) => {
                // Check for redirect
                if (
                    response.statusCode === 302 ||
                    response.statusCode === 301
                ) {
                    downloadFile(response.headers.location, filepath)
                        .then(resolve)
                        .catch(reject);
                    return;
                }

                if (response.statusCode !== 200) {
                    reject(
                        new Error(
                            `Failed to download: ${url} - Status: ${response.statusCode}`
                        )
                    );
                    return;
                }

                response.pipe(file);

                file.on("finish", () => {
                    file.close();
                    resolve();
                });
            })
            .on("error", (err) => {
                fs.unlink(filepath, () => {}); // Delete incomplete file
                reject(err);
            });
    });
}

async function downloadAllModels() {
    console.log("📥 Downloading face-api.js models...");

    for (const model of models) {
        const filepath = path.join(modelsDir, model.name);
        try {
            console.log(`Downloading: ${model.name}`);
            await downloadFile(model.url, filepath);
            console.log(`✅ Downloaded: ${model.name}`);

            // Verify file size
            const stats = fs.statSync(filepath);
            console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        } catch (error) {
            console.error(
                `❌ Failed to download ${model.name}:`,
                error.message
            );
        }
    }

    console.log("🎉 All models downloaded!");
}

downloadAllModels();
