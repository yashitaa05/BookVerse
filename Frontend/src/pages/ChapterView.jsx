import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, HelpCircle, Loader2, Play, Square } from 'lucide-react';
import { api } from '../api';
import { speakChunks, stopSpeech } from '../utils/speech';

const ChapterView = () => {
  const { chapterId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [question, setQuestion] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [askingTutor, setAskingTutor] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await api.getChapterConversations(chapterId);
      setConversations(data.conversations);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchConversations();

    return () => stopSpeech();
  }, [fetchConversations]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.generateChapterConversation(chapterId, 'friendly', 'English', 'college');
      await fetchConversations();
    } catch (error) {
      console.error(error);
      alert('Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  const handleAskTutor = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setAskingTutor(true);
    try {
      const data = await api.askTutor(chapterId, question);
      setTutorResponse(data.answer);
      setQuestion('');
    } catch (error) {
      console.error(error);
      alert('Failed to ask tutor');
    } finally {
      setAskingTutor(false);
    }
  };

  const handleSpeakConversation = (conversation) => {
    stopSpeech();
    setSpeakingId(conversation._id);

    speakChunks({
      text: conversation.generatedText,
      onEnd: () => setSpeakingId(null),
      onError: (error) => {
        setSpeakingId(null);
        alert(String(error?.message || error));
      },
    });
  };

  const handleStopSpeech = () => {
    stopSpeech();
    setSpeakingId(null);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
      <Loader2 size={32} className="spin" color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => window.history.back()} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ fontSize: '2rem' }}>Chapter Conversations</h1>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {conversations.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <MessageSquare size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3>No conversations yet</h3>
              <p style={{ marginBottom: '1.5rem' }}>Generate a conversation to start reading interactively.</p>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                {generating ? <Loader2 size={20} className="spin" /> : 'Generate Now'}
              </button>
            </div>
          ) : (
            conversations.map(conv => (
              <div key={conv._id} className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-primary)', fontWeight: 600 }}>{conv.mode} Mode</span>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Coverage Score: {conv.coverageScore || 'N/A'}</div>
                  </div>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem' }}
                    onClick={() =>
                      speakingId === conv._id
                        ? handleStopSpeech()
                        : handleSpeakConversation(conv)
                    }
                    title="Speak with browser voice"
                  >
                    {speakingId === conv._id ? <Square size={18} /> : <Play size={18} />}
                  </button>
                </div>

                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {conv.generatedText}
                </div>
              </div>
            ))
          )}

        </div>

        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--accent-secondary)" />
              AI Tutor
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Ask any question about this chapter.</p>

            <div style={{
              height: '300px',
              overflowY: 'auto',
              marginBottom: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              {tutorResponse ? (
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-secondary)', display: 'block', marginBottom: '0.25rem' }}>Tutor</span>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>{tutorResponse}</div>
                </div>
              ) : (
                <div style={{ margin: 'auto', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>
                  Waiting for your questions...
                </div>
              )}
            </div>

            <form onSubmit={handleAskTutor} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Ask something..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={{ flex: 1, padding: '0.75rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1rem' }} disabled={askingTutor}>
                {askingTutor ? <Loader2 size={18} className="spin" /> : 'Ask'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ChapterView;
