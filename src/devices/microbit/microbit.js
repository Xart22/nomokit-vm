const formatMessage = require("format-message");

const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");

const CommonPeripheral = require("../common/common-peripheral");
const ProgramModeType = require("../../extension-support/program-mode-type");
/**
 * The list of USB device filters.
 * @readonly
 */
const PNPID_LIST = ["USB\\VID_0D28&PID_0204"];

/**
 * Configuration of serialport
 * @readonly
 */
const SERIAL_CONFIG = {
    baudRate: 57600,
    dataBits: 8,
    stopBits: 1,
};

/**
 * Configuration of flash.
 * @readonly
 */
const DIVECE_OPT = {
    type: "microbit",
};

const LedState = {
    On: "on",
    Off: "off",
};

const Key = {
    A: "a",
    B: "b",
};

const Gestrue = {
    Shake: "shake",
    Up: "up",
    Down: "down",
    Left: "left",
    Right: "right",
    Faceup: "faceup",
    Facedown: "facedown",
    Freefall: "freefall",
    G3: "3g",
    G6: "6g",
    G8: "8g",
};

const Axis = {
    X: "x",
    Y: "y",
    Z: "z",
};

const Pins = {
    P0: "0",
    P1: "1",
    P2: "2",
    P3: "3",
    P4: "4",
    P5: "5",
    P6: "6",
    P7: "7",
    P8: "8",
    P9: "9",
    P10: "10",
    P11: "11",
    P12: "12",
    P13: "13",
    P14: "14",
    P15: "15",
    P16: "16",
};

const Level = {
    High: "1",
    Low: "0",
};

const Chords = {
    LowC: 131,
    LowC_Minor: 139,
    LowD: 147,
    LowD_Minor: 156,
    LowE: 165,
    LowA: 175,
    LowF_Minor: 185,
    LowG: 196,
};

const Beats = {
    Whole: 1000,
    Half: 500,
    Quarter: 250,
    Eighth: 125,
    Sixteenth: 62.5,
    Double: 2000,
    Breve: 2000,
};

// const Chords = {
//     LowC: "low C",
//     LowC_Minor: "Low C#",
//     LowD: "Low D",
//     LowD_Minor: "Low D#",
//     LowE: "Low E",
//     LowA: "Low A",
//     LowF_Minor: "Low F#",
//     LowG: "Low G",
// }

/**
 * Manage communication with a Microbit peripheral over a Nomokit Link client socket.
 */
class Microbit extends CommonPeripheral {
    /**
     * Construct a Microbit communication object.
     * @param {Runtime} runtime - the Nomokit runtime
     * @param {string} deviceId - the id of the deivce
     * @param {string} originalDeviceId - the original id of the peripheral, like xxx_arduinoUno
     */
    constructor(runtime, deviceId, originalDeviceId) {
        super(
            runtime,
            deviceId,
            originalDeviceId,
            PNPID_LIST,
            SERIAL_CONFIG,
            DIVECE_OPT
        );
    }
}

/**
 * Nomokit blocks to interact with a Microbit peripheral.
 */
class NomokitMicrobitDevice {
    /**
     * @return {string} - the ID of this deivce.
     */
    get DEVICE_ID() {
        return "microbit";
    }

    get LEDSTATE_MENU() {
        return [
            {
                text: formatMessage({
                    id: "microbit.ledState.on",
                    default: "on",
                    description: "label for led state on",
                }),
                value: LedState.On,
            },
            {
                text: formatMessage({
                    id: "microbit.ledState.off",
                    default: "off",
                    description: "label for led state off",
                }),
                value: LedState.Off,
            },
        ];
    }

    get LEDBRT_MENU() {
        return [
            {
                text: "0",
                value: "0",
            },
            {
                text: "1",
                value: "1",
            },
            {
                text: "2",
                value: "2",
            },
            {
                text: "3",
                value: "3",
            },
            {
                text: "4",
                value: "4",
            },
            {
                text: "5",
                value: "5",
            },
            {
                text: "6",
                value: "6",
            },
            {
                text: "7",
                value: "7",
            },
            {
                text: "8",
                value: "8",
            },
            {
                text: "9",
                value: "9",
            },
        ];
    }

    get KEYS_MENU() {
        return [
            {
                text: "A",
                value: Key.A,
            },
            {
                text: "B",
                value: Key.B,
            },
        ];
    }

