const calculateCoverage =
  (
    concepts,
    generatedText
  ) => {
    let covered = 0;

    concepts.forEach(
      (concept) => {
        if (
          generatedText
            .toLowerCase()
            .includes(
              concept.toLowerCase()
            )
        ) {
          covered++;
        }
      }
    );

    return Math.round(
      (covered /
        concepts.length) *
        100
    );
  };

module.exports = {
  calculateCoverage,
};