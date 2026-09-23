const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
const Video = require('../../io/video');
const formatMessage = require('format-message');
const log = require('../../util/log');

/**
 * Blocks for models trained in the NomoKit ML tool.
 *
 * Inference does NOT happen here. A model trained in NomoKit ML is a one-layer softmax head over a
 * frozen backbone (MobileNet for image, MoveNet for pose, speech-commands for audio), so running it
 * means reproducing that tool's exact preprocessing -- and getting it subtly wrong yields a model
 * that loads fine and predicts nonsense. Instead the GUI keeps the NomoKit ML tool mounted as a
 * hidden iframe and exposes a client on `runtime.nomokitMlInference`; this extension ships it a
 * video frame and reads labels back, so training and inference always run the same code.
 *
 * Every block degrades to a silent no-op when that client is absent (the VM test harness, the
 * playground, or any host that is not openblock-gui).
 */

const IMAGE_ANY = 'any';
const ANY_WITHOUT_OF = 'any without of';

// Sentinels for dropdowns that have nothing real to offer yet. They have to be non-empty rather
// than '' so the block renders with a visible label -- see the defaultValue note on the MODEL
// argument. Neither ever matches a class or a saved model, so selecting one is inert.
const NO_MODEL = 'none';
const NO_LABEL = '-';

// What gets classified. 'stage' reads the rendered stage (backdrop + sprites), which is how a
// student classifies an image they have put on the stage rather than a camera feed.
const INPUT_WEBCAM = 'webcam';
const INPUT_STAGE = 'stage';

// Inlined so the VM bundle carries it -- the GUI's copy of this artwork lives in its own
// extension-library folder and is not reachable from here.
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

// Matches the input size each backbone resizes to internally, so the pixels the model sees at
// runtime are as close as possible to the ones it was trained on. @tensorflow-models/mobilenet
// resizes to 224 (NOT the 227 in nomokit-ml's constants.js, which only affects its file-upload
// path); MoveNet takes 192.
const FRAME_DIMENSIONS = {
    image: [224, 224],
    pose: [192, 192]
};

class NomokitMlBlocks {
    constructor (runtime) {
        this.runtime = runtime;

        this._sessionId = null;
        this._modality = null;
        this._modelName = '';
        this._labels = []; // [{classId, name}] in softmax output order
        this._probableLabels = []; // [{classId, name, confidence}] from the last classification
        this._lastResultAt = 0;
        this._inFlight = false;
        this._running = false;
        this._timer = null;
        this._modelCatalog = [];
        this._catalogRefreshing = false;
        this._warnedNoClient = false;
        this._unsubscribeEvent = null;
        this._pendingHandoff = null;
        this._autoHandoffTried = false;
        this._input = INPUT_WEBCAM;
        this._stageCanvas = null;

        this.interval = 1000;
        this.minInterval = 100;
        this.confidenceThreshold = 0.5;
        this.globalVideoTransparency = 50;

        // The camera is only needed once a model is actually loaded, so unlike tm2scratch there is
        // no unconditional timer or getUserMedia at construction.
        if (this.runtime && typeof this.runtime.on === 'function') {
            this.runtime.on('PROJECT_STOP_ALL', this._onStopAll.bind(this));
        }
        this._subscribeToHost();
    }

    /**
     * Required by extension-manager's _registerInternalExtension, which reads it to build the
     * dispatch service name. Without it the name falls through to `device_<n>_undefined`, the
     * extension gets registered as a *device* rather than an extension, and its category id then
     * gets prefixed with the current device type -- so the blocks never show up in the toolbox.
     * @returns {string} this extension's id, matching the key in builtinExtensions
     */
    get EXTENSION_ID () {
        return 'nomokitml';
    }

    _client () {
        const fromRuntime = this.runtime && this.runtime.nomokitMlInference;
        if (fromRuntime) return fromRuntime;
        if (typeof window !== 'undefined' && window.nomokitMlInference) return window.nomokitMlInference;
        if (!this._warnedNoClient) {
            this._warnedNoClient = true;
            log.warn('[nomokitml] no inference host; NomoKit ML blocks will do nothing.');
        }
        return null;
    }

