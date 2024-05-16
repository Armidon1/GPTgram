import { SENDTEXTCLASS, RECEIVETEXTCLASS, currentChatId } from "./chat.js";
import { createID, focusUserInput } from "./utils.js";
import WaveSurfer from "../../wavesurfer.js/dist/wavesurfer.js";
import RecordPlugin from "../../wavesurfer.js/dist/plugins/record.js";

const TYPEAUDIO = "AUDIO";

let isRecording = false;
let micDeviceId = 0;

let audioDuration = null;
let audioRecorder = null;
let audioStream = null;
let temporaryAudioChunks = [];
let audios = []; // temporaneo

let wavesurferOptions = {
    waveColor: "rgb(120, 120, 120)",
    progressColor: "rgb(255, 255, 255)",
    barWidth: 1,
    barGap: 5,
    autoCenter: true,
    height: 100,
    barHeight: 0.95,
    cursorWidth : 0,
    fillParent: true,
};

export function canRecordAudio() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
}

export async function userAudioMessage(blob) {
    let newMessage = document.createElement("div");
    newMessage.classList.add(SENDTEXTCLASS);
    let msgDate = new Date().getTime();
    newMessage.id = await createID(TYPEAUDIO, SENDTEXTCLASS, msgDate);
    newMessage.setAttribute("data-time", msgDate);
    let Icon = document.createElement("div");
    Icon.classList.add("icon", "default-user");
    let audioMessage = document.createElement("div");
    audioMessage.classList.add('send-audio');
    let recordedUrl = URL.createObjectURL(blob);
    let wavesurferAudio = WaveSurfer.create({container: audioMessage, url: recordedUrl});
    wavesurferAudio.setOptions(wavesurferOptions);
    wavesurferAudio.setOptions({
      dragToSeek: true, 
      height: 50, 
      width: (document.querySelector('.chatbox').offsetWidth * 0.800) - 20 - 50 - 10,
      normalize: true,
      interact: true,
    });
    wavesurferAudio.on('ready', function() {
      wavesurferAudio.setTime(wavesurferAudio.getDuration());
    });
    let audioButton = document.createElement('div');
    audioButton.classList.add('audio-button');
    audioButton.onclick = () => wavesurferAudio.playPause();
    wavesurferAudio.on('pause', () => (audioButton.style.backgroundImage = "var(--play-path)"));
    wavesurferAudio.on('play', () => (audioButton.style.backgroundImage = "var(--pause-path)"));
    audioMessage.insertBefore(audioButton, audioMessage.firstElementChild);//appendChild(audioButton);
    newMessage.appendChild(audioMessage);
    newMessage.appendChild(Icon);
    let currentChat = document.getElementById(currentChatId);
    currentChat.appendChild(newMessage);
    document.getElementsByClassName('end-separator')[0].scrollIntoView();
}

function updateProgress(time) {
    const formattedTime = [
        Math.floor((time % 3600000) / 60000),
        Math.floor((time % 60000) / 1000),
    ].map((value) => String(value).padStart(2, "0")).join(":");

    let textFooter = document.querySelector(".text-footer");
    //conaole.log(formattedTime);
    textFooter.textContent = formattedTime;
}

export async function setupWavesurferRecordorder() {
    let mics = await RecordPlugin.getAvailableAudioDevices();
    micDeviceId = mics[0].deviceId;
    audioRecorder = WaveSurfer.create({ container: "#user-record" });
    audioRecorder.setOptions(wavesurferOptions);
    audioRecorder = audioRecorder.registerPlugin(
        RecordPlugin.create({
            scrollingWaveform: true,
            renderRecordedAudio: false,
        })
    );
    audioRecorder.on("record-end", userAudioMessage);
    audioRecorder.on("record-porgress", updateProgress);
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
        mic.style.backgroundImage = "var(--recording-path)";
        let userInput = inputGrid.querySelector("#user-input");
        userInput.remove();
        let userRecord = document.createElement("div");
        userRecord.id = "user-record";
        inputGrid.insertBefore(userRecord, commandsGrid);
        let mics = await RecordPlugin.getAvailableAudioDevices();
        let deviceId = mics[0].deviceId;
        await setupWavesurferRecordorder();
        audioRecorder.startRecording({ micDeviceId });
    } else {
        if (audioRecorder.isRecording() || audioRecorder.isPaused()) {
            audioRecorder.stopRecording();
        }

        mic.style.backgroundImage = "var(--mic-path)";
        let userRecord = inputGrid.querySelector("#user-record");
        userRecord.remove();
        let userInput = document.createElement("textarea");
        userInput.id = "user-input";
        userInput.placeholder = "chiedimi tutto quello che vuoi";
        inputGrid.insertBefore(userInput, commandsGrid);
        focusUserInput();
    }
}
