export const isSpeechSupported = () =>
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  'SpeechSynthesisUtterance' in window;

export const getAvailableVoices = () => {
  if (!isSpeechSupported()) return [];

  return window.speechSynthesis.getVoices();
};

export const splitTextIntoChunks = (text, maxLength = 900) => {
  if (!text?.trim()) return [];

  const paragraphs = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const chunks = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if ((current + ' ' + paragraph).trim().length <= maxLength) {
      current = (current + ' ' + paragraph).trim();
      continue;
    }

    if (current) chunks.push(current);

    if (paragraph.length <= maxLength) {
      current = paragraph;
      continue;
    }

    for (let index = 0; index < paragraph.length; index += maxLength) {
      chunks.push(paragraph.slice(index, index + maxLength));
    }

    current = '';
  }

  if (current) chunks.push(current);

  return chunks;
};

export const speakChunks = ({
  text,
  voice,
  lang = 'en-US',
  rate = 1,
  pitch = 1,
  volume = 1,
  onChunkStart,
  onProgress,
  onEnd,
  onError,
}) => {
  if (!isSpeechSupported()) {
    onError?.(new Error('Web Speech API is not available in this browser'));
    return [];
  }

  const chunks = splitTextIntoChunks(text);
  let index = 0;

  window.speechSynthesis.cancel();

  const speakNext = () => {
    if (index >= chunks.length) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = lang;
    utterance.rate = Number(rate);
    utterance.pitch = Number(pitch);
    utterance.volume = Number(volume);

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      onChunkStart?.(index, chunks[index], chunks.length);
      onProgress?.(Math.round((index / chunks.length) * 100));
    };

    utterance.onend = () => {
      index += 1;
      onProgress?.(Math.round((index / chunks.length) * 100));
      speakNext();
    };

    utterance.onerror = (event) => {
      onError?.(event.error || new Error('Speech synthesis failed'));
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNext();

  return chunks;
};

export const pauseSpeech = () => {
  if (isSpeechSupported()) window.speechSynthesis.pause();
};

export const resumeSpeech = () => {
  if (isSpeechSupported()) window.speechSynthesis.resume();
};

export const stopSpeech = () => {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
};
