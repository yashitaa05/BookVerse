import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Headphones, MessageSquare, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Sparkles size={16} />
          <span>AI-Powered Reading Experience</span>
        </div>
        <h1 style={{ marginBottom: '1.5rem' }}>Transform Any PDF into an <span className="text-gradient">Interactive Journey</span></h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}>
          Upload your books and let our advanced AI extract chapters, generate engaging conversations, and provide a personalized tutor for your learning.
        </p>
        <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
          Get Started Now
          <ArrowRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-3 delay-200 animate-fade-in">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className="btn-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', marginBottom: '1.5rem', width: '3rem', height: '3rem' }}>
            <BookOpen size={24} />
          </div>
          <h3>Smart Extraction</h3>
          <p>We automatically read your PDFs and split them into digestible chapters for an optimized reading flow.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className="btn-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent-tertiary)', marginBottom: '1.5rem', width: '3rem', height: '3rem' }}>
            <MessageSquare size={24} />
          </div>
          <h3>AI Conversations</h3>
          <p>Read your books like a chat! Generate friendly, podcast, or teacher-style conversations from any chapter.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className="btn-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-secondary)', marginBottom: '1.5rem', width: '3rem', height: '3rem' }}>
            <Headphones size={24} />
          </div>
          <h3>Listen Anywhere</h3>
          <p>Listen to text and documents with your browser’s built-in voice system. No premium TTS API key required.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
