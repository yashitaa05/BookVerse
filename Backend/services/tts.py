import sys
import io
import base64
import pyttsx3
import tempfile
import os

sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')

# Read output file path from first line, text from rest
lines = sys.stdin.read().split('\n', 1)
output_path = lines[0].strip()
text = lines[1] if len(lines) > 1 else ''

if not text.strip():
    sys.exit(1)

tmp = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
tmp_path = tmp.name
tmp.close()

engine = pyttsx3.init()
engine.setProperty('rate', 150)
engine.setProperty('volume', 1.0)
engine.save_to_file(text, tmp_path)
engine.runAndWait()

# Read wav, encode to base64, write to output file
with open(tmp_path, 'rb') as f:
    audio_data = f.read()

os.unlink(tmp_path)

with open(output_path, 'w') as f:
    f.write(base64.b64encode(audio_data).decode('utf-8'))

print('done')