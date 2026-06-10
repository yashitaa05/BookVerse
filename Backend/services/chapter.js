const splitIntoChapters = (text) => {
  const chapters = [];

  const chapterRegex = /chapter\s+\d+.*?(?=chapter\s+\d+|$)/gis;

  const matches = text.match(chapterRegex);

  if (!matches) {
    return [
      {
        title: "Full Book",
        content: text,
      },
    ];
  }

  matches.forEach((chapter, index) => {
    chapters.push({
      title: `Chapter ${index + 1}`,
      content: chapter,
    });
  });

  return chapters;
};

module.exports = { splitIntoChapters };