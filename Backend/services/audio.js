const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const generateAudio = async (text) => {
  return new Promise((resolve, reject) => {
    // Use a temp file to avoid string length limits
    const outputPath = path.join(os.tmpdir(), `audio_${Date.now()}.txt`);

    const py = spawn("python", [path.join(__dirname, "tts.py")]);

    let error = "";
    let done = false;

    py.stdout.on("data", (data) => {
      if (data.toString().trim() === "done") done = true;
    });

    py.stderr.on("data", (data) => {
      error += data.toString();
      console.error("Python stderr:", data.toString());
    });

    py.on("close", (code) => {
      if (code !== 0 || !done) {
        return reject(new Error(`Python error: ${error}`));
      }

      try {
        const base64Audio = fs.readFileSync(outputPath, "utf8");
        fs.unlinkSync(outputPath); // cleanup
        resolve(base64Audio.trim());
      } catch (err) {
        reject(new Error(`Failed to read audio file: ${err.message}`));
      }
    });

    py.on("error", (err) => {
      reject(new Error(`Failed to start Python: ${err.message}`));
    });

    // Send output path on first line, then text
    py.stdin.write(outputPath + "\n" + text, "utf8");
    py.stdin.end();
  });
};

module.exports = { generateAudio };