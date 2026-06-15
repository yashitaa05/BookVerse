import { useState } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import { api } from '../api';

const DocumentUpload = ({ onUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    try {
      const data = await api.uploadDocument(selectedFile);
      onUploaded(data.document);
      setSelectedFile(null);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel tts-card">
      <div className="section-heading">
        <div>
          <h2>Document Upload</h2>
          <p>Upload PDF, DOCX, or TXT. Files are parsed on the server and then removed.</p>
        </div>
      </div>

      <label className="upload-zone">
        <FileUp size={28} />
        <span>{selectedFile ? selectedFile.name : 'Choose a document'}</span>
        <small>Maximum 10MB</small>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          hidden
        />
      </label>

      {error && <div className="error-box">{error}</div>}

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {uploading ? <Loader2 size={18} className="spin" /> : <FileUp size={18} />}
        {uploading ? 'Extracting text...' : 'Extract Text'}
      </button>
    </div>
  );
};

export default DocumentUpload;
