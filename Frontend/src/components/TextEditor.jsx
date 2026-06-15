import { Eraser } from 'lucide-react';

const TextEditor = ({ text, onChange, activeChunk }) => {
  return (
    <div className="glass-panel tts-card">
      <div className="section-heading">
        <div>
          <h2>Text Editor</h2>
          <p>Paste text or load extracted document text into the editor.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onChange('')}
          disabled={!text}
        >
          <Eraser size={18} />
          Clear
        </button>
      </div>

      <textarea
        className="tts-textarea"
        value={text}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste your document text here..."
      />

      <div className="editor-meta">
        <span>{text.length.toLocaleString()} characters</span>
        {activeChunk && <span>Speaking: {activeChunk.slice(0, 120)}...</span>}
      </div>
    </div>
  );
};

export default TextEditor;
