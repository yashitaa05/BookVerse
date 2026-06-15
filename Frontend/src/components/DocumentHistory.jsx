import { FileText, Trash2 } from 'lucide-react';

const DocumentHistory = ({ documents, onLoad, onDelete, loading }) => {
  return (
    <div className="glass-panel tts-card">
      <div className="section-heading">
        <div>
          <h2>Recent Documents</h2>
          <p>Load previous uploads into the TTS editor.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading documents...</p>
      ) : documents.length === 0 ? (
        <div className="empty-state">No uploaded documents yet.</div>
      ) : (
        <div className="history-list">
          {documents.map((document) => (
            <div className="history-item" key={document._id}>
              <button type="button" onClick={() => onLoad(document._id)}>
                <FileText size={18} />
                <span>
                  <strong>{document.originalName}</strong>
                  <small>
                    {document.fileType.toUpperCase()} · {document.textLength?.toLocaleString() || 0} chars
                  </small>
                </span>
              </button>
              <button
                type="button"
                className="icon-action"
                onClick={() => onDelete(document._id)}
                aria-label={`Delete ${document.originalName}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentHistory;
