import { focusUserInput } from './utils.js';
import WaveSurfer from '../../wavesurfer.js/dist/wavesurfer.js'
import RecordPlugin from '../../wavesurfer.js/dist/plugins/record.js'

let isRecording = false;
let micDeviceId = 0;

let audioDuration = null;
let audioRecorder = null;
let audioStream = null;
let temporaryAudioChunks = [];
let audios = [] // temporaneo

let wavesurferOptions = {
  waveColor: 'rgb(120, 120, 120)',
  progressColor: 'rgb(255, 255, 255)',
  cursorColor: 'rgb(120, 120, 120)',
  barWidth: 1,
  barGap: 5,
  autoCenter: true,
  height: 100,
  barHeight: 0.95,
}

export function canRecordAudio() {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
}

function updateProgress(time) {
  const formattedTime = [
    Math.floor((time % 3600000) / 60000),
    Math.floor((time % 60000) / 1000),
  ].map((value) => String(value).padStart(2, '0')).join(':');

  progress.textContent = formattedTime;
}

export async function setupWavesurferRecordorder(){
  let mics = await RecordPlugin.getAvailableAudioDevices();
  micDeviceId = mics[0].deviceId;
  audioRecorder = WaveSurfer.create({container: '#user-record'});
  audioRecorder.setOptions(wavesurferOptions);
  audioRecorder = audioRecorder.registerPlugin(RecordPlugin.create({ scrollingWaveform: true, renderRecordedAudio: false}));
  audioRecorder.on('record-end', testRecord);
  audioRecorder.on('record porgress', updateProgress)

}


function testRecord(blob) {
  const recordedUrl = URL.createObjectURL(blob);
  console.log(recordedUrl);
}

export async function toggleRecording() {
  isRecording = !isRecording;
  let mic = document.querySelector("#mic");
  let inputGrid = document.querySelector(".input-grid");
  let commandsGrid = inputGrid.querySelector(".commands-grid");

  if (isRecording) {
      mic.style.backgroundImage = 'var(--recording-path)';
      let userInput = inputGrid.querySelector("#user-input");
      userInput.remove();
      let userRecord = document.createElement("div");
      userRecord.id = "user-record";
      inputGrid.insertBefore(userRecord, commandsGrid);
      let mics = await RecordPlugin.getAvailableAudioDevices();
      let deviceId = mics[0].deviceId;
      await setupWavesurferRecordorder();
      audioRecorder.startRecording({ micDeviceId })
  } else {
      if (audioRecorder.isRecording() || audioRecorder.isPaused()) {
          audioRecorder.stopRecording();
      }

      mic.style.backgroundImage = 'var(--mic-path)';
      let userRecord = inputGrid.querySelector("#user-record");
      userRecord.remove();
      let userInput = document.createElement("textarea");
      userInput.id = "user-input";
      userInput.placeholder = "chiedimi tutto quello che vuoi";
      inputGrid.insertBefore(userInput, commandsGrid);
      focusUserInput();
  }
}