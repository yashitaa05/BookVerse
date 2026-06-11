const axios = require("axios");
const fs = require("fs");
const path = require("path");

const generateAudio = async (
  text,
  fileName
) => {
  const response =
    await axios.post(
      "https://api.sarvam.ai/text-to-speech",
      {
        text,
        target_language_code:
          "en-IN",
      },
      {
        headers: {
          "api-subscription-key":
            process.env.SARVAM_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

  const savePath =
    path.join(
      __dirname,
      "../audios",
      `${fileName}.mp3`
    );

  fs.writeFileSync(
    savePath,
    response.data
  );

  return savePath;
};

module.exports = {
  generateAudio,
};