import { useCallback, useEffect, useMemo, useState } from 'react';
import { Save, Volume2 } from 'lucide-react';
import TextEditor from '../components/TextEditor';
import DocumentUpload from '../components/DocumentUpload';
import VoiceControls from '../components/VoiceControls';
import DocumentHistory from '../components/DocumentHistory';
import SpeakingModeSelector from '../components/SpeakingModeSelector';
import ModePreview from '../components/ModePreview';
import { api } from '../api';
import { modes, transformByMode } from '../utils/modes';
import {
  getAvailableVoices,
  isSpeechSupported,
  pauseSpeech,
  resumeSpeech,
  speakChunks,
  stopSpeech,
} from '../utils/speech';

const Dashboard = () => {
  const [text, setText] = useState('');
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [activeChunk, setActiveChunk] = useState('');
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState(modes.FRIENDLY_CHAT);
  const [transformedText, setTransformedText] = useState('');
  const [modeProcessing, setModeProcessing] = useState(false);

  const speechSupported = isSpeechSupported();
  const selectedVoiceObject = useMemo(
    () => voices.find((voice) => voice.name === selectedVoice),
    [selectedVoice, voices]
  );
  const selectedModeLabel = useMemo(() => {
    if (selectedMode === modes.PODCAST) return 'Podcast';
    if (selectedMode === modes.TUTOR) return 'Tutor';
    return 'Friendly Chat';
  }, [selectedMode]);

  const fetchDocuments = useCallback(async () => {
    setDocumentsLoading(true);

    try {
      const data = await api.getDocuments();
      setDocuments(data.documents);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setDocumentsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocuments();

    if (!speechSupported) return undefined;

    const loadVoices = () => setVoices(getAvailableVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      stopSpeech();
    };
  }, [fetchDocuments, speechSupported]);

  const handleDocumentUploaded = (document) => {
    setText(document.extractedText);
    setTransformedText('');
    fetchDocuments();
  };

  const handleLoadDocument = async (documentId) => {
    try {
      const data = await api.getDocument(documentId);
      setText(data.document.extractedText);
      setTransformedText('');
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await api.deleteDocument(documentId);
      setDocuments((current) =>
        current.filter((document) => document._id !== documentId)
      );
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleSaveText = async () => {
    if (!text.trim()) return;

    try {
      const data = await api.saveTextDocument('Pasted text', text);
      setDocuments((current) => [data.document, ...current]);
      setError('');
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const handleTextChange = (value) => {
    setText(value);
    setTransformedText('');
  };

  const handlePreviewMode = () => {
    if (!text.trim()) return;

    setModeProcessing(true);
    setError('');

    window.setTimeout(() => {
      setTransformedText(transformByMode(text, selectedMode));
      setModeProcessing(false);
    }, 120);
  };

  const speakText = (speechText) => {
    if (!speechText.trim()) return;

    setError('');
    setProgress(0);
    setSpeaking(true);

    speakChunks({
      text: speechText,
      voice: selectedVoiceObject,
      lang: language,
      rate,
      pitch,
      volume,
      onChunkStart: (index, chunk, total) => {
        setActiveChunk(`Chunk ${index + 1} of ${total}: ${chunk}`);
      },
      onProgress: setProgress,
      onEnd: () => {
        setSpeaking(false);
        setActiveChunk('');
      },
      onError: (speechError) => {
        setSpeaking(false);
        setError(String(speechError?.message || speechError));
      },
    });
  };

  const handleSpeakOriginal = () => {
    speakText(text);
  };

  const handleSpeakModeVersion = () => {
    const nextText = transformedText || transformByMode(text, selectedMode);
    setTransformedText(nextText);
    speakText(nextText);
  };

  const handleResetMode = () => {
    stopSpeech();
    setTransformedText('');
    setActiveChunk('');
    setProgress(0);
    setSpeaking(false);
  };

  const handleStop = () => {
    stopSpeech();
    setSpeaking(false);
    setActiveChunk('');
    setProgress(0);
  };

  return (
    <div className="container animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1>VoiceDoc TTS</h1>
          <p>Paste text or upload a document and listen using free browser-based text-to-speech.</p>
        </div>
        <div className="header-badge">
          <Volume2 size={18} />
          Web Speech API
        </div>
      </div>

      {!speechSupported && (
        <div className="error-box">
          Your browser does not support the Web Speech API. Try Chrome, Edge, or Safari.
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <div className="tts-layout">
        <div className="tts-main">
          <TextEditor text={text} onChange={handleTextChange} activeChunk={activeChunk} />

          <div className="glass-panel tts-card preview-card">
            <div className="section-heading">
              <div>
                <h2>Extracted Text Preview</h2>
                <p>Review the text before listening.</p>
              </div>
              <button
                className="btn btn-secondary"
                disabled={!text.trim()}
                onClick={handleSaveText}
              >
                <Save size={18} />
                Save document
              </button>
            </div>
            <div className="preview-box">
              {text || 'No text loaded yet. Paste text or upload a document to begin.'}
            </div>
          </div>

          <SpeakingModeSelector
            selectedMode={selectedMode}
            onModeChange={(mode) => {
              setSelectedMode(mode);
              setTransformedText('');
            }}
          />

          <ModePreview
            transformedText={transformedText}
            selectedModeLabel={selectedModeLabel}
            hasOriginalText={Boolean(text.trim())}
            isProcessing={modeProcessing}
            onPreview={handlePreviewMode}
            onSpeakOriginal={handleSpeakOriginal}
            onSpeakMode={handleSpeakModeVersion}
            onReset={handleResetMode}
          />

          <DocumentHistory
            documents={documents}
            loading={documentsLoading}
            onLoad={handleLoadDocument}
            onDelete={handleDeleteDocument}
          />
        </div>

        <aside className="tts-side">
          <DocumentUpload onUploaded={handleDocumentUploaded} />
          <VoiceControls
            voices={voices}
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
            language={language}
            onLanguageChange={setLanguage}
            rate={rate}
            pitch={pitch}
            volume={volume}
            onRateChange={setRate}
            onPitchChange={setPitch}
            onVolumeChange={setVolume}
            onSpeak={handleSpeakOriginal}
            onPause={pauseSpeech}
            onResume={resumeSpeech}
            onStop={handleStop}
            progress={progress}
            speaking={speaking}
            disabled={!speechSupported || !text.trim()}
          />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