    _subscribeToHost () {
        const client = this._client();
        if (!client || this._unsubscribeEvent) return;
        this._unsubscribeEvent = client.onEvent(msg => {
            if (msg && msg.kind === 'handoff') {
                // The student just pressed "Use in NomoPro". Remember it so the next block that
                // needs a model can pick it up without them having to wire up a "set model" block.
                this._pendingHandoff = {name: msg.name, modality: msg.modality};
                this._autoHandoffTried = false;
                this._refreshCatalog();
            }
        });
    }

    _onStopAll () {
        // Red stop button: drop the camera. Leaving the pump running would keep the webcam
        // indicator lit after the project has visibly stopped.
        this._stopPump();
    }

    // -------------------------------------------------------------------------
    // Model loading
    // -------------------------------------------------------------------------

    _applyLoadedModel (result) {
        this._sessionId = result.sessionId;
        this._modality = result.modality;
        this._modelName = result.name || '';
        this._labels = result.labels || [];
        this._probableLabels = [];
        this._lastResultAt = 0;
        this._pendingHandoff = null;
        // Repopulates the label dropdowns, which were empty until a model existed. Only on load:
        // this regenerates every loaded extension's blocks, so calling it per result would be
        // catastrophic.
        if (this.runtime && typeof this.runtime.requestToolboxExtensionsUpdate === 'function') {
            this.runtime.requestToolboxExtensionsUpdate();
        }
        // Classification may have been switched on before a model existed; now it can start.
        this._schedule();
    }

    // Never rejects: a failed load logs and leaves the previous model in place, matching the
    // convention that a model block does not throw into the sequencer.
    _loadModel (source) {
        const client = this._client();
        if (!client) return Promise.resolve();
        this._stopPump();
        return client.loadModel(source).then(res => {
            if (res && res.ok) {
                this._applyLoadedModel(res.result);
            } else {
                log.warn(`[nomokitml] could not load model: ${res && res.error && res.error.message}`);
            }
        });
    }

    setModel (args) {
        const value = Cast.toString(args.MODEL);
        // NO_MODEL is the "nothing saved yet" placeholder, not a selection to complain about.
        if (!value || value === NO_MODEL) return;
        const entry = this._modelCatalog.find(m => `${m.origin}:${m.id}` === value);
        if (!entry) {
            log.warn(`[nomokitml] no such saved model: ${value}`);
            return;
        }
        return this._loadModel(entry.source);
    }

    // Passed through verbatim -- deliberately unlike tm2scratch's image loader, which discards the
    // URL it is given and rewrites it to Google's Teachable Machine bucket.
    setModelFromURL (args) {
        const url = Cast.toString(args.URL).trim();
        if (!url) return;
        return this._loadModel({kind: 'url', url});
    }

    getModelName () {
        return this._modelName;
    }

    // -------------------------------------------------------------------------
    // Classification
    // -------------------------------------------------------------------------

    _startPump () {
        this._running = true;
        this._schedule();
    }

    _stopPump () {
        this._running = false;
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    // `_running` is the student's intent ("turn classification on"), which can be set before any
    // model exists. Only arm a timer once there is actually something to classify with, otherwise
    // the pump spins forever against a null session -- and, with no host at all, never stops.
    // _applyLoadedModel re-arms it when a model arrives later.
    _schedule () {
        if (this._timer || !this._running || !this._sessionId) return;
        this._timer = setTimeout(this._tick.bind(this), Math.max(this.interval, this.minInterval));
    }

    _dimensions () {
        return FRAME_DIMENSIONS[this._modality] || FRAME_DIMENSIONS.image;
    }

    /**
     * Grabs the stage as it is drawn -- sprites, backdrop and all -- so a model can classify an
     * image the student put on the stage rather than whatever the camera sees.
     * @returns {?ImageData} the scaled stage pixels, or null if the renderer is unavailable
     */
    _grabStageFrame () {
        const source = (this.runtime && this.runtime.renderer && this.runtime.renderer.canvas) ||
            (typeof document !== 'undefined' && document.querySelector('canvas'));
        if (!source || !source.width || !source.height) return null;
        const [width, height] = this._dimensions();
        if (!this._stageCanvas) this._stageCanvas = document.createElement('canvas');
        if (this._stageCanvas.width !== width || this._stageCanvas.height !== height) {
            this._stageCanvas.width = width;
            this._stageCanvas.height = height;
        }
        const ctx = this._stageCanvas.getContext('2d');
        // Squash the whole stage into the model's input square, matching how the trainer feeds a
        // full frame to the backbone rather than cropping to the centre.
        ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);
        try {
            return ctx.getImageData(0, 0, width, height);
        } catch (_) {
            // A tainted canvas (a backdrop loaded cross-origin without CORS) makes readback throw.
            return null;
        }
    }

