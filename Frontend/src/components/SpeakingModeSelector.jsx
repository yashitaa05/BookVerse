import { GraduationCap, MessageCircle, Radio } from 'lucide-react';
import { modes } from '../utils/modes';

const modeOptions = [
  {
    value: modes.FRIENDLY_CHAT,
    title: 'Friendly Chat',
    description: 'Speak the content in a simple, natural, conversational style.',
    Icon: MessageCircle,
  },
  {
    value: modes.PODCAST,
    title: 'Podcast',
    description: 'Convert the content into a podcast-style narration with intro, sections, and closing.',
    Icon: Radio,
  },
  {
    value: modes.TUTOR,
    title: 'Tutor',
    description: 'Explain the content like a teacher with simple explanations, examples, and key points.',
    Icon: GraduationCap,
  },
];

const SpeakingModeSelector = ({ selectedMode, onModeChange }) => {
  return (
    <div className="glass-panel tts-card">
      <div className="section-heading">
        <div>
          <h2>Choose Speaking Mode</h2>
          <p>Select how VoiceDoc should format the text before browser speech.</p>
        </div>
      </div>

      <div className="mode-card-grid">
        {modeOptions.map(({ value, title, description, Icon }) => {
          const isActive = selectedMode === value;

          return (
            <button
              type="button"
              key={value}
              className={`mode-card ${isActive ? 'mode-card-active' : ''}`}
              onClick={() => onModeChange(value)}
            >
              <span className="mode-icon">
                <Icon size={22} />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </button>
          );
        })}
      </div>

      <div className="info-box mode-note">
        This mode uses rule-based formatting and your browser's built-in voice. No premium AI voice API is used.
      </div>
    </div>
  );
};

export default SpeakingModeSelector;
