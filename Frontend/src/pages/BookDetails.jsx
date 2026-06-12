import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, FileText, Settings, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../api';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState('friendly');

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const data = await api.getBook(id);
      setBook(data.book);
      setChapters(data.chapters);
    } catch (error) {
      console.error('Failed to fetch book', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    setGenerating(true);
    try {
      await api.generateBookContent(id, mode);
      await fetchBookDetails();
    } catch (error) {
      console.error('Failed to generate content', error);
      alert('Failed to generate content. See console for details.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
      <Loader2 size={32} className="spin" color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!book) return <div className="container"><p>Book not found.</p></div>;

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="btn-icon" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', width: '3.5rem', height: '3.5rem' }}>
          <Book size={28} />
        </div>
        <div>
          <h1 style={{ marginBottom: '0.25rem', fontSize: '2rem' }}>{book.title}</h1>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileText size={16} /> {chapters.length} Chapters</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Settings size={16} /> Status: {book.processingStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Chapters</h2>
          <div className="glass-panel" style={{ padding: '0' }}>
            {chapters.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center' }}>No chapters found.</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {chapters.map((chapter, index) => (
                  <li key={chapter._id} style={{ borderBottom: index !== chapters.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <Link 
                      to={`/chapter/${chapter._id}`}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '1.5rem', 
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'var(--transition)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>Chapter {chapter.chapterNumber}: {chapter.title}</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{chapter.wordCount} words</p>
                      </div>
                      <ArrowRight size={20} color="var(--text-muted)" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--accent-primary)" />
              Generate AI Content
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Transform your book into interactive conversations across all chapters.
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Persona Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="friendly">Friendly Chat</option>
                <option value="teacher">Tutor / Teacher</option>
                <option value="podcast">Podcast Style</option>
                <option value="story">Storyteller</option>
              </select>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={handleGenerateContent}
              disabled={generating}
            >
              {generating ? (
                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
              ) : (
                <>Generate Content</>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default BookDetails;
