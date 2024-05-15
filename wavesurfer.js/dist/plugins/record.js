/**
 * Record audio from the microphone with a real-time waveform preview
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BasePlugin from '../base-plugin.js';
import Timer from '../timer.js';
const DEFAULT_BITS_PER_SECOND = 128000;
const DEFAULT_SCROLLING_WAVEFORM_WINDOW = 5;
const MIME_TYPES = ['audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/mp3'];
const findSupportedMimeType = () => MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
class RecordPlugin extends BasePlugin {
    /** Create an instance of the Record plugin */
    constructor(options) {
        var _a, _b, _c, _d;
        super(Object.assign(Object.assign({}, options), { audioBitsPerSecond: (_a = options.audioBitsPerSecond) !== null && _a !== void 0 ? _a : DEFAULT_BITS_PER_SECOND, scrollingWaveform: (_b = options.scrollingWaveform) !== null && _b !== void 0 ? _b : false, scrollingWaveformWindow: (_c = options.scrollingWaveformWindow) !== null && _c !== void 0 ? _c : DEFAULT_SCROLLING_WAVEFORM_WINDOW, renderRecordedAudio: (_d = options.renderRecordedAudio) !== null && _d !== void 0 ? _d : true }));
        this.stream = null;
        this.mediaRecorder = null;
        this.dataWindow = null;
        this.isWaveformPaused = false;
        this.lastStartTime = 0;
        this.lastDuration = 0;
        this.duration = 0;
        this.timer = new Timer();
        this.subscriptions.push(this.timer.on('tick', () => {
            const currentTime = performance.now() - this.lastStartTime;
            this.duration = this.isPaused() ? this.duration : this.lastDuration + currentTime;
            this.emit('record-progress', this.duration);
        }));
    }
    /** Create an instance of the Record plugin */
    static create(options) {
        return new RecordPlugin(options || {});
    }
    renderMicStream(stream) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        let animationId;
        const windowSize = Math.floor((this.options.scrollingWaveformWindow || 0) * audioContext.sampleRate);
        const drawWaveform = () => {
            var _a;
            if (this.isWaveformPaused) {
                animationId = requestAnimationFrame(drawWaveform);
                return;
            }
            analyser.getFloatTimeDomainData(dataArray);
            if (this.options.scrollingWaveform) {
                const newLength = Math.min(windowSize, this.dataWindow ? this.dataWindow.length + bufferLength : bufferLength);
                const tempArray = new Float32Array(windowSize); // Always make it the size of the window, filling with zeros by default
                if (this.dataWindow) {
                    const startIdx = Math.max(0, windowSize - this.dataWindow.length);
                    tempArray.set(this.dataWindow.slice(-newLength + bufferLength), startIdx);
                }
                tempArray.set(dataArray, windowSize - bufferLength);
                this.dataWindow = tempArray;
            }
            else {
                this.dataWindow = dataArray;
            }
            const duration = this.options.scrollingWaveformWindow;
            if (this.wavesurfer) {
                (_a = this.originalOptions) !== null && _a !== void 0 ? _a : (this.originalOptions = {
                    cursorWidth: this.wavesurfer.options.cursorWidth,
                    interact: this.wavesurfer.options.interact,
                });
                this.wavesurfer.options.cursorWidth = 0;
                this.wavesurfer.options.interact = false;
                this.wavesurfer.load('', [this.dataWindow], duration);
            }
            animationId = requestAnimationFrame(drawWaveform);
        };
        drawWaveform();
        return {
            onDestroy: () => {
                cancelAnimationFrame(animationId);
                source === null || source === void 0 ? void 0 : source.disconnect();
                audioContext === null || audioContext === void 0 ? void 0 : audioContext.close();
            },
            onEnd: () => {
                this.isWaveformPaused = true;
                cancelAnimationFrame(animationId);
                this.stopMic();
            },
        };
    }
    /** Request access to the microphone and start monitoring incoming audio */
    startMic(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let stream;
            try {
                stream = yield navigator.mediaDevices.getUserMedia({
                    audio: (options === null || options === void 0 ? void 0 : options.deviceId) ? { deviceId: options.deviceId } : true,
                });
            }
            catch (err) {
                throw new Error('Error accessing the microphone: ' + err.message);
            }
            const { onDestroy, onEnd } = this.renderMicStream(stream);
            this.subscriptions.push(this.once('destroy', onDestroy));
            this.subscriptions.push(this.once('record-end', onEnd));
            this.stream = stream;
            return stream;
        });
    }
    /** Stop monitoring incoming audio */
    stopMic() {
        if (!this.stream)
            return;
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
        this.mediaRecorder = null;
    }
    /** Start recording audio from the microphone */
    startRecording(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = this.stream || (yield this.startMic(options));
            this.dataWindow = null;
            const mediaRecorder = this.mediaRecorder ||
                new MediaRecorder(stream, {
                    mimeType: this.options.mimeType || findSupportedMimeType(),
                    audioBitsPerSecond: this.options.audioBitsPerSecond,
                });
            this.mediaRecorder = mediaRecorder;
            this.stopRecording();
            const recordedChunks = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            const emitWithBlob = (ev) => {
                var _a;
                const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
                this.emit(ev, blob);
                if (this.options.renderRecordedAudio) {
                    this.applyOriginalOptionsIfNeeded();
                    (_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.load(URL.createObjectURL(blob));
                }
            };
            mediaRecorder.onpause = () => emitWithBlob('record-pause');
            mediaRecorder.onstop = () => emitWithBlob('record-end');
            mediaRecorder.start();
            this.lastStartTime = performance.now();
            this.lastDuration = 0;
            this.duration = 0;
            this.isWaveformPaused = false;
            this.timer.start();
            this.emit('record-start');
        });
    }
    /** Get the duration of the recording */
    getDuration() {
        return this.duration;
    }
    /** Check if the audio is being recorded */
    isRecording() {
        var _a;
        return ((_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.state) === 'recording';
    }
    isPaused() {
        var _a;
        return ((_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.state) === 'paused';
    }
    isActive() {
        var _a;
        return ((_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.state) !== 'inactive';
    }
    /** Stop the recording */
    stopRecording() {
        var _a;
        if (this.isActive()) {
            (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.stop();
            this.timer.stop();
        }
    }
    /** Pause the recording */
    pauseRecording() {
        var _a, _b;
        if (this.isRecording()) {
            this.isWaveformPaused = true;
            (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.requestData();
            (_b = this.mediaRecorder) === null || _b === void 0 ? void 0 : _b.pause();
            this.timer.stop();
            this.lastDuration = this.duration;
        }
    }
    /** Resume the recording */
    resumeRecording() {
        var _a;
        if (this.isPaused()) {
            this.isWaveformPaused = false;
            (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.resume();
            this.timer.start();
            this.lastStartTime = performance.now();
            this.emit('record-resume');
        }
    }
    /** Get a list of available audio devices
     * You can use this to get the device ID of the microphone to use with the startMic and startRecording methods
     * Will return an empty array if the browser doesn't support the MediaDevices API or if the user has not granted access to the microphone
     * You can ask for permission to the microphone by calling startMic
     */
    static getAvailableAudioDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => devices.filter((device) => device.kind === 'audioinput'));
        });
    }
    /** Destroy the plugin */
    destroy() {
        this.applyOriginalOptionsIfNeeded();
        super.destroy();
        this.stopRecording();
        this.stopMic();
    }
    applyOriginalOptionsIfNeeded() {
        if (this.wavesurfer && this.originalOptions) {
            this.wavesurfer.options.cursorWidth = this.originalOptions.cursorWidth;
            this.wavesurfer.options.interact = this.originalOptions.interact;
            delete this.originalOptions;
        }
    }
}
export default RecordPlugin;
