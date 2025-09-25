
import React, { useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';

/**
 * Composant d'enregistrement et de prévisualisation audio pour Todo
 * Utilise l'API MediaRecorder (Web)
 * Props :
 *   - onAudioRecorded: (audioBlob: Blob) => void
 *   - initialAudioUrl?: string (pour lecture d'un audio déjà existant)
 */

const AudioRecorder = ({ onAudioRecorded, initialAudioUrl }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(initialAudioUrl || null);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);
  const MAX_DURATION = 30; 

  const startRecording = async () => {
    setError('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    audioChunks.current = [];
    mediaRecorderRef.current.ondataavailable = e => {
      if (e.data.size > 0) audioChunks.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      // Vérification de la durée
      const tempAudio = document.createElement('audio');
      tempAudio.src = URL.createObjectURL(audioBlob);
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration > MAX_DURATION) {
          setError('Le message vocal ne doit pas dépasser 30 secondes.');
          setAudioUrl(null);
          onAudioRecorded && onAudioRecorded(null);
        } else {
          setAudioUrl(tempAudio.src);
          onAudioRecorded && onAudioRecorded(audioBlob);
        }
      };
    };
    mediaRecorderRef.current.start();
    setRecording(true);
    // Arrêt auto après 30s
    timerRef.current = setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
    }, MAX_DURATION * 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className={`flex items-center gap-2 px-4 py-2 rounded font-bold shadow ${recording ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
        title={recording ? 'Arrêter l\'enregistrement' : 'Enregistrer un message vocal'}
      >
        {recording ? <><Square className="w-5 h-5" /> Arrêter</> : <><Mic className="w-5 h-5" /> Enregistrer un message vocal</>}
      </button>
      {audioUrl && (
        <audio controls src={audioUrl} className="mt-2 w-full" />
      )}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default AudioRecorder;
