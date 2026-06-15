import { Pause, Play, RotateCcw, Square } from 'lucide-react';

const languages = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'English (UK)', value: 'en-GB' },
  { label: 'Hindi', value: 'hi-IN' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'French', value: 'fr-FR' },
  { label: 'German', value: 'de-DE' },
];

const VoiceControls = ({
  voices,
  selectedVoice,
  onVoiceChange,
  language,
  onLanguageChange,
  rate,
  pitch,
  volume,
  onRateChange,
  onPitchChange,
  onVolumeChange,
  onSpeak,
  onPause,
  onResume,
  onStop,
  progress,
  speaking,
  disabled,
}) => {
  return (
    <div className="glass-panel tts-card sticky-panel">
      <h2>Voice Controls</h2>
      <p>This app uses your browser's built-in voice system. Voice quality may depend on your browser and device.</p>

      <label>
        Voice
        <select
          value={selectedVoice}
          onChange={(event) => onVoiceChange(event.target.value)}
        >
          <option value="">Browser default</option>
          {voices.map((voice) => (
            <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </label>

      <label>
        Language
        <select
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
        >
          {languages.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Speed: {rate}
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(event) => onRateChange(event.target.value)}
        />
      </label>

      <label>
        Pitch: {pitch}
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(event) => onPitchChange(event.target.value)}
        />
      </label>

      <label>
        Volume: {volume}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(event) => onVolumeChange(event.target.value)}
        />
      </label>

      <div className="progress-track">
        <div style={{ width: `${progress}%` }} />
      </div>
      <span className="progress-label">{progress}% complete</span>

      <div className="control-grid">
        <button type="button" className="btn btn-primary" onClick={onSpeak} disabled={disabled}>
          <Play size={18} />
          Speak
        </button>
        <button type="button" className="btn btn-secondary" onClick={onPause} disabled={!speaking}>
          <Pause size={18} />
          Pause
        </button>
        <button type="button" className="btn btn-secondary" onClick={onResume}>
          <RotateCcw size={18} />
          Resume
        </button>
        <button type="button" className="btn btn-secondary" onClick={onStop}>
          <Square size={18} />
          Stop
        </button>
      </div>

      <div className="info-box">MP3 download is not available with Web Speech API.</div>
    </div>
  );
};

export default VoiceControls;