    get GESTRUES_MENU() {
        return [
            {
                text: formatMessage({
                    id: "microbit.gestruesMenu.shaken",
                    default: "shaken",
                    description: "label for shaken gestrue",
                }),
                value: Gestrue.Shake,
            },
            {
                text: formatMessage({
                    id: "microbit.gestruesMenu.tiltedUpward",
                    default: "tilted upward",
                    description: "label for tilted upward gestrue",
                }),
                value: Gestrue.Up,
            },
            {
                text: formatMessage({
                    id: "microbit.gestruesMenu.tiltedDownward",
                    default: "tilted downward",
                    description: "label for tilted downward gestrue",
                }),
                value: Gestrue.Down,
            },
            {
                text: formatMessage({
                    id: "microbit.gestruesMenu.tiltedLeftward",
                    default: "tilted leftward",
                    description: "label for tilted leftward gestrue",
                }),
                value: Gestrue.Left,
            },
            {
                text: formatMessage({
                    id: "microbit.gestruesMenu.tiltedRightward",
                    default: "tilted rightward",
                    description: "label for tilted rightward gestrue",
                }),
                value: Gestrue.Right,
            },
            {
                text: formatMessage({
                    id: "microbit.gestruesMenu.faceUp",
                    default: "face up",
                    description: "label for face up gestrue",
                }),
                value: Gestrue.Faceup,
            },
            {
                text: formatMessage({
                    id: "microbit.gestruesMenu.faceDown",
                    default: "face down",
                    description: "label for face down gestrue",
                }),
                value: Gestrue.Facedown,
            },
            {
                text: formatMessage({
                    id: "microbit.gestruesMenu.freefall",
                    default: "freefall",
                    description: "label for freefall gestrue",
                }),
                value: Gestrue.Freefall,
            },
            {
                text: "3g",
                value: Gestrue.G3,
            },
            {
                text: "6g",
                value: Gestrue.G6,
            },
            {
                text: "8g",
                value: Gestrue.G8,
            },
        ];
    }

    get AXIS_MENU() {
        return [
            {
                text: formatMessage({
                    id: "microbit.axisMenu.xAxis",
                    default: "x-axis",
                    description: "label for x axis",
                }),
                value: Axis.X,
            },
            {
                text: formatMessage({
                    id: "microbit.axisMenu.yAxis",
                    default: "y-axis",
                    description: "label for y axis",
                }),
                value: Axis.Y,
            },
            {
                text: formatMessage({
                    id: "microbit.axisMenu.zAxis",
                    default: "z-axis",
                    description: "label for z axis",
                }),
                value: Axis.Z,
            },
        ];
    }

    get PINS_MENU() {
        return [
            {
                text: "P0",
                value: Pins.P0,
            },
            {
                text: "P1",
                value: Pins.P1,
            },
            {
                text: "P2",
                value: Pins.P2,
            },
            {
                text: "P3",
                value: Pins.P3,
            },
            {
                text: "P4",
                value: Pins.P4,
            },
            {
                text: "P5",
                value: Pins.P5,
            },
            {
                text: "P6",
                value: Pins.P6,
            },
            {
                text: "P7",
                value: Pins.P7,
            },
            {
                text: "P8",
                value: Pins.P8,
            },
            {
                text: "P9",
                value: Pins.P9,
            },
            {
                text: "P10",
                value: Pins.P10,
            },
            {
                text: "P11",
                value: Pins.P11,
            },
            {
                text: "P12",
                value: Pins.P12,
            },
            {
                text: "P13",
                value: Pins.P13,
            },
            {
                text: "P14",
                value: Pins.P14,
            },
            {
                text: "P15",
                value: Pins.P15,
            },
            {
                text: "P16",
                value: Pins.P16,
            },
        ];
    }

    get LEVEL_MENU() {
        return [
            {
                text: formatMessage({
                    id: "microbit.levelMenu.high",
                    default: "high",
                    description: "label for high level",
                }),
                value: Level.High,
            },
            {
                text: formatMessage({
                    id: "microbit.levelMenu.low",
                    default: "low",
                    description: "label for low level",
                }),
                value: Level.Low,
            },
        ];
    }

    get ANALOG_PINS_MENU() {
        return [
            {
                text: "P0",
                value: Pins.P0,
            },
            {
                text: "P1",
                value: Pins.P1,
            },
            {
                text: "P2",
                value: Pins.P2,
            },
            {
                text: "P3",
                value: Pins.P3,
            },
            {
                text: "P4",
                value: Pins.P4,
            },
            {
                text: "P10",
                value: Pins.P10,
            },
        ];
    }

    get TOUCH_PINS_MENU() {
        return [
            {
                text: "P0",
                value: Pins.P0,
            },
            {
                text: "P1",
                value: Pins.P1,
            },
            {
                text: "P2",
                value: Pins.P2,
            },
        ];
    }

    get CHANNEL_MENU() {
        const channel = [];

        for (let i = 0; i < 84; i++) {
            channel.push({
                text: `${i}`,
                value: `${i}`,
            });
        }
        return channel;
    }

    get CHORDS_MENU() {
        return [
            {
                text: "Low C",
                value: Chords.LowC,
            },
            {
                text: "Low C#",
                value: Chords.LowC_Minor,
            },
            {
                text: "Low D",
                value: Chords.LowD,
            },
            {
                text: "Low D#",
                value: Chords.LowD_Minor,
            },
            {
                text: "Low E",
                value: Chords.LowE,
            },
            {
                text: "Low A",
                value: Chords.LowA,
            },
            {
                text: "Low F",
                value: Chords.LowF,
            },
            {
                text: "Low F#",
                value: Chords.LowF_Minor,
            },
            {
                text: "Low G",
                value: Chords.LowG,
            },
        ];
    }

