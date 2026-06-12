const splitIntoChunks = (
  text,
  chunkSize = 8000
) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    if (end >= text.length) {
      chunks.push(text.slice(start));
      break;
    }

    // Try to split at paragraph boundary
    let splitPoint = text.lastIndexOf(
      "\n\n",
      end
    );

    // If no paragraph found, try sentence boundary
    if (splitPoint <= start) {
      splitPoint = text.lastIndexOf(
        ". ",
        end
      );
    }

    // Fallback to hard split
    if (splitPoint <= start) {
      splitPoint = end;
    }

    chunks.push(
      text.slice(start, splitPoint).trim()
    );

    start = splitPoint;
  }

  console.log(
    ` Split into ${chunks.length} chunks`
  );

  return chunks;
};

module.exports = {
  splitIntoChunks,
};