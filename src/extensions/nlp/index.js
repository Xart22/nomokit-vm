const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");

const CSV_TEMPLATE =
    "name,age,city\nAlice,25,New York\nBob,30,Los Angeles\nCharlie,22,Chicago\nDiana,28,Houston";

const SAMPLE_INTENTS = [
    {
        label: "greeting",
        examples: ["hi", "hello", "hey", "good morning", "good afternoon"],
    },
    {
        label: "goodbye",
        examples: ["bye", "see you", "good night", "farewell", "take care"],
    },
    {
        label: "question",
        examples: [
            "what",
            "how",
            "why",
            "when",
            "where",
            "who",
            "can you",
            "tell me",
        ],
    },
];

const blockIconURI =
    "data:image/svg+xml;base64," +
    Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#855cd6"/><stop offset="100%" stop-color="#6c4abf"/></linearGradient></defs><rect width="48" height="48" rx="8" fill="url(#b)"/><g transform="translate(9,10)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h22a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H15l-7 6V22H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill="rgba(255,255,255,0.15)"/><line x1="8" y1="11" x2="22" y2="11"/><line x1="8" y1="16" x2="18" y2="16"/></g></svg>',
    ).toString("base64");

class Scratch3NLPBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this._intents = [];
        this._lastIntent = null;
        this._lastIntentConfidence = 0;
        this._lastCsvContent = "";
        this._lastCsvName = "";
        this._isDesktop = false;
        this._pulseActive = false;
        this._pulseIntent = "";
    }

    get EXTENSION_NAME() {
        return "NLP";
    }

    get EXTENSION_ID() {
        return "nlp";
    }

    _checkDesktop() {
        if (
            typeof window !== "undefined" &&
            window.electronAPI &&
            window.electronAPI.nlp
        ) {
            this._isDesktop = true;
            return true;
        }
        this._isDesktop = false;
        return false;
    }

    _notAvailable() {
        return "NLP only available on nomokit-desktop";
    }

    getInfo() {
        return [
            {
                id: "nlp",
                name: formatMessage({
                    id: "nlp.categoryName",
                    default: "NLP",
                }),
                blockIconURI: blockIconURI,
                blocks: [
                    {
                        opcode: "sentiment",
                        blockType: BlockType.REPORTER,
                        text: "sentiment of [TEXT]",
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "hello",
                            },
                        },
                    },
                    {
                        opcode: "sentimentScore",
                        blockType: BlockType.REPORTER,
                        text: "sentiment score of [TEXT]",
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "hello",
                            },
                        },
                    },
                    {
                        opcode: "entities",
                        blockType: BlockType.REPORTER,
                        text: "entities in [TEXT]",
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "Apple is in California",
                            },
                        },
                    },
                    {
                        opcode: "classify",
                        blockType: BlockType.COMMAND,
                        text: "classify [TEXT]",
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "I love this",
                            },
                        },
                    },
                    {
                        opcode: "classifyResult",
                        blockType: BlockType.REPORTER,
                        text: "classify result of [TEXT]",
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "I love this",
                            },
                        },
                    },
                    {
                        opcode: "train",
                        blockType: BlockType.COMMAND,
                        text: "train label [LABEL] with [EXAMPLES]",
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                defaultValue: "greeting",
                            },
                            EXAMPLES: {
                                type: ArgumentType.STRING,
                                defaultValue: "hi,hello,hey",
                            },
                        },
                    },
                    {
                        opcode: "similarity",
                        blockType: BlockType.REPORTER,
                        text: "similarity [TEXT1] [TEXT2]",
                        arguments: {
                            TEXT1: {
                                type: ArgumentType.STRING,
                                defaultValue: "cat",
                            },
                            TEXT2: {
                                type: ArgumentType.STRING,
                                defaultValue: "dog",
                            },
                        },
                    },
                    {
                        opcode: "exportTraining",
                        blockType: BlockType.COMMAND,
                        text: "export training data",
                    },
                    {
                        opcode: "importTraining",
                        blockType: BlockType.COMMAND,
                        text: "import training data",
                    },
                    {
                        opcode: "resetAll",
                        blockType: BlockType.COMMAND,
                        text: "reset all intents",
                    },
                    {
                        opcode: "removeIntent",
                        blockType: BlockType.COMMAND,
                        text: "remove intent [LABEL]",
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                defaultValue: "greeting",
                            },
                        },
                    },
                    {
                        opcode: "whenIntentDetected",
                        blockType: BlockType.HAT,
                        text: "when [INTENT] detected",
                        arguments: {
                            INTENT: {
                                type: ArgumentType.STRING,
                                menu: "intentMenu",
                            },
                        },
                    },
                    {
                        opcode: "getLastIntent",
                        blockType: BlockType.REPORTER,
                        text: "last intent",
                    },
                    {
                        opcode: "getLastConfidence",
                        blockType: BlockType.REPORTER,
                        text: "last confidence",
                    },
                    {
                        opcode: "uploadCsv",
                        blockType: BlockType.COMMAND,
                        text: "upload csv",
                    },
                    {
                        opcode: "downloadCsv",
                        blockType: BlockType.COMMAND,
                        text: "download csv data",
                        arguments: {
                            DATA: {
                                type: ArgumentType.STRING,
                                defaultValue: "",
                            },
                        },
                    },

                    {
                        opcode: "downloadCsvTemplate",
                        blockType: BlockType.COMMAND,
                        text: "download csv template",
                    },

                    {
                        opcode: "loadSampleIntents",
                        blockType: BlockType.COMMAND,
                        text: "load sample intents",
                    },
                    {
                        opcode: "trainFromCsv",
                        blockType: BlockType.COMMAND,
                        text: "train from csv",
                    },
                ],
                menus: {
                    intentMenu: {
                        acceptReporters: true,
                        items: "getIntents",
                    },
                },
            },
        ];
    }

    getIntents() {
        return this._intents.length > 0
            ? this._intents.map((i) => ({ text: i, value: i }))
            : [{ text: "greeting", value: "greeting" }];
    }

    async sentiment(args) {
        if (!this._checkDesktop()) return this._notAvailable();
        const text = Cast.toString(args.TEXT);
        try {
            const result = await window.electronAPI.nlp.sentiment(text);
            return result || "neutral";
        } catch (e) {
            return "neutral";
        }
    }

    async entities(args) {
        if (!this._checkDesktop()) return this._notAvailable();
        const text = Cast.toString(args.TEXT);
        try {
            const result = await window.electronAPI.nlp.entities(text);
            return result || "";
        } catch (e) {
            return "";
        }
    }

    classify(args) {
        if (!this._checkDesktop()) return this._notAvailable();
        const text = Cast.toString(args.TEXT);
        try {
            const result = window.electronAPI.nlp.classifySync(text);
            const label = (result && result.label) || "";
            const conf = (result && result.confidence) || 0;
            this._lastIntent = label;
            this._lastIntentConfidence = conf;
            if (label) {
                this._pulseActive = true;
                this._pulseIntent = label;
            }
            return label;
        } catch (e) {
            return "";
        }
    }

    async classifyResult(args) {
        if (!this._checkDesktop()) return this._notAvailable();
        const text = Cast.toString(args.TEXT);
        try {
            const result = await window.electronAPI.nlp.classifyResult(text);
            const label = (result && result.label) || "";
            const conf = (result && result.confidence) || 0;
            this._lastIntent = label;
            this._lastIntentConfidence = conf;
            if (label) {
                this._pulseActive = true;
                this._pulseIntent = label;
            }
            return label || "";
        } catch (e) {
            return "";
        }
    }

    async sentimentScore(args) {
        if (!this._checkDesktop()) return 0;
        const text = Cast.toString(args.TEXT);
        try {
            const result = await window.electronAPI.nlp.sentimentScore(text);
            return Cast.toNumber(result);
        } catch (e) {
            return 0;
        }
    }

    async train(args) {
        if (!this._checkDesktop()) return;
        const label = Cast.toString(args.LABEL);
        const examples = Cast.toString(args.EXAMPLES)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        if (!this._intents.includes(label)) {
            this._intents.push(label);
        }
        try {
            await window.electronAPI.nlp.train(label, examples);
        } catch (e) {
            // silent
        }
    }

    async similarity(args) {
        if (!this._checkDesktop()) return 0;
        const t1 = Cast.toString(args.TEXT1);
        const t2 = Cast.toString(args.TEXT2);
        try {
            const result = await window.electronAPI.nlp.similarity(t1, t2);
            return Cast.toNumber(result);
        } catch (e) {
            return 0;
        }
    }

    async exportTraining() {
        if (!this._checkDesktop()) return;
        try {
            await window.electronAPI.nlp.exportTraining();
        } catch (e) {
            // silent
        }
    }

    async importTraining() {
        if (!this._checkDesktop()) return;
        try {
            const data = await window.electronAPI.nlp.importTraining();
            if (data && data.intents) {
                this._intents = data.intents.map((i) => i.label);
            }
        } catch (e) {
            // silent
        }
    }

    async resetAll() {
        if (!this._checkDesktop()) return;
        this._intents = [];
        this._lastIntent = null;
        this._lastIntentConfidence = 0;
        this._pulseActive = false;
        this._pulseIntent = "";
        try {
            await window.electronAPI.nlp.resetAll();
        } catch (e) {
            // silent
        }
    }

    async removeIntent(args) {
        if (!this._checkDesktop()) return;
        const label = Cast.toString(args.LABEL);
        this._intents = this._intents.filter((i) => i !== label);
        try {
            await window.electronAPI.nlp.removeIntent(label);
        } catch (e) {
            // silent
        }
    }

    whenIntentDetected(args) {
        const intent = Cast.toString(args.INTENT);
        if (this._pulseActive && this._pulseIntent === intent) {
            this._pulseActive = false;
            return true;
        }
        return false;
    }

    getLastIntent() {
        return this._lastIntent || "";
    }

    getLastConfidence() {
        return this._lastIntentConfidence;
    }

    async uploadCsv() {
        if (!this._checkDesktop()) return;
        try {
            const result = await window.electronAPI.nlp.uploadCsv();
            if (result) {
                this._lastCsvContent = result.content;
                this._lastCsvName = result.fileName;
            }
        } catch (e) {
            // silent
        }
    }

    async downloadCsv(args) {
        if (!this._checkDesktop()) return;
        const data = Cast.toString(args.DATA);
        try {
            await window.electronAPI.nlp.downloadCsv(data);
        } catch (e) {
            // silent
        }
    }

    getCsvContent() {
        return this._lastCsvContent;
    }

    getCsvName() {
        return this._lastCsvName;
    }

    csvTemplate() {
        return CSV_TEMPLATE;
    }

    async downloadCsvTemplate() {
        if (!this._checkDesktop()) return;
        try {
            await window.electronAPI.nlp.downloadCsvTemplate();
        } catch (e) {
            // silent
        }
    }

    trainingTemplate() {
        const lines = SAMPLE_INTENTS.map(
            (i) => i.label + ":" + i.examples.join(","),
        );
        return lines.join("\n");
    }

    async trainFromCsv() {
        if (!this._checkDesktop()) return;
        if (!this._lastCsvContent) return;

        const lines = this._lastCsvContent
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
        if (lines.length < 2) return;

        const header = lines[0].toLowerCase();
        const cols = header.split(",").map((c) => c.trim());
        const labelIdx = cols.indexOf("label");
        if (labelIdx === -1) return;

        // Group by label: first data column after "label" is the example text
        const groups = {};
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(",").map((p) => p.trim());
            const label = parts[labelIdx];
            const text = parts.filter((_, j) => j !== labelIdx).join(" ");
            if (label && text) {
                if (!groups[label]) groups[label] = [];
                groups[label].push(text);
            }
        }

        this._pulseActive = false;
        this._pulseIntent = "";
        this._lastIntent = null;
        this._lastIntentConfidence = 0;
        this._intents = [];

        for (const [label, examples] of Object.entries(groups)) {
            this._intents.push(label);
            try {
                await window.electronAPI.nlp.train(label, examples);
            } catch (e) {
                // silent
            }
        }
    }

    async loadSampleIntents() {
        if (!this._checkDesktop()) return;
        this._pulseActive = false;
        this._pulseIntent = "";
        this._lastIntent = null;
        this._lastIntentConfidence = 0;
        this._intents = [];
        for (const intent of SAMPLE_INTENTS) {
            this._intents.push(intent.label);
            try {
                await window.electronAPI.nlp.train(
                    intent.label,
                    intent.examples,
                );
            } catch (e) {
                // silent
            }
        }
    }
}

module.exports = Scratch3NLPBlocks;
