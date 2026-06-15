import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Upload,
  X,
  File as FileIcon,
  Loader2,
} from "lucide-react";
import { api } from "../api";

const UploadModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFile(null);
    setTitle("");
    setError("");
    setLoading(false);
    onClose();
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file");
      return;
    }

    setFile(selectedFile);

    if (!title) {
      setTitle(
        selectedFile.name.replace(/\.pdf$/i, "")
      );
    }

    setError("");
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
      setError("Please select a PDF file");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await api.uploadBook(
        file,
        title
      );

      if (onSuccess) {
        onSuccess(data.book);
      }

      handleClose();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to upload book"
      );
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "550px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          <X size={22} />
        </button>

        <h3
          style={{
            fontSize: "1.8rem",
            marginBottom: "1.5rem",
            color: "var(--text-primary)",
          }}
        >
          Upload New Book
        </h3>

        <div
          onClick={() =>
            fileInputRef.current?.click()
          }
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            border:
              "2px dashed var(--border-color)",
            borderRadius: "16px",
            minHeight: "180px",
            padding: "24px",
            marginBottom: "1.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: file
              ? "rgba(99,102,241,0.05)"
              : "transparent",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {file ? (
            <div>
              <FileIcon
                size={48}
                style={{
                  marginBottom: "10px",
                  color:
                    "var(--accent-primary)",
                }}
              />

              <p
                style={{
                  fontWeight: 600,
                  marginBottom: "5px",
                  wordBreak: "break-word",
                }}
              >
                {file.name}
              </p>

              <span
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </span>
            </div>
          ) : (
            <div>
              <Upload
                size={48}
                style={{
                  marginBottom: "10px",
                  color:
                    "var(--accent-primary)",
                }}
              />

              <p>
                Click to browse or drag &
                drop PDF
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Book Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter book title"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border:
                "1px solid var(--border-color)",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <p
            style={{
              color: "#ef4444",
              marginBottom: "1rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={loading}
          style={{
            width: "100%",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
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
    </div>,
    document.body
  );
};

export default UploadModal;