    _grabFrame () {
        if (this._input === INPUT_STAGE) return this._grabStageFrame();
        const video = this.runtime && this.runtime.ioDevices && this.runtime.ioDevices.video;
        if (!video) return null;
        return video.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            dimensions: this._dimensions(),
            // The NomoKit ML tool embeds the raw, unmirrored <video> element when collecting
            // samples, while the stage shows a mirrored selfie view (ioDevices.video.mirror
            // defaults to true). Sending mirrored pixels here would feed the model a horizontally
            // flipped world relative to training, and every left/right-asymmetric model would
            // answer with the opposite class. Keep the stage mirrored; send unmirrored pixels.
            mirror: false
        });
    }

    setInput (args) {
        this._input = args.INPUT === INPUT_STAGE ? INPUT_STAGE : INPUT_WEBCAM;
        if (this._input === INPUT_STAGE) {
            // Classifying the stage does not need the camera, and leaving it on would keep the
            // webcam preview covering the very backdrop being classified.
            const video = this.runtime && this.runtime.ioDevices && this.runtime.ioDevices.video;
            if (video) video.disableVideo();
        } else {
            this._ensureCamera();
        }
    }

    /**
     * Turns the camera on when the webcam is the input. Without this, getFrame() returns null --
     * ioDevices.video has no provider until something enables it -- and classification silently
     * never produces a label. Deliberately not done at construction: merely adding the extension
     * should not switch a student's camera on.
     */
    _ensureCamera () {
        if (this._input !== INPUT_WEBCAM) return;
        const video = this.runtime && this.runtime.ioDevices && this.runtime.ioDevices.video;
        if (video && typeof video.enableVideo === 'function') video.enableVideo();
    }

    _classifyOnce () {
        const client = this._client();
        if (!client || !this._sessionId || this._inFlight) return Promise.resolve();
        const frame = this._grabFrame();
        if (!frame) return Promise.resolve();
        this._inFlight = true;
        return client.classify(this._sessionId, frame)
            .then(res => {
                if (res && res.ok) {
                    this._probableLabels = res.result.predictions || [];
                    this._lastResultAt = Date.now();
                }
            })
            .catch(() => {
                // The client already converts failures into ok:false; this is belt and braces.
            })
            .then(() => {
                this._inFlight = false;
            });
    }

    _tick () {
        this._timer = null;
        if (!this._running) return;
        // Audio sessions are driven by the host pushing results as the microphone produces them,
        // so there is nothing to send. Phase 4.
        if (this._modality !== 'audio') this._classifyOnce();
        this._schedule();
    }

    /**
     * The predictions the reporters read. Results decay so the hat blocks stop firing shortly
     * after classification is turned off, rather than latching on the last thing seen.
     * @returns {Array} the current predictions, or an empty array when they have gone stale
     */
    _labelsNow () {
        if (!this._probableLabels.length) return [];
        if (Date.now() - this._lastResultAt > Math.max(2 * this.interval, 2 * this.minInterval)) {
            return [];
        }
        return this._probableLabels;
    }

    _labelNames () {
        return this._labels.map(l => l.name);
    }

    getLabel () {
        const labels = this._labelsNow();
        if (!labels.length) return '';
        const top = labels[0];
        return top.confidence >= this.confidenceThreshold ? top.name : '';
    }

    whenLabelReceived (args) {
        const label = this.getLabel();
        if (args.LABEL === IMAGE_ANY) return label !== '';
        return label === args.LABEL;
    }

    isLabelDetected (args) {
        const label = this.getLabel();
        if (args.LABEL === ANY_WITHOUT_OF) return label !== '';
        return label === args.LABEL;
    }

    labelConfidence (args) {
        if (!args.LABEL) return 0;
        const entry = this._labelsNow().find(l => l.name === args.LABEL);
        return entry ? entry.confidence : 0;
    }

    classifyNow (_args, util) {
        if (this._inFlight) {
            if (util) util.yield();
            return;
        }
        if (!this._sessionId) return;
        this._ensureCamera();
        return this._classifyOnce();
    }

    toggleClassification (args) {
        if (args.CLASSIFICATION_STATE === 'on') {
            this._maybeAdoptHandoff();
            // Turning classification on is the point at which the camera is actually needed.
            this._ensureCamera();
            this._startPump();
        } else {
            this._stopPump();
        }
    }

    setClassificationInterval (args) {
        this.interval = Cast.toNumber(args.CLASSIFICATION_INTERVAL) * 1000;
        if (this._running) {
            // Re-arm so a shorter interval takes effect now rather than after the pending timer.
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            this._schedule();
        }
    }

    setConfidenceThreshold (args) {
        this.confidenceThreshold = MathUtil.clamp(Cast.toNumber(args.CONFIDENCE_THRESHOLD), 0, 1);
    }

    getConfidenceThreshold () {
        return this.confidenceThreshold;
    }

    videoToggle (args) {
        const state = args.VIDEO_STATE;
        const video = this.runtime && this.runtime.ioDevices && this.runtime.ioDevices.video;
        if (!video) return;
        if (state === 'off') {
            video.disableVideo();
            return;
        }
        video.enableVideo();
        this.globalVideoTransparency = Cast.toNumber(args.TRANSPARENCY);
        video.setPreviewGhost(this.globalVideoTransparency);
        // Affects only the stage preview. Frames sent for classification are always unmirrored --
        // see _grabFrame.
        video.mirror = state === 'on';
    }

    /**
     * Adopts a model the student sent with "Use in NomoPro" without them needing a `set model`
     * block. Tried once per handoff so a failed load does not retry on every tick.
     */
    _maybeAdoptHandoff () {
        if (this._sessionId || !this._pendingHandoff || this._autoHandoffTried) return;
        this._autoHandoffTried = true;
        this._loadModel({kind: 'handoff'});
    }

    // -------------------------------------------------------------------------
    // Menus
    // -------------------------------------------------------------------------

    // Menu getters are called synchronously every time a dropdown opens, and the extension manager
    // throws if one returns an empty array -- hence the placeholder in each.
    getLabelsMenu () {
        return [IMAGE_ANY].concat(this._labelNames());
    }

    getLabelsWithAnyWithoutOfMenu () {
        return [ANY_WITHOUT_OF].concat(this._labelNames());
    }

    getLabelsWithoutAnyMenu () {
        // NO_LABEL rather than '' so the dropdown is not rendered blank. It matches no class, so
        // labelConfidence reports 0 for it -- the same "nothing chosen yet" behaviour.
        return [NO_LABEL].concat(this._labelNames());
    }

    _refreshCatalog () {
        const client = this._client();
        if (!client || this._catalogRefreshing) return;
        this._catalogRefreshing = true;
        client.listModels()
            .then(res => {
                if (res && res.ok) this._modelCatalog = res.result.models || [];
            })
            .catch(() => {
                // Leave the previous catalog in place.
            })
            .then(() => {
                this._catalogRefreshing = false;
            });
    }

    getModelMenu () {
        // Synchronous contract, asynchronous data: answer from cache and refresh in the
        // background. The first open of a fresh session may show the placeholder; the next shows
        // the list.
        this._refreshCatalog();
        if (!this._modelCatalog.length) {
            return [{
                text: formatMessage({
                    id: 'nomokitml.noSavedModels',
                    default: 'no saved models',
                    description: 'Placeholder shown when no NomoKit ML models are saved yet'
                }),
                value: NO_MODEL
            }];
        }
        return this._modelCatalog.map(m => ({text: `${m.name} (${m.modality})`, value: `${m.origin}:${m.id}`}));
    }

    getInputMenu () {
        return [
            {
                text: formatMessage({
                    id: 'nomokitml.inputWebcam',
                    default: 'camera',
                    description: 'Classify what the camera sees'
                }),
                value: INPUT_WEBCAM
            },
            {
                text: formatMessage({
                    id: 'nomokitml.inputStage',
                    default: 'stage',
                    description: 'Classify what is drawn on the stage'
                }),
                value: INPUT_STAGE
            }
        ];
    }

    getVideoMenu () {
        return [
            {
                text: formatMessage({id: 'nomokitml.videoOff', default: 'off', description: 'Turn the camera off'}),
                value: 'off'
            },
            {
                text: formatMessage({id: 'nomokitml.videoOn', default: 'on', description: 'Turn the camera on'}),
                value: 'on'
            },
            {
                text: formatMessage({
                    id: 'nomokitml.videoOnFlipped',
                    default: 'on flipped',
                    description: 'Turn the camera on and mirror the stage preview'
                }),
                value: 'on-flipped'
            }
        ];
    }

    getClassificationMenu () {
        return [
            {
                text: formatMessage({
                    id: 'nomokitml.classificationOn',
                    default: 'on',
                    description: 'Start classifying'
                }),
                value: 'on'
            },
            {
                text: formatMessage({
                    id: 'nomokitml.classificationOff',
                    default: 'off',
                    description: 'Stop classifying'
                }),
                value: 'off'
            }
        ];
    }

    getClassificationIntervalMenu () {
        return ['1', '0.5', '0.2', '0.1'].map(value => ({text: value, value}));
    }

    getInfo () {
        // An array of categories. _prepareExtensionInfo accepts a bare object too, but that path
        // is the legacy peripheral shape; every other extension here returns an array.
        return [{
            id: 'nomokitml',
            name: formatMessage({
                id: 'nomokitml.categoryName',
                default: 'NomoKit ML',
                description: 'Name of the NomoKit ML extension category'
            }),
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'whenLabelReceived',
                    text: formatMessage({
                        id: 'nomokitml.whenLabelReceived',
                        default: 'when [LABEL] received',
                        description: 'Hat block: fires when the model reports this label'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        LABEL: {type: ArgumentType.STRING, menu: 'received_menu', defaultValue: IMAGE_ANY}
                    }
                },
                {
                    opcode: 'isLabelDetected',
                    text: formatMessage({
                        id: 'nomokitml.isLabelDetected',
                        default: '[LABEL] detected',
                        description: 'Boolean block: true when the model reports this label'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        LABEL: {type: ArgumentType.STRING, menu: 'labels_menu', defaultValue: ANY_WITHOUT_OF}
                    }
                },
                {
                    opcode: 'labelConfidence',
                    text: formatMessage({
                        id: 'nomokitml.labelConfidence',
                        default: 'confidence of [LABEL]',
                        description: 'Reporter: how confident the model is in this label'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            menu: 'labels_without_any_menu',
                            defaultValue: NO_LABEL
                        }
                    }
                },
                {
                    opcode: 'getLabel',
                    text: formatMessage({
                        id: 'nomokitml.getLabel',
                        default: 'label',
                        description: 'Reporter: the most likely label'
                    }),
                    blockType: BlockType.REPORTER
                },
                '---',
                {
                    opcode: 'setModel',
                    text: formatMessage({
                        id: 'nomokitml.setModel',
                        default: 'use model [MODEL]',
                        description: 'Command: pick a saved NomoKit ML model'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        // Must be non-empty and must match a menu item's value: runtime.js only
                        // emits the shadow's <field> when the default is truthy, so '' renders the
                        // dropdown blank (and a plain text arg as the literal "undefined").
                        MODEL: {type: ArgumentType.STRING, menu: 'model_menu', defaultValue: NO_MODEL}
                    }
                },
                {
                    opcode: 'setModelFromURL',
                    text: formatMessage({
                        id: 'nomokitml.setModelFromURL',
                        default: 'use model from URL [URL]',
                        description: 'Command: load a shared NomoKit ML model from a link'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {type: ArgumentType.STRING, defaultValue: 'https://'}
                    }
                },
                {
                    opcode: 'getModelName',
                    text: formatMessage({
                        id: 'nomokitml.getModelName',
                        default: 'model name',
                        description: 'Reporter: the name of the loaded model'
                    }),
                    blockType: BlockType.REPORTER
                },
                '---',
                {
                    opcode: 'setInput',
                    text: formatMessage({
                        id: 'nomokitml.setInput',
                        default: 'classify the [INPUT]',
                        description: 'Command: choose whether to classify the camera or the stage'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INPUT: {type: ArgumentType.STRING, menu: 'input_menu', defaultValue: INPUT_WEBCAM}
                    }
                },
                {
                    opcode: 'classifyNow',
                    text: formatMessage({
                        id: 'nomokitml.classifyNow',
                        default: 'classify now',
                        description: 'Command: classify a single frame immediately'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'toggleClassification',
                    text: formatMessage({
                        id: 'nomokitml.toggleClassification',
                        default: 'turn classification [CLASSIFICATION_STATE]',
                        description: 'Command: start or stop continuous classification'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CLASSIFICATION_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'classification_menu',
                            defaultValue: 'off'
                        }
                    }
                },
                {
                    opcode: 'setClassificationInterval',
                    text: formatMessage({
                        id: 'nomokitml.setClassificationInterval',
                        default: 'label once every [CLASSIFICATION_INTERVAL] seconds',
                        description: 'Command: how often to classify'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CLASSIFICATION_INTERVAL: {
                            type: ArgumentType.STRING,
                            menu: 'classification_interval_menu',
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'setConfidenceThreshold',
                    text: formatMessage({
                        id: 'nomokitml.setConfidenceThreshold',
                        default: 'set confidence threshold to [CONFIDENCE_THRESHOLD]',
                        description: 'Command: minimum confidence before a label counts'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CONFIDENCE_THRESHOLD: {type: ArgumentType.NUMBER, defaultValue: 0.5}
                    }
                },
                {
                    opcode: 'getConfidenceThreshold',
                    text: formatMessage({
                        id: 'nomokitml.getConfidenceThreshold',
                        default: 'confidence threshold',
                        description: 'Reporter: the current confidence threshold'
                    }),
                    blockType: BlockType.REPORTER
                },
                '---',
                {
                    opcode: 'videoToggle',
                    text: formatMessage({
                        id: 'nomokitml.videoToggle',
                        default: 'turn video [VIDEO_STATE] with transparency [TRANSPARENCY]',
                        description: 'Command: control the camera preview on the stage'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VIDEO_STATE: {type: ArgumentType.STRING, menu: 'video_menu', defaultValue: 'on'},
                        TRANSPARENCY: {type: ArgumentType.NUMBER, defaultValue: 50}
                    }
                }
            ],
            menus: {
                received_menu: {acceptReporters: true, items: 'getLabelsMenu'},
                labels_menu: {acceptReporters: true, items: 'getLabelsWithAnyWithoutOfMenu'},
                labels_without_any_menu: {acceptReporters: true, items: 'getLabelsWithoutAnyMenu'},
                model_menu: {acceptReporters: true, items: 'getModelMenu'},
                input_menu: this.getInputMenu(),
                video_menu: this.getVideoMenu(),
                classification_menu: this.getClassificationMenu(),
                classification_interval_menu: this.getClassificationIntervalMenu()
            }
        }];
    }
}

module.exports = NomokitMlBlocks;
