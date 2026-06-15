export const modes = {
  ORIGINAL: 'original',
  FRIENDLY_CHAT: 'friendly_chat',
  PODCAST: 'podcast',
  TUTOR: 'tutor',
};

const MAX_PARAGRAPH_LENGTH = 700;

export function cleanText(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const splitLargeParagraph = (paragraph) => {
  if (paragraph.length <= MAX_PARAGRAPH_LENGTH) return [paragraph];

  const sentences = paragraph
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    const chunks = [];

    for (let index = 0; index < paragraph.length; index += MAX_PARAGRAPH_LENGTH) {
      chunks.push(paragraph.slice(index, index + MAX_PARAGRAPH_LENGTH).trim());
    }

    return chunks;
  }

  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    const candidate = `${current} ${sentence}`.trim();

    if (candidate.length <= MAX_PARAGRAPH_LENGTH) {
      current = candidate;
      continue;
    }

    if (current) chunks.push(current);
    current = sentence;
  }

  if (current) chunks.push(current);

  return chunks;
};

export function splitIntoParagraphs(text) {
  return cleanText(text)
    .split(/\n{2,}|\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .flatMap(splitLargeParagraph);
}

export function formatFriendlyChat(text) {
  const paragraphs = splitIntoParagraphs(text);

  if (!paragraphs.length) return '';

  const sections = paragraphs.map((paragraph, index) => {
    if (index === 0) {
      return `First, here is the main idea.\n\n${paragraph}`;
    }

    if (index === paragraphs.length - 1) {
      return `Finally, one more important part.\n\n${paragraph}`;
    }

    return `Now, the next important point is this.\n\n${paragraph}`;
  });

  return [
    "Hey, let's go through this in a simple way.",
    ...sections,
    'So overall, this is the content in a more conversational listening format.',
  ].join('\n\n');
}

export function formatPodcast(text) {
  const paragraphs = splitIntoParagraphs(text);

  if (!paragraphs.length) return '';

  const sections = paragraphs.map((paragraph, index) => {
    const sectionNumber = index + 1;
    const transition =
      index === 0
        ? "Let's begin with the first section."
        : 'Now moving to the next part.';

    return `${transition}\n\nSection ${sectionNumber}.\n\n${paragraph}`;
  });

  return [
    "Welcome to today's audio episode.",
    'In this episode, we are going to listen through the document in clear sections, while preserving the original meaning.',
    ...sections,
    'That brings us to the end of this episode. Thanks for listening.',
  ].join('\n\n');
}

export function formatTutor(text) {
  const paragraphs = splitIntoParagraphs(text);

  if (!paragraphs.length) return '';

  const concepts = paragraphs.map((paragraph, index) => {
    const conceptNumber = index + 1;

    return [
      `Concept ${conceptNumber}:`,
      paragraph,
      `Key point: Focus on the idea stated in concept ${conceptNumber}.`,
      `Example: Re-listen to this part and connect it with the original document context.`,
    ].join('\n\n');
  });

  return [
    "Let's understand this step by step.",
    ...concepts,
    'Quick recap: We covered the content concept by concept, using the original text as the source.',
  ].join('\n\n');
}

export function transformByMode(text, mode) {
  if (mode === modes.FRIENDLY_CHAT) return formatFriendlyChat(text);
  if (mode === modes.PODCAST) return formatPodcast(text);
  if (mode === modes.TUTOR) return formatTutor(text);

  return cleanText(text);
}
