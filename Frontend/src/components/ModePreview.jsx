import { Clipboard, Eye, Play, RotateCcw } from 'lucide-react';

const ModePreview = ({
  transformedText,
  selectedModeLabel,
  hasOriginalText,
  isProcessing,
  onPreview,
  onSpeakOriginal,
  onSpeakMode,
  onReset,
}) => {
  const handleCopy = async () => {
    if (!transformedText) return;
    await navigator.clipboard.writeText(transformedText);
  };

  return (
    <div className="glass-panel tts-card">
      <div className="section-heading">
        <div>
          <h2>Mode Preview</h2>
          <p>Preview the rule-based {selectedModeLabel} script before listening.</p>
        </div>
      </div>

      <div className="mode-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onPreview}
          disabled={!hasOriginalText || isProcessing}
        >
          <Eye size={18} />
          {isProcessing ? 'Preparing...' : 'Preview Mode Script'}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSpeakMode}
          disabled={!transformedText}
        >
          <Play size={18} />
          Speak Mode Version
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onSpeakOriginal}
          disabled={!hasOriginalText}
        >
          <Play size={18} />
          Speak Original Text
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCopy}
          disabled={!transformedText}
        >
          <Clipboard size={18} />
          Copy Script
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          disabled={!transformedText}
        >
          <RotateCcw size={18} />
          Reset to Original
        </button>
      </div>

      <div className="info-box">
        This preview is lightweight formatting only. It does not use AI, does not rewrite facts, and does not create MP3 files.
      </div>

      <div className="preview-box mode-preview-box">
        {transformedText || 'Choose a speaking mode and click Preview Mode Script.'}
      </div>
    </div>
  );
};

export default ModePreview;
