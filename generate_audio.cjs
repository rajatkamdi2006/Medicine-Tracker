const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = 'sk_aa2d9695b23a05fef77273f4ef0c713c4ae5206b78e507f4';
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // A generic standard voice, 'Sarah' or similar

const patients = [
  { id: 'p1', text: "Hello Aarav, it's time to take your pending medications, including your Metformin and Aspirin." },
  { id: 'p2', text: "Hello Meera, it's time to take your pending medications, including your Omeprazole and supplements." },
  { id: 'p3', text: "Hello Ramesh, it's time to take your pending medications, including your Atorvastatin." },
  { id: 'p4', text: "Hello Kanta, it's time to take your pending medications, including your weekly doses." }
];

async function generateAudio(patient) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      text: patient.text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Error generating audio for ${patient.id}: Status ${res.statusCode}`);
        res.on('data', d => process.stdout.write(d));
        return resolve();
      }

      const filePath = path.join(__dirname, 'public', 'audio', `${patient.id}_reminder.mp3`);
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Saved audio for ${patient.id}`);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(e);
      resolve();
    });

    req.write(data);
    req.end();
  });
}

async function run() {
  for (const p of patients) {
    await generateAudio(p);
  }
}

run();
