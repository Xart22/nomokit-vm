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
    LowC: "131",
    LowC_Minor: "139",
    LowD: "147",
    LowD_Minor: "156",
    LowE: "165",
    LowF: "175",
    LowF_Minor: "185",
    LowG: "196",
    LowG_Minor: "208",
    LowA: "220",
    LowA_Minor: "233",
    LowB: "247",
    MiddleC: "262",
    MiddleC_Minor: "277",
    MiddleD: "294",
    MiddleD_Minor: "311",
    MiddleE: "330",
    MiddleF: "349",
    MiddleF_Minor: "370",
    MiddleG: "392",
    MiddleG_Minor: "415",
    MiddleA: "440",
    MiddleA_Minor: "466",
    MiddleB: "494",
    HighC: "523",
    HighC_Minor: "554",
    HighD: "587",
    HighD_Minor: "622",
    HighE: "659",
    HighF: "698",
    HighF_Minor: "740",
    HighG: "784",
    HighG_Minor: "831",
    HighA: "880",
    HighA_Minor: "932",
    HighB: "988",
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

const Melody = {
    dadadum: "DADADADUM",
    entertainer: "ENTERTAINER",
    prelude: "PRELUDE",
    ode: "ODE",
    nyan: "NYAN",
    ringtone: "RINGTONE",
    funk: "FUNK",
    blues: "BLUES",
    birthday: "BIRTHDAY",
    wedding: "WEDDING",
    funereal: "FUNERAL",
    punchline: "PUNCHLINE",
    python: "PYTHON",
    baddy: "BADDY",
    chase: "CHASE",
    ba_ding: "BA_DING",
    wawawawaa: "WAWAWAWAA",
    jump_up: "JUMP_UP",
    jump_down: "JUMP_DOWN",
    power_up: "POWER_UP",
    power_down: "POWER_DOWN",
};

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
            {
                text: "Low G#",
                value: Chords.LowG_Minor,
            },
            {
                text: "Low A",
                value: Chords.LowA,
            },

            {
                text: "Low A#",
                value: Chords.LowA_Minor,
            },
            {
                text: "Low B",
                value: Chords.LowB,
            },
            {
                text: "Middle C",
                value: Chords.MiddleC,
            },
            {
                text: "Middle C#",
                value: Chords.MiddleC_Minor,
            },
            {
                text: "Middle D",
                value: Chords.MiddleD,
            },
            {
                text: "Middle D#",
                value: Chords.MiddleD_Minor,
            },
            {
                text: "Middle E",
                value: Chords.MiddleE,
            },
            {
                text: "Middle F",
                value: Chords.MiddleF,
            },
            {
                text: "Middle F#",
                value: Chords.MiddleF_Minor,
            },
            {
                text: "Middle G",
                value: Chords.MiddleG,
            },
            {
                text: "Middle G#",
                value: Chords.MiddleG_Minor,
            },
            {
                text: "Middle A",
                value: Chords.MiddleA,
            },

            {
                text: "Middle A#",
                value: Chords.MiddleA_Minor,
            },
            {
                text: "Middle B",
                value: Chords.MiddleB,
            },
            {
                text: "High C",
                value: Chords.HighC,
            },
            {
                text: "High C#",
                value: Chords.HighC_Minor,
            },
            {
                text: "High D",
                value: Chords.HighD,
            },
            {
                text: "High D#",
                value: Chords.HighD_Minor,
            },
            {
                text: "High E",
                value: Chords.HighE,
            },
            {
                text: "High F",
                value: Chords.HighF,
            },
            {
                text: "High F#",
                value: Chords.HighF_Minor,
            },
            {
                text: "High G",
                value: Chords.HighG,
            },
            {
                text: "High G#",
                value: Chords.HighG_Minor,
            },
            {
                text: "High A",
                value: Chords.HighA,
            },

            {
                text: "High A#",
                value: Chords.HighA_Minor,
            },
            {
                text: "High B",
                value: Chords.HighB,
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

    get MELODY_MENU() {
        return [
            {
                text: "dadadum",
                value: Melody.dadadum,
            },
            {
                text: "entertainer",
                value: Melody.entertainer,
            },
            {
                text: "prelude",
                value: Melody.prelude,
            },
            {
                text: "ode",
                value: Melody.ode,
            },
            {
                text: "nyan",
                value: Melody.nyan,
            },
            {
                text: "ringtone",
                value: Melody.ringtone,
            },
            {
                text: "funk",
                value: Melody.funk,
            },
            {
                text: "blues",
                value: Melody.blues,
            },
            {
                text: "birthday",
                value: Melody.birthday,
            },
            {
                text: "wedding",
                value: Melody.wedding,
            },
            {
                text: "funereal",
                value: Melody.funereal,
            },
            {
                text: "punchline",
                value: Melody.punchline,
            },
            {
                text: "baddy",
                value: Melody.baddy,
            },
            {
                text: "chase",
                value: Melody.chase,
            },
            {
                text: "ba ding",
                value: Melody.ba_ding,
            },
            {
                text: "wawawawaa",
                value: Melody.wawawawaa,
            },
            {
                text: "jump up",
                value: Melody.jump_up,
            },
            {
                text: "jump down",
                value: Melody.jump_down,
            },
            {
                text: "power up",
                value: Melody.power_up,
            },
            {
                text: "power down",
                value: Melody.power_down,
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
                id: "pin",
                name: formatMessage({
                    id: "microbit.category.pins",
                    default: "Pins",
                    description: "The name of the microbit device pin category",
                }),
                color1: "#4C97FF",
                color2: "#3373CC",
                color3: "#3373CC",

                blocks: [
                    {
                        opcode: "setDigitalOutput",
                        text: formatMessage({
                            id: "microbit.pins.setDigitalOutput",
                            default: "set digital pin [PIN] out [LEVEL]",
                            description: "microbit set digital pin out",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: "pins",
                                defaultValue: Pins.P0,
                            },
                            LEVEL: {
                                type: ArgumentType.STRING,
                                menu: "level",
                                defaultValue: Level.High,
                            },
                        },
                    },
                    {
                        opcode: "setPwmOutput",
                        text: formatMessage({
                            id: "microbit.pins.setPwmOutput",
                            default: "set pwm pin [PIN] out [OUT]",
                            description: "microbit set pwm pin out",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: "pins",
                                defaultValue: Pins.P0,
                            },
                            OUT: {
                                type: ArgumentType.UINT10_NUMBER,
                                defaultValue: "1023",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "readDigitalPin",
                        text: formatMessage({
                            id: "microbit.pins.readDigitalPin",
                            default: "read digital pin [PIN]",
                            description: "microbit read digital pin",
                        }),
                        blockType: BlockType.BOOLEAN,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: "pins",
                                defaultValue: Pins.P0,
                            },
                        },
                    },
                    {
                        opcode: "readAnalogPin",
                        text: formatMessage({
                            id: "microbit.pins.readAnalogPin",
                            default: "read analog pin [PIN]",
                            description: "microbit read analog pin",
                        }),
                        blockType: BlockType.REPORTER,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: "analogPins",
                                defaultValue: Pins.P0,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "pinTouched",
                        text: formatMessage({
                            id: "microbit.pins.pinIsTouched",
                            default: "pin [PIN] is touched",
                            description: "microbit pin is touched",
                        }),
                        blockType: BlockType.REPORTER,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: "touchPins",
                                defaultValue: Pins.P0,
                            },
                        },
                    },
                ],
                menus: {
                    pins: {
                        items: this.PINS_MENU,
                    },
                    level: {
                        acceptReporters: true,
                        items: this.LEVEL_MENU,
                    },
                    analogPins: {
                        items: this.ANALOG_PINS_MENU,
                    },
                    touchPins: {
                        items: this.TOUCH_PINS_MENU,
                    },
                },
            },
            {
                id: "display",
                name: formatMessage({
                    id: "microbit.category.display",
                    default: "Image",
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
                        opcode: "showArrow",
                        text: formatMessage({
                            id: "microbit.display.showArrow",
                            default: "show arrow [ARROW]",
                            description: "microbit show arrow",
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            ARROW: {
                                type: ArgumentType.STRING,
                                menu: "arrow",
                                defaultValue: "00900:09990:90909:00900:00900",
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
                    arrow: {
                        items: [
                            {
                                text: formatMessage({
                                    id: "microbit.arrow.north",
                                    default: "North",
                                    description: "label for north arrow",
                                }),
                                value: "00900:09990:90909:00900:00900",
                            },
                            {
                                text: formatMessage({
                                    id: "microbit.arrow.northeast",
                                    default: "Northeast",
                                    description: "label for northeast arrow",
                                }),
                                value: "00999:00099:00909:09000:90000",
                            },
                            {
                                text: formatMessage({
                                    id: "microbit.arrow.east",
                                    default: "East",
                                    description: "label for east arrow",
                                }),
                                value: "00900:00090:99999:00090:00900",
                            },
                            {
                                text: formatMessage({
                                    id: "microbit.arrow.southeast",
                                    default: "Southeast",
                                    description: "label for southeast arrow",
                                }),
                                value: "90000:09000:00909:00099:00999",
                            },
                            {
                                text: formatMessage({
                                    id: "microbit.arrow.south",
                                    default: "South",
                                    description: "label for south arrow",
                                }),
                                value: "00900:00900:90909:09990:00900",
                            },
                            {
                                text: formatMessage({
                                    id: "microbit.arrow.southwest",
                                    default: "Southwest",
                                    description: "label for southwest arrow",
                                }),
                                value: "00009:00090:90900:99000:99900",
                            },
                            {
                                text: formatMessage({
                                    id: "microbit.arrow.west",
                                    default: "West",
                                    description: "label for west arrow",
                                }),
                                value: "00900:09000:99999:09000:00900",
                            },
                            {
                                text: formatMessage({
                                    id: "microbit.arrow.northwest",
                                    default: "Northwest",
                                    description: "label for northwest arrow",
                                }),
                                value: "99900:99000:90900:00090:00009",
                            },
                        ],
                    },
                },
            },
            {
                id: "sensor",
                name: formatMessage({
                    id: "microbit.category.sensor",
                    default: "Sensor",
                    description:
                        "The name of the microbit device sensor category",
                }),
                color1: "#4CBFE6",
                color2: "#2E8EB8",
                color3: "#2E8EB8",

                blocks: [
                    {
                        opcode: "buttonIsPressed",
                        text: formatMessage({
                            id: "microbit.sensor.buttonIsPressed",
                            default: "[KEY] button is pressed?",
                            description: "wether microbit button is pressed",
                        }),
                        blockType: BlockType.BOOLEAN,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                menu: "keys",
                                defaultValue: Key.A,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "gestureIsX",
                        text: formatMessage({
                            id: "microbit.sensor.gestureIsX",
                            default: "gestrue is [STA]?",
                            description: "microbit gestrue is XXX",
                        }),
                        blockType: BlockType.BOOLEAN,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            STA: {
                                type: ArgumentType.STRING,
                                menu: "gestrues",
                                defaultValue: Gestrue.Shake,
                            },
                        },
                    },
                    {
                        opcode: "axisAcceleration",
                        text: formatMessage({
                            id: "microbit.sensor.axisAcceleration",
                            default: "[AXIS] axis acceleration",
                            description: "microbit axis acceleration",
                        }),
                        blockType: BlockType.REPORTER,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            AXIS: {
                                type: ArgumentType.STRING,
                                menu: "axis",
                                defaultValue: Axis.X,
                            },
                        },
                    },
                    "---",
                    // {
                    //     opcode: "compassAngle",
                    //     text: formatMessage({
                    //         id: "microbit.sensor.compassAngle",
                    //         default: "compass angle",
                    //         description: "microbit compass angle",
                    //     }),
                    //     blockType: BlockType.REPORTER,
                    //     programMode: [ProgramModeType.UPLOAD],
                    //     disableMonitor: true,
                    // },
                    // {
                    //     opcode: "compassMagneticDensity",
                    //     text: formatMessage({
                    //         id: "microbit.sensor.compassMagneticDensity",
                    //         default: "compass magnetic density",
                    //         description: "microbit compass magnetic density",
                    //     }),
                    //     blockType: BlockType.REPORTER,
                    //     programMode: [ProgramModeType.UPLOAD],
                    //     disableMonitor: true,
                    // },
                    // {
                    //     opcode: "calibrateCompass",
                    //     text: formatMessage({
                    //         id: "microbit.sensor.calibrateCompass",
                    //         default: "calibrate compass",
                    //         description: "microbit calibrate compass",
                    //     }),
                    //     blockType: BlockType.COMMAND,
                    //     programMode: [ProgramModeType.UPLOAD],
                    // },
                    "---",
                    {
                        opcode: "lightLevel",
                        text: formatMessage({
                            id: "microbit.sensor.lightLevel",
                            default: "light level",
                            description: "microbit light level",
                        }),
                        blockType: BlockType.REPORTER,
                        programMode: [ProgramModeType.UPLOAD],
                        disableMonitor: true,
                    },
                    "---",
                    {
                        opcode: "temperature",
                        text: formatMessage({
                            id: "microbit.sensor.temperature",
                            default: "temperature",
                            description: "microbit temperature",
                        }),
                        blockType: BlockType.REPORTER,
                        programMode: [ProgramModeType.UPLOAD],
                        disableMonitor: true,
                    },
                    "---",
                    {
                        opcode: "runningTime",
                        text: formatMessage({
                            id: "microbit.sensor.runningTime",
                            default: "running time",
                            description: "microbit running time",
                        }),
                        blockType: BlockType.REPORTER,
                        programMode: [ProgramModeType.UPLOAD],
                        disableMonitor: true,
                    },
                ],
                menus: {
                    keys: {
                        items: this.KEYS_MENU,
                    },
                    gestrues: {
                        items: this.GESTRUES_MENU,
                    },
                    axis: {
                        items: this.AXIS_MENU,
                    },
                },
            },
            {
                id: "wireless",
                name: formatMessage({
                    id: "microbit.category.wireless",
                    default: "Radio",
                    description:
                        "The name of the microbit device wireless category",
                }),
                color1: "#D65CD6",
                color2: "#BD42BD",
                color3: "#BD42BD",

                blocks: [
                    {
                        opcode: "openWirelessCommunication",
                        text: formatMessage({
                            id: "microbit.wireless.openWirelessCommunication",
                            default: "open Radio communication",
                            description: "microbit open wireless communication",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                    },
                    {
                        opcode: "setWirelessCommunicationGroup",
                        text: formatMessage({
                            id: "microbit.wireless.setWirelessCommunicationGroup",
                            default: "set Radio communication group as [GROUP]",
                            description: "microbit set wireless communication",
                        }),
                        arguments: {
                            GROUP: {
                                type: ArgumentType.UINT8_NUMBER,
                                defaultValue: "0",
                            },
                        },
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                    },
                    {
                        opcode: "closeWirelessCommunication",
                        text: formatMessage({
                            id: "microbit.wireless.closeWirelessCommunication",
                            default: "close Radio communication",
                            description:
                                "microbit close wireless communication",
                        }),
                        programMode: [ProgramModeType.UPLOAD],
                        blockType: BlockType.COMMAND,
                    },
                    {
                        opcode: "resetWirelessCommunication",
                        text: formatMessage({
                            id: "microbit.wireless.resetWirelessCommunication",
                            default: "reset Radio communication",
                            description:
                                "microbit reset wireless communication",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                    },
                    "---",
                    {
                        opcode: "sendWirelessMessage",
                        text: formatMessage({
                            id: "microbit.wireless.sendWirelessMessage",
                            default: "send Radio message [TEXT]",
                            description: "microbit send wireless message",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "Hello Nomokit",
                            },
                        },
                    },
                    {
                        opcode: "receiveWirelessMessage",
                        text: formatMessage({
                            id: "microbit.wireless.receiveWirelessMessage",
                            default: "receive Radio message",
                            description: "microbit receive wireless message",
                        }),
                        blockType: BlockType.REPORTER,
                        programMode: [ProgramModeType.UPLOAD],
                        disableMonitor: true,
                    },
                    {
                        opcode: "setWirelessCommunicationChannel",
                        text: formatMessage({
                            id: "microbit.wireless.setWirelessCommunicationChannel",
                            default: "set Radio communication channel as [CH]",
                            description:
                                "microbit set wireless communication channel",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            CH: {
                                type: ArgumentType.STRING,
                                menu: "channel",
                                defaultValue: "0",
                            },
                        },
                    },
                ],
                menus: {
                    channel: {
                        items: this.CHANNEL_MENU,
                    },
                },
            },
            {
                id: "console",
                name: formatMessage({
                    id: "microbit.category.console",
                    default: "Console",
                    description:
                        "The name of the microbit device console category",
                }),
                color1: "#FF3399",
                color2: "#CC297A",
                color3: "#CC297A",

                blocks: [
                    {
                        opcode: "consolePrint",
                        text: formatMessage({
                            id: "microbit.console.consolePrint",
                            default: "print [TEXT]",
                            description: "microbit console print",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "Hello Nomokit",
                            },
                        },
                    },
                ],
            },
            {
                id: "music",
                name: formatMessage({
                    id: "microbit.category.music",
                    default: "Musics",
                    description:
                        "The name of the microbit device music category",
                }),
                color1: "#4C97FF",
                color2: "#3373CC",
                color3: "#3373CC",
                blocks: [
                    {
                        opcode: "playTone",
                        text: formatMessage({
                            id: "microbit.music.playTone",
                            default: "play tone chords [CHORDS] for [BEATS]",
                            description: "microbit play tone",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            CHORDS: {
                                type: ArgumentType.UINT10_NUMBER,
                                menu: "chords",
                                defaultValue: Chords.LowC,
                            },
                            BEATS: {
                                type: ArgumentType.STRING,
                                menu: "beats",
                                defaultValue: Beats.Whole,
                            },
                        },
                    },
                    {
                        opcode: "playMelody",
                        text: formatMessage({
                            id: "microbit.music.playMelody",
                            default: "play melody [MELODY]",
                            description: "microbit play melody",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            MELODY: {
                                type: ArgumentType.STRING,
                                menu: "melody",
                                defaultValue: Melody.dadadum,
                            },
                        },
                    },
                    {
                        opcode: "setTempo",
                        text: formatMessage({
                            id: "microbit.music.setTempo",
                            default: "set tempo [TEMPO]",
                            description: "microbit set tempo",
                        }),
                        blockType: BlockType.COMMAND,
                        programMode: [ProgramModeType.UPLOAD],
                        arguments: {
                            TEMPO: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "255",
                            },
                        },
                    },
                ],
                menus: {
                    chords: {
                        items: this.CHORDS_MENU,
                    },
                    beats: {
                        items: this.BEATS_MENU,
                    },
                    melody: {
                        items: this.MELODY_MENU,
                    },
                },
            },
            // {
            //     id: "array",
            //     name: formatMessage({
            //         id: "microbit.category.array",
            //         default: "Array",
            //         description:
            //             "The name of the microbit device array category",
            //     }),
            //     color1: "#FF0000",
            //     blocks: [
            //         {
            //             opcode: "setArray",
            //             text: formatMessage({
            //                 id: "microbit.array.setArray",
            //                 default: "set array [VAR] to [VALUE] type [TYPE]",
            //                 description: "microbit set array",
            //             }),
            //             blockType: BlockType.COMMAND,
            //             programMode: [ProgramModeType.UPLOAD],
            //             arguments: {
            //                 VAR: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "list",
            //                 },
            //                 VALUE: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "1,2,3,4,5",
            //                 },
            //                 TYPE: {
            //                     type: ArgumentType.STRING,
            //                     menu: "type",
            //                     defaultValue: "int",
            //                 },
            //             },
            //         },
            //         {
            //             opcode: "listLength",
            //             text: formatMessage({
            //                 id: "microbit.array.listLength",
            //                 default: "length of [VAR]",
            //                 description: "microbit list length",
            //             }),
            //             blockType: BlockType.REPORTER,
            //             programMode: [ProgramModeType.UPLOAD],
            //             arguments: {
            //                 VAR: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "list",
            //                 },
            //             },
            //         },
            //         {
            //             opcode: "getValuFromList",
            //             text: formatMessage({
            //                 id: "microbit.array.getValuFromList",
            //                 default: "get value from [VAR] at [INDEX]",
            //                 description: "microbit get value from list",
            //             }),
            //             blockType: BlockType.REPORTER,
            //             programMode: [ProgramModeType.UPLOAD],
            //             arguments: {
            //                 VAR: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "list",
            //                 },
            //                 INDEX: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "0",
            //                 },
            //             },
            //         },
            //         {
            //             opcode: "setValuToList",
            //             text: formatMessage({
            //                 id: "microbit.array.setValuToList",
            //                 default: "set value to [VAR] at [INDEX] to [VALUE]",
            //                 description: "microbit set value to list",
            //             }),
            //             blockType: BlockType.COMMAND,
            //             programMode: [ProgramModeType.UPLOAD],
            //             arguments: {
            //                 VAR: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "list",
            //                 },
            //                 INDEX: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "0",
            //                 },
            //                 VALUE: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "0",
            //                 },
            //             },
            //         },
            //         {
            //             opcode: "insertValuToList",
            //             text: formatMessage({
            //                 id: "microbit.array.insertValuToList",
            //                 default:
            //                     "insert value to [VAR] at [INDEX] to [VALUE]",
            //                 description: "microbit insert value to list",
            //             }),
            //             blockType: BlockType.COMMAND,
            //             programMode: [ProgramModeType.UPLOAD],
            //             arguments: {
            //                 VAR: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "list",
            //                 },
            //                 INDEX: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "0",
            //                 },
            //                 VALUE: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "0",
            //                 },
            //             },
            //         },
            //         {
            //             opcode: "findValuFromList",
            //             text: formatMessage({
            //                 id: "microbit.array.findValuFromList",
            //                 default: "find value from [VAR] at [INDEX]",
            //                 description: "microbit find value from list",
            //             }),
            //             blockType: BlockType.REPORTER,
            //             programMode: [ProgramModeType.UPLOAD],
            //             arguments: {
            //                 VAR: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "list",
            //                 },
            //                 INDEX: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "0",
            //                 },
            //             },
            //         },
            //         {
            //             opcode: "randomValuFromList",
            //             text: formatMessage({
            //                 id: "microbit.array.randomValuFromList",
            //                 default: "get random value from [VAR]",
            //                 description: "microbit find value from list",
            //             }),
            //             blockType: BlockType.REPORTER,
            //             programMode: [ProgramModeType.UPLOAD],
            //             arguments: {
            //                 VAR: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "list",
            //                 },
            //             },
            //         },
            //         {
            //             opcode: "removeValuFromList",
            //             text: formatMessage({
            //                 id: "microbit.array.removeValuFromList",
            //                 default: "remove value from [VAR] at [INDEX]",
            //                 description: "microbit remove value from list",
            //             }),
            //             blockType: BlockType.COMMAND,
            //             programMode: [ProgramModeType.UPLOAD],
            //             arguments: {
            //                 VAR: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "list",
            //                 },
            //                 INDEX: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "0",
            //                 },
            //             },
            //         },
            //         {
            //             opcode: "reverseList",
            //             text: formatMessage({
            //                 id: "microbit.array.reverseList",
            //                 default: "reverse list [VAR]",
            //                 description: "microbit reverse list",
            //             }),
            //             blockType: BlockType.COMMAND,
            //             programMode: [ProgramModeType.UPLOAD],
            //             arguments: {
            //                 VAR: {
            //                     type: ArgumentType.STRING,
            //                     defaultValue: "list",
            //                 },
            //             },
            //         },
            //     ],
            //     menus: {
            //         type: {
            //             items: [
            //                 {
            //                     text: "int",
            //                     value: "int",
            //                 },
            //                 {
            //                     text: "float",
            //                     value: "float",
            //                 },
            //                 {
            //                     text: "string",
            //                     value: "string",
            //                 },
            //             ],
            //         },
            //     },
            // },
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