    get BEATS_MENU() {
        return [
            {
                text: "1",
                value: Beats.Whole,
            },
            {
                text: "1/2",
                value: Beats.Half,
            },
            {
                text: "1/4",
                value: Beats.Quarter,
            },
            {
                text: "1/8",
                value: Beats.Eighth,
            },
            {
                text: "1/16",
                value: Beats.Sixteenth,
            },
            {
                text: "2",
                value: Beats.Double,
            },
            {
                text: "4",
                value: Beats.Breve,
            },
        ];
    }

    /**
     * Construct a set of Microbit blocks.
     * @param {Runtime} runtime - the Nomokit runtime.
     * @param {string} originalDeviceId - the original id of the peripheral, like xxx_arduinoUno
     */
    constructor(runtime, originalDeviceId) {
        /**
         * The Nomokit runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new Microbit peripheral instance
        this._peripheral = new Microbit(
            this.runtime,
            this.DEVICE_ID,
            originalDeviceId
        );
    }

    /**
     * @returns {Array.<object>} metadata for this extension and its blocks.
     */
    getInfo() {
        return [
            {
                id: "display",
                name: formatMessage({
                    id: "microbit.category.display",
                    default: "Display",
                    description:
                        "The name of the microbit device display category",
                }),
                color1: "#9966FF",
                color2: "#774DCB",
                color3: "#774DCB",
                blocks: [
                    {
                        opcode: "showImage",
                        text: formatMessage({
                            id: "microbit.display.showImage",
                            default: "show image [VALUE]",
                            description: "microbit show image",
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            VALUE: {
                                type: ArgumentType.MATRIX,
                                defaultValue: "0101010101100010101000100",
                            },
                        },
                    },
                    {
                        opcode: "showImageUntil",
                        text: formatMessage({
                            id: "microbit.display.showImageUntil",
                            default: "show image [VALUE] for [TIME] secs",
                            description: "microbit show image for some times",
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            VALUE: {
                                type: ArgumentType.MATRIX,
                                defaultValue: "0101010101100010101000100",
                            },
                            TIME: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "1",
                            },
                        },
                        programMode: [ProgramModeType.UPLOAD],
                    },
                    {
                        opcode: "show",
                        text: formatMessage({
                            id: "microbit.display.show",
                            default: "show [TEXT]",
                            description: "microbit show",
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "Hello Nomokit",
                            },
                        },
                        programMode: [ProgramModeType.UPLOAD],
                    },
                    {
                        opcode: "showUntilScrollDone",
                        text: formatMessage({
                            id: "microbit.display.showUntilScrollDone",
                            default: "show [TEXT] until scroll done",
                            description: "microbit show until scroll done",
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "Hello Nomokit",
                            },
                        },
                    },
                    {
                        opcode: "clearDisplay",
                        text: formatMessage({
                            id: "microbit.display.clearDisplay",
                            default: "clear screen",
                            description: "microbit clear display",
                        }),
                        blockType: BlockType.COMMAND,
                    },
                    "---",
                    {
                        opcode: "lightPixelAt",
                        text: formatMessage({
                            id: "microbit.display.lightPixelAt",
                            default:
                                "light [STATE] at the x: [X] axis, y: [Y] axis",
                            description: "microbit light pixel at",
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            STATE: {
                                type: ArgumentType.STRING,
                                menu: "ledState",
                                defaultValue: LedState.On,
                            },
                            X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "0",
                            },
                            Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "0",
                            },
                        },
                        programMode: [ProgramModeType.UPLOAD],
                    },
                    {
                        opcode: "showOnPiexlbrightness",
                        text: formatMessage({
                            id: "microbit.display.showOnPiexlbrightness",
                            default:
                                "show on the x: [X] axis, y: [Y] axis with brightness [BRT]",
                            description: "microbit show on piexl brightness",
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "0",
                            },
                            Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "0",
                            },
                            BRT: {
                                type: ArgumentType.STRING,
                                menu: "ledBrightness",
                                defaultValue: "9",
                            },
                        },
                        programMode: [ProgramModeType.UPLOAD],
                    },
                ],
                menus: {
                    ledState: {
                        items: this.LEDSTATE_MENU,
                    },
                    ledBrightness: {
                        acceptReporters: true,
                        items: this.LEDBRT_MENU,
                    },
                },
            },
        ];
    }

    showUntilScrollDone(args) {
        this._peripheral._firmataMicrobit.enableDisplay(true);
        this._peripheral._firmataMicrobit.scrollString(args.TEXT, 80);
    }

    showImage(args) {
        this._peripheral._firmataMicrobit.enableDisplay(true);
        console.log(args.VALUE);
        const matrikImage = [];
        for (let i = 0; i < 5; i++) {
            matrikImage[i] = [];
            for (let j = 0; j < 5; j++) {
                matrikImage[i][j] = args.VALUE[i * 5 + j];
            }
        }
        console.log(matrikImage);
        this._peripheral._firmataMicrobit.displayShow(false, matrikImage);
    }

    clearDisplay() {
        this._peripheral._firmataMicrobit.displayClear();
    }
}

module.exports = NomokitMicrobitDevice;
