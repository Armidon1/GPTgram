/**
 * Zoom plugin
 *
 * Zoom in or out on the waveform when scrolling the mouse wheel
 *
 * @author HoodyHuo (https://github.com/HoodyHuo)
 * @author Chris Morbitzer (https://github.com/cmorbitzer)
 * @author Sam Hulick (https://github.com/ffxsam)
 *
 * @example
 * // ... initialising wavesurfer with the plugin
 * var wavesurfer = WaveSurfer.create({
 *   // wavesurfer options ...
 *   plugins: [
 *     ZoomPlugin.create({
 *       // plugin options ...
 *     })
 *   ]
 * });
 */
import { BasePlugin } from '../base-plugin.js';
const defaultOptions = {
    scale: 0.5,
    deltaThreshold: 5,
};
class ZoomPlugin extends BasePlugin {
    constructor(options) {
        super(options || {});
        this.wrapper = undefined;
        this.container = null;
        this.accumulatedDelta = 0;
        this.onWheel = (e) => {
            if (!this.wavesurfer || !this.container || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) {
                return;
            }
            // prevent scrolling the sidebar while zooming
            e.preventDefault();
            // Update the accumulated delta...
            this.accumulatedDelta += -e.deltaY;
            // ...and only scroll once we've hit our threshold
            if (this.options.deltaThreshold === 0 || Math.abs(this.accumulatedDelta) >= this.options.deltaThreshold) {
                const duration = this.wavesurfer.getDuration();
                const oldMinPxPerSec = this.wavesurfer.options.minPxPerSec;
                const x = e.clientX;
                const width = this.container.clientWidth;
                const scrollX = this.wavesurfer.getScroll();
                const pointerTime = (scrollX + x) / oldMinPxPerSec;
                const newMinPxPerSec = this.calculateNewZoom(oldMinPxPerSec, this.accumulatedDelta);
                const newLeftSec = (width / newMinPxPerSec) * (x / width);
                if (newMinPxPerSec * duration < width) {
                    this.wavesurfer.zoom(width / duration);
                    this.container.scrollLeft = 0;
                }
                else {
                    this.wavesurfer.zoom(newMinPxPerSec);
                    this.container.scrollLeft = (pointerTime - newLeftSec) * newMinPxPerSec;
                }
                // Reset the accumulated delta
                this.accumulatedDelta = 0;
            }
        };
        this.calculateNewZoom = (oldZoom, delta) => {
            const newZoom = Math.max(0, oldZoom + delta * this.options.scale);
            return typeof this.options.maxZoom === 'undefined' ? newZoom : Math.min(newZoom, this.options.maxZoom);
        };
        this.options = Object.assign({}, defaultOptions, options);
    }
    static create(options) {
        return new ZoomPlugin(options);
    }
    onInit() {
        var _a;
        this.wrapper = (_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getWrapper();
        if (!this.wrapper) {
            return;
        }
        this.container = this.wrapper.parentElement;
        this.wrapper.addEventListener('wheel', this.onWheel);
    }
    destroy() {
        if (this.wrapper) {
            this.wrapper.removeEventListener('wheel', this.onWheel);
        }
        super.destroy();
    }
}
export default ZoomPlugin;
