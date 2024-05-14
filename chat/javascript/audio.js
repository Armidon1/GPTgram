let isRecording = false;

let audioDuration = null;
let audioRecorder = null;
let audioStream = null;
let temporaryAudioChunks = [];
let audios = [] // temporaneo

export function canRecordAudio() {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
}

export async function toggleRecording() {
  isRecording = !isRecording;
  let mic = document.querySelector("#mic");

  if (isRecording) {
    if (canRecordAudio()) {
      mic.style.backgroundImage = 'url("../asset/recording.svg")';
      let audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioRecorder = new MediaRecorder(audioStream);

      audioRecorder.ondataavailable = function (event) {
        temporaryAudioChunks.push(event.data);
      };

      audioRecorder.start();
      console.log("Recording...");
    } else {
      console.error(
        "Impossibile registrare l'audio: il dispositivo non supporta la registrazione audio."
      );
    }
  } else {
    if (audioRecorder) {
      mic.style.backgroundImage = 'url("../asset/mic.svg")';
      await new Promise((resolve) => {
        audioRecorder.onstop = function () {
          const audioBlob = new Blob(temporaryAudioChunks, {
            type: "audio/mpeg",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          audios.push(audioUrl);

          temporaryAudioChunks = [];

          if (audioRecorder.stream) {
            audioRecorder.stream.getTracks().forEach((track) => track.stop());
          }

          resolve();
        };

        audioRecorder.stop();
      });

      console.log("Stopped recording");
      console.log(audios.length);
    }
  }
}
