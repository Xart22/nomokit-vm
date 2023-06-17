const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");
const ml5 = require("ml5");

const MathUtil = require("../../util/math-util");
const blockIconURI =
    "data:image/png;base64,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";
const Message = {
    show_bounding_boxes: {
        en: "show bounding boxes [SHOW_BOUNDING_BOXES]",
    },
    analyse_image_from: {
        en: "analyse image",
    },

    set_detection_threshould_to: {
        en: "set detection threshold to [DETECTION_THRESHOLD]",
    },
    video_toggle: {
        en: "turn [VIDEO_STATE] video on stage with [TRANSPARENCY] transparency ",
    },
    on: {
        en: "on",
    },
    off: {
        en: "off",
    },
    video_on_flipped: {
        en: "on flipped",
    },
    webcam: {
        en: "webcam",
    },
    stage: {
        en: "stage",
    },
    get_object_count: {
        en: "get object count",
    },
    is_object_detected: {
        en: "is [LABEL] detected ?",
    },
    get_count_of: {
        en: "get count of [LABEL]",
    },
    get_object: {
        en: "get [PROPERTY] of [INDEX]",
    },
};

class OB2ScratchBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.locale = "en";
        this.globalVideoTransparency = 0;
        this.setVideoTransparency({
            TRANSPARENCY: this.globalVideoTransparency,
        });

        this.objects = [];
        this.objectDetector = ml5.objectDetector("cocossd", {}, () => {});
        this.firstLayer = document.querySelector("canvas");
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0px";
        this.canvas.style.left = "0px";
        this.canvas.style.zIndex = "1";
        this.canvas.style.pointerEvents = "none";
        this.canvas.width = this.firstLayer.width;
        this.canvas.height = this.firstLayer.height;

        this.firstLayer.parentNode.insertBefore(
            this.canvas,
            this.firstLayer.nextSibling
        );
        this.ctx = this.canvas.getContext("2d");

        this.confidenceThreshold = 0.5;
        this.showBounding = true;
        // this.canvas.style.transform = "rotateY(180deg)";
    }

    get EXTENSION_ID() {
        return "ob2scratch";
    }
    get globalVideoTransparency() {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 0;
    }

    set globalVideoTransparency(transparency) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        return transparency;
    }

    getInfo() {
        return [
            {
                id: "ob2scratch",

                name: formatMessage({
                    id: "ob2scratch.categoryName",
                    default: "ob2scratch",
                    description: "Name of the ob2scratch extension category",
                }),

                blockIconURI: blockIconURI,
                blocks: [
                    {
                        opcode: "analyseImageFrom",
                        blockType: BlockType.COMMAND,
                        text: formatMessage({
                            id: "ob2scratch.analyseImageFrom",
                            default: Message.analyse_image_from[this.locale],
                            description: "analyse image from",
                        }),
                    },
                    {
                        opcode: "videoToggle",
                        text: Message.video_toggle[this.locale],
                        blockType: BlockType.COMMAND,
                        arguments: {
                            VIDEO_STATE: {
                                type: ArgumentType.STRING,
                                menu: "video_menu",
                                defaultValue: "on",
                            },
                            TRANSPARENCY: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                        },
                    },
                    {
                        opcode: "showBoundingBoxes",
                        blockType: BlockType.COMMAND,
                        text: formatMessage({
                            id: "ob2scratch.showBoundingBoxes",
                            default: Message.show_bounding_boxes.en,
                            description: "show bounding boxes",
                        }),
                        arguments: {
                            SHOW_BOUNDING_BOXES: {
                                type: ArgumentType.STRING,
                                menu: "showBoundingBoxes",
                                defaultValue: "show",
                            },
                        },
                    },
                    {
                        opcode: "getCounts",
                        text: Message.get_object_count[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "isDetected",
                        text: Message.is_object_detected[this.locale],
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                menu: "labelsMenu",
                                defaultValue: "person",
                            },
                        },
                    },
                    {
                        opcode: "getCountOf",
                        text: Message.get_count_of[this.locale],
                        blockType: BlockType.REPORTER,
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                menu: "labelsMenu",
                                defaultValue: "person",
                            },
                        },
                    },
                    {
                        opcode: "setDetectionThreshold",
                        text: Message.set_detection_threshould_to[this.locale],
                        blockType: BlockType.COMMAND,
                        arguments: {
                            DETECTION_THRESHOLD: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0.5,
                            },
                        },
                    },
                    {
                        opcode: "getObjects",
                        text: Message.get_object[this.locale],
                        blockType: BlockType.REPORTER,
                        arguments: {
                            PROPERTY: {
                                type: ArgumentType.STRING,
                                menu: "objectProperties",
                                defaultValue: "label",
                            },
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                menu: "objectIndex",
                                defaultValue: 0,
                            },
                        },
                    },
                ],
                menus: {
                    video_menu: this.getVideoMenu(),
                    showBoundingBoxes: [
                        {
                            text: "show",
                            value: "show",
                        },
                        {
                            text: "hide",
                            value: "hide",
                        },
                    ],
                    labelsMenu: this.getLabelsMenu(),
                    medo_menu: [
                        {
                            text: "webcam",
                            value: "webcam",
                        },
                        {
                            text: "stage",
                            value: "stage",
                        },
                    ],
                    objectProperties: [
                        {
                            text: "label",
                            value: "label",
                        },
                        {
                            text: "confidence",
                            value: "confidence",
                        },
                        {
                            text: "Position X",
                            value: "positionX",
                        },
                        {
                            text: "Position Y",
                            value: "positionY",
                        },
                        {
                            text: "Width",
                            value: "width",
                        },
                        {
                            text: "Height",
                            value: "height",
                        },
                    ],
                    objectIndex: [
                        {
                            text: "1",
                            value: 0,
                        },
                        {
                            text: "2",
                            value: 1,
                        },
                        {
                            text: "3",
                            value: 2,
                        },
                        {
                            text: "4",
                            value: 3,
                        },
                        {
                            text: "5",
                            value: 4,
                        },
                        {
                            text: "6",
                            value: 5,
                        },
                        {
                            text: "7",
                            value: 6,
                        },
                        {
                            text: "8",
                            value: 7,
                        },
                        {
                            text: "9",
                            value: 8,
                        },
                        {
                            text: "10",
                            value: 9,
                        },
                    ],
                },
            },
        ];
    }

    setVideoTransparency(args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }

    showBoundingBoxes(args) {
        const state = args.SHOW_BOUNDING_BOXES;
        if (state === "on") {
            this.showBounding = true;
        } else {
            this.showBounding = false;
        }
    }

    videoToggle(args) {
        const state = args.VIDEO_STATE;
        const transparency = Cast.toNumber(args.TRANSPARENCY);

        if (state === "off") {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo();
            this.globalVideoTransparency = transparency;
            this.runtime.ioDevices.video.setPreviewGhost(transparency);
            this.runtime.ioDevices.video.mirror = state === "on";
        }
    }

    analyseImageFrom() {
        if (!this.objectDetector) {
            return Promise.resolve([]);
        }
        this.canvas.width = this.firstLayer.width;
        this.canvas.height = this.firstLayer.height;
        this.objectDetector.detect(this.firstLayer, (error, results) => {
            if (error) {
                console.error(error);
                return;
            }
            this.objects = results;
        });
        this.draw();
        return Promise.resolve(["Done"]);
    }

    draw() {
        if (this.showBounding) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0)";
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            for (let i = 0; i < this.objects.length; i++) {
                if (this.objects[i].confidence < this.confidenceThreshold) {
                    continue;
                }

                this.ctx.font = "16px Arial";
                this.ctx.fillStyle = "red";
                this.ctx.fillText(
                    this.objects[i].label +
                        " " +
                        this.objects[i].confidence.toFixed(2),
                    this.objects[i].x + 4,
                    this.objects[i].y + 16
                );

                this.ctx.beginPath();
                this.ctx.rect(
                    this.objects[i].x,
                    this.objects[i].y,
                    this.objects[i].width,
                    this.objects[i].height
                );
                this.ctx.strokeStyle = "red";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }

    getCounts() {
        if (this.objects) {
            return this.objects.length;
        }
        return 0;
    }

    isDetected(args) {
        const label = args.LABEL;
        if (this.objects) {
            for (let i = 0; i < this.objects.length; i++) {
                if (this.objects[i].label === label) {
                    return true;
                }
            }
        }
        return false;
    }

    getCountOf(args) {
        const label = args.LABEL;
        let count = 0;
        if (this.objects) {
            for (let i = 0; i < this.objects.length; i++) {
                if (this.objects[i].label === label) {
                    count++;
                }
            }
        }
        return count;
    }
    setDetectionThreshold(args) {
        let threshold = Cast.toNumber(args.DETECTION_THRESHOLD);
        threshold = MathUtil.clamp(threshold, 0, 1);
        this.confidenceThreshold = threshold;
    }

    getObjects(args) {
        let objects = this.objects[args.INDEX];

        if (!objects) {
            return "No object detected";
        }
        if (args.PROPERTY === "label") {
            return objects.label;
        }
        if (args.PROPERTY === "confidence") {
            return objects.confidence;
        }
        if (args.PROPERTY === "positionX") {
            return objects.x;
        }
        if (args.PROPERTY === "positionY") {
            return objects.y;
        }
        if (args.PROPERTY === "width") {
            return objects.width;
        }
        if (args.PROPERTY === "height") {
            return objects.height;
        }
    }
    getLabelsMenu() {
        return [
            { text: "person", value: "person" },
            { text: "bicycle", value: "bicycle" },
            { text: "car", value: "car" },
            { text: "motorcycle", value: "motorcycle" },
            { text: "airplane", value: "airplane" },
            { text: "bus", value: "bus" },
            { text: "train", value: "train" },
            { text: "truck", value: "truck" },
            { text: "boat", value: "boat" },
            { text: "trafficlight", value: "trafficlight" },
            { text: "firehydrant", value: "firehydrant" },
            { text: "stopsign", value: "stopsign" },
            { text: "parkingmeter", value: "parkingmeter" },
            { text: "bench", value: "bench" },
            { text: "bird", value: "bird" },
            { text: "cat", value: "cat" },
            { text: "dog", value: "dog" },
            { text: "horse", value: "horse" },
            { text: "sheep", value: "sheep" },
            { text: "cow", value: "cow" },
            { text: "elephant", value: "elephant" },
            { text: "bear", value: "bear" },
            { text: "zebra", value: "zebra" },
            { text: "giraffe", value: "giraffe" },
            { text: "backpack", value: "backpack" },
            { text: "umbrella", value: "umbrella" },
            { text: "handbag", value: "handbag" },
            { text: "tie", value: "tie" },
            { text: "suitcase", value: "suitcase" },
            { text: "frisbee", value: "frisbee" },
            { text: "skis", value: "skis" },
            { text: "snowboard", value: "snowboard" },
            { text: "sportsball", value: "sportsball" },
            { text: "kite", value: "kite" },
            { text: "baseballbat", value: "baseballbat" },
            { text: "baseballglove", value: "baseballglove" },
            { text: "skateboard", value: "skateboard" },
            { text: "surfboard", value: "surfboard" },
            { text: "tennisracket", value: "tennisracket" },
            { text: "bottle", value: "bottle" },
            { text: "wineglass", value: "wineglass" },
            { text: "cup", value: "cup" },
            { text: "fork", value: "fork" },
            { text: "knife", value: "knife" },
            { text: "spoon", value: "spoon" },
            { text: "bowl", value: "bowl" },
            { text: "banana", value: "banana" },
            { text: "apple", value: "apple" },
            { text: "sandwich", value: "sandwich" },
            { text: "orange", value: "orange" },
            { text: "broccoli", value: "broccoli" },
            { text: "carrot", value: "carrot" },
            { text: "hotdog", value: "hotdog" },
            { text: "pizza", value: "pizza" },
            { text: "donut", value: "donut" },
            { text: "cake", value: "cake" },
            { text: "chair", value: "chair" },
            { text: "couch", value: "couch" },
            { text: "pottedplant", value: "pottedplant" },
            { text: "bed", value: "bed" },
            { text: "diningtable", value: "diningtable" },
            { text: "toilet", value: "toilet" },
            { text: "tv", value: "tv" },
            { text: "laptop", value: "laptop" },
            { text: "mouse", value: "mouse" },
            { text: "remote", value: "remote" },
            { text: "keyboard", value: "keyboard" },
            { text: "cellphone", value: "cellphone" },
            { text: "microwave", value: "microwave" },
            { text: "oven", value: "oven" },
            { text: "toaster", value: "toaster" },
            { text: "sink", value: "sink" },
            { text: "refrigerator", value: "refrigerator" },
            { text: "book", value: "book" },
            { text: "clock", value: "clock" },
            { text: "vase", value: "vase" },
            { text: "scissors", value: "scissors" },
            { text: "teddybear", value: "teddybear" },
            { text: "hairdrier", value: "hairdrier" },
            { text: "toothbrush", value: "toothbrush" },
        ];
    }
    getVideoMenu() {
        return [
            {
                text: Message.off[this.locale],
                value: "off",
            },
            {
                text: Message.on[this.locale],
                value: "on",
            },
            {
                text: Message.video_on_flipped[this.locale],
                value: "on-flipped",
            },
        ];
    }
}

module.exports = OB2ScratchBlocks;
