import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Book, FileText, ChevronRight } from 'lucide-react';
import { api } from '../api';
import UploadModal from '../components/UploadModal';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await api.getBooks();
      setBooks(data.books);
    } catch (error) {
      console.error('Failed to fetch books', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newBook) => {
    navigate(`/book/${newBook._id}`);
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Your Library</h1>
          <p>Manage and read your uploaded books.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Upload Book
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="btn-icon" style={{ background: 'var(--bg-tertiary)', animation: 'spin 1s linear infinite' }}>
            <Book size={24} color="var(--accent-primary)" />
          </div>
        </div>
      ) : books.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div className="btn-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', marginBottom: '1.5rem', width: '4rem', height: '4rem' }}>
            <Book size={32} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Your library is empty</h3>
          <p style={{ marginBottom: '2rem' }}>Upload your first PDF book to start extracting chapters and generating AI conversations.</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Upload PDF
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {books.map((book, index) => (
            <Link
              key={book._id}
              to={`/book/${book._id}`}
              className="glass-panel"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', textDecoration: 'none', transition: 'var(--transition)', animationDelay: `${index * 0.1}s` }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div className="btn-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                  <Book size={24} />
                </div>
                <span style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                  {book.processingStatus === 'chapters_created' ? 'Chapters Ready' : book.processingStatus === 'conversation_generated' ? 'Conversations Ready' : 'Processing'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{book.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 'auto' }}>
                <FileText size={16} />
                <span>{book.totalChapters || 0} Chapters</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleUploadSuccess} />
    </div>
  );
};

export default Dashboard;
