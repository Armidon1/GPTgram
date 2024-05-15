let isRecording = false;

let audioDuration = null;
let audioRecorder = null;
let audioStream = null;
let temporaryAudioChunks = [];
let audios = [] // temporaneo

export function canRecordAudio() {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
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
      record = WaveSurfer.create({container: '#user-record'});
      record.setOptions(wavesurferOptions);
      record = record.registerPlugin(RecordPlugin.create({ scrollingWaveform: true, renderRecordedAudio: false}));
      record.on('record-end',testRecord);
      record.startRecording({ deviceId })
  } else {
      if (record.isRecording() || record.isPaused()) {
          record.stopRecording();
      }

      mic.style.backgroundImage = 'var(--mic-path)';
      let userRecord = inputGrid.querySelector("#user-record");
      userRecord.remove();
      let userInput = document.createElement("textarea");
      userInput.id = "user-input";
      userInput.placeholder = "chiedimi tutto quello che vuoi";
      inputGrid.insertBefore(userInput, commandsGrid);
  }
}