import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, File as FileIcon, Loader2 } from 'lucide-react';
import { api } from '../api';

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }

    setFile(selectedFile);

    if (!title) {
      setTitle(selectedFile.name.replace('.pdf', ''));
    }

    setError('');
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }

    try {
      setLoading(true);

      const data = await api.uploadBook(file, title);

      onSuccess(data.book);

      setFile(null);
      setTitle('');
      setError('');

      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to upload book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '550px',
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <X size={22} />
        </button>

        <h3
          style={{
            fontSize: '2rem',
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}
        >
          Upload New Book
        </h3>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: '16px',
            minHeight: '180px',
            padding: '24px',
            marginBottom: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: file
              ? 'rgba(99,102,241,0.05)'
              : 'transparent',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {file ? (
            <div>
              <FileIcon
                size={48}
                style={{
                  marginBottom: '10px',
                  color: 'var(--accent-primary)',
                }}
              />

              <p
                style={{
                  fontWeight: 600,
                  marginBottom: '5px',
                  wordBreak: 'break-word',
                }}
              >
                {file.name}
              </p>

              <span
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ) : (
            <div>
              <Upload
                size={50}
                style={{
                  marginBottom: '12px',
                  color: 'var(--accent-primary)',
                }}
              />

              <p style={{ margin: 0 }}>
                Click to browse or drag & drop PDF
              </p>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 600,
            }}
          >
            Book Title
          </label>

          <input
            type="text"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {error && (
          <p
            style={{
              color: '#ef4444',
              marginBottom: '1rem',
            }}
          >
            {error}
          </p>
        )}

        <button
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '1rem',
          }}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                style={{
                  animation:
                    'spin 1s linear infinite',
                }}
              />
              Processing PDF...
            </>
          ) : (
            <>
              <Upload size={18} />
              Upload Book
            </>
          )}
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default UploadModal;