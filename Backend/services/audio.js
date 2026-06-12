const axios = require("axios");

const chunkText = (text, maxLength = 2400) => {
  const chunks = [];
  let i = 0;

  while (i < text.length) {
    let chunk = text.substring(i, i + maxLength);

    if (i + maxLength < text.length) {
      const lastSpace = chunk.lastIndexOf(" ");
      const lastNewline = chunk.lastIndexOf("\n");
      const splitPos = Math.max(lastSpace, lastNewline);

      if (splitPos > maxLength * 0.5) {
        chunk = chunk.substring(0, splitPos);
      }
    }

    chunks.push(chunk.trim());

    i += chunk.length;

    while (i < text.length && /\s/.test(text[i])) {
      i++;
    }
  }

  return chunks;
};

const generateAudio = async (
  text,
  language = "en-IN"
) => {
  try {
    const chunks = chunkText(text, 2400);
    const audioBuffers = [];

    console.log(
      `Generating audio for ${chunks.length} chunks`
    );

    for (const chunk of chunks) {
      if (!chunk) continue;

      try {
        const response = await axios.post(
          "https://api.sarvam.ai/text-to-speech",
          {
            text: chunk,
            target_language_code: language,
            speaker: "anushka",
          },
          {
            headers: {
              "api-subscription-key":
                process.env.SARVAM_API_KEY,
              "Content-Type":
                "application/json",
            },
          }
        );

        if (
          response.data &&
          response.data.audios &&
          response.data.audios[0]
        ) {
          const base64Audio =
            response.data.audios[0];

          audioBuffers.push(
            Buffer.from(
              base64Audio,
              "base64"
            )
          );
        } else {
          console.error(
            "No audio returned from Sarvam:",
            response.data
          );
        }
      } catch (error) {
        console.error(
          "SARVAM STATUS:",
          error.response?.status
        );

        console.error(
          "SARVAM DATA:",
          error.response?.data
        );

        console.error(
          "SARVAM MESSAGE:",
          error.message
        );

        throw error;
      }
    }

    if (audioBuffers.length === 0) {
      throw new Error(
        "No audio chunks generated"
      );
    }

    const finalBuffers = [];

    for (
      let i = 0;
      i < audioBuffers.length;
      i++
    ) {
      if (i === 0) {
        finalBuffers.push(audioBuffers[i]);
      } else {
        finalBuffers.push(
          audioBuffers[i].subarray(44)
        );
      }
    }

    return Buffer.concat(
      finalBuffers
    ).toString("base64");
  } catch (error) {
    console.error(
      "GENERATE AUDIO ERROR:",
      error
    );
    throw error;
  }
};

module.exports = {
  generateAudio,
};