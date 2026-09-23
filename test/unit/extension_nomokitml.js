const test = require('tap').test;
const EventEmitter = require('events');
const NomokitMl = require('../../src/extensions/nomokitml');

/**
 * A stand-in for the inference client the GUI publishes on runtime.nomokitMlInference. The real
 * one talks to a hidden nomokit-ml iframe over a MessagePort; everything the extension needs from
 * it is the promise contract, which never rejects and always reports {ok}.
 * @param {object} overrides methods to replace on the default fake
 * @returns {object} an inference client stub
 */
const fakeClient = (overrides = {}) => Object.assign({
    isReady: () => true,
    ping: () => Promise.resolve({ok: true, result: {}}),
    loadModel: () => Promise.resolve({ok: true,
        result: {
            sessionId: 's1',
            name: 'Hands',
            modality: 'image',
            labels: [{classId: 'c-a', name: 'rock'}, {classId: 'c-b', name: 'paper'}]
        }}),
    unloadModel: () => Promise.resolve({ok: true, result: {}}),
    listModels: () => Promise.resolve({ok: true, result: {models: []}}),
    classify: () => Promise.resolve({ok: true, result: {predictions: []}}),
    audioStart: () => Promise.resolve({ok: true, result: {}}),
    audioStop: () => Promise.resolve({ok: true, result: {}}),
    setActive: () => {},
    onPush: () => () => {},
    onEvent: () => () => {}
}, overrides);

const fakeRuntime = (client, frame) => {
    const runtime = new EventEmitter();
    runtime.nomokitMlInference = client || null;
    runtime.requestToolboxExtensionsUpdate = () => {
        runtime.toolboxUpdates = (runtime.toolboxUpdates || 0) + 1;
    };
    runtime.getFrameCalls = [];
    runtime.videoEnabled = false;
    runtime.ioDevices = {
        video: {
            getFrame: opts => {
                runtime.getFrameCalls.push(opts);
                // Mirrors the real ioDevices.video: with no provider (camera never enabled) there
                // is no frame at all, which is what made classification silently do nothing.
                if (!runtime.videoEnabled) return null;
                return typeof frame === 'undefined' ?
                    {data: new Uint8Array(4), width: 1, height: 1} :
                    frame;
            },
            enableVideo: () => {
                runtime.videoEnabled = true;
            },
            disableVideo: () => {
                runtime.videoEnabled = false;
                runtime.videoDisabled = true;
            },
            setPreviewGhost: () => {},
            mirror: true
        }
    };
    return runtime;
};

test('menus never return an empty array', t => {
    // extension-manager's _getExtensionMenuItems throws "Extension menu returned no items" on an
    // empty array, which would break the toolbox before any model is loaded.
    const ext = new NomokitMl(fakeRuntime(fakeClient()));

    t.ok(ext.getLabelsMenu().length > 0, 'received_menu');
    t.ok(ext.getLabelsWithAnyWithoutOfMenu().length > 0, 'labels_menu');
    t.ok(ext.getLabelsWithoutAnyMenu().length > 0, 'labels_without_any_menu');
    t.ok(ext.getModelMenu().length > 0, 'model_menu');
    t.ok(ext.getVideoMenu().length > 0, 'video_menu');
    t.ok(ext.getClassificationMenu().length > 0, 'classification_menu');
    t.ok(ext.getClassificationIntervalMenu().length > 0, 'classification_interval_menu');
    t.end();
});

test('label menus follow trainedClassIds order once a model loads', t => {
    const runtime = fakeRuntime(fakeClient());
    const ext = new NomokitMl(runtime);

    ext.setModelFromURL({URL: 'https://example.test/model.zip'}).then(() => {
        t.same(ext.getLabelsMenu(), ['any', 'rock', 'paper'], 'order preserved, placeholder first');
        t.same(ext.getLabelsWithoutAnyMenu(), ['-', 'rock', 'paper'], 'visible placeholder, then labels');
        t.equal(ext.getModelName(), 'Hands');
        t.equal(runtime.toolboxUpdates, 1, 'toolbox refreshed exactly once per load');
        t.end();
    });
});

test('is a silent no-op with no inference client', t => {
    const ext = new NomokitMl(fakeRuntime(null));

    t.same(ext.getLabelsMenu(), ['any'], 'menu still non-empty');
    t.equal(ext.getLabel(), '', 'no label');
    t.equal(ext.labelConfidence({LABEL: 'rock'}), 0, 'no confidence');
    t.equal(ext.getModelName(), '');
    t.doesNotThrow(() => ext.toggleClassification({CLASSIFICATION_STATE: 'on'}));
    t.doesNotThrow(() => ext.classifyNow({}, {yield: () => {}}));
    return ext.setModelFromURL({URL: 'https://example.test/m.zip'}).then(() => {
        t.equal(ext.getModelName(), '', 'still no model');
        t.end();
    });
});

test('requests unmirrored frames at the backbone\'s own input size', t => {
    // The trainer embeds the raw <video> element, which is NOT mirrored, while the stage preview
    // is. Sending mirrored pixels would flip the world relative to training and make every
    // left/right-asymmetric model answer with the opposite class.
    const runtime = fakeRuntime(fakeClient());
    const ext = new NomokitMl(runtime);

    ext.setModelFromURL({URL: 'https://example.test/m.zip'}).then(() => ext.classifyNow({}, null))
        .then(() => {
            t.equal(runtime.getFrameCalls.length, 1, 'grabbed one frame');
            t.equal(runtime.getFrameCalls[0].mirror, false, 'unmirrored');
            t.same(runtime.getFrameCalls[0].dimensions, [224, 224], 'mobilenet input size');
            t.end();
        });
});

test('turns the camera on when classification starts', t => {
    // ioDevices.video has no provider until something enables it, and getFrame() then returns
    // null -- so without this the pump runs but never produces a single label.
    const runtime = fakeRuntime(fakeClient());
    const ext = new NomokitMl(runtime);

    t.notOk(runtime.videoEnabled, 'camera stays off just from adding the extension');
    ext.toggleClassification({CLASSIFICATION_STATE: 'on'});
    t.ok(runtime.videoEnabled, 'camera on once classification is requested');
    ext._stopPump();
    t.end();
});

test('classifying the stage reads the renderer, not the camera', t => {
    const runtime = fakeRuntime(fakeClient());
    // Stand in for the stage canvas that runtime.renderer exposes.
    const drawn = [];
    runtime.renderer = {
        canvas: {
            width: 480,
            height: 360,
            getContext: () => ({})
        }
    };
    global.document = {
        createElement: () => ({
            width: 0,
            height: 0,
            getContext: () => ({
                drawImage: (...args) => drawn.push(args.length),
                getImageData: (x, y, w, h) => ({data: new Uint8Array(w * h * 4), width: w, height: h})
            })
        }),
        querySelector: () => null
    };

    const ext = new NomokitMl(runtime);
    ext.setInput({INPUT: 'stage'});
    t.notOk(runtime.videoEnabled, 'stage input does not switch the camera on');
    t.ok(runtime.videoDisabled, 'and turns it off so it stops covering the stage');

    ext.setModelFromURL({URL: 'https://example.test/m.zip'}).then(() => ext.classifyNow({}, null))
        .then(() => {
            t.equal(runtime.getFrameCalls.length, 0, 'never asked the camera for a frame');
            t.ok(drawn.length > 0, 'drew the stage into the capture canvas');
            delete global.document;
            t.end();
        });
});

test('classifyNow yields instead of queueing when a classification is in flight', t => {
    let resolveClassify = null;
    const client = fakeClient({
        classify: () => new Promise(resolve => {
            resolveClassify = resolve;
        })
    });
    const ext = new NomokitMl(fakeRuntime(client));

    ext.setModelFromURL({URL: 'https://example.test/m.zip'}).then(() => {
        ext.classifyNow({}, null); // starts, never settles until we say so

        let yielded = false;
        ext.classifyNow({}, {yield: () => {
            yielded = true;
        }});
        t.ok(yielded, 'second call yielded the thread rather than stacking a request');

        resolveClassify({ok: true, result: {predictions: []}});
        t.end();
    });
});

test('threshold gates the reported label', t => {
    const client = fakeClient({
        classify: () => Promise.resolve({ok: true,
            result: {predictions: [
                {classId: 'c-a', name: 'rock', confidence: 0.6},
                {classId: 'c-b', name: 'paper', confidence: 0.4}
            ]}})
    });
    const ext = new NomokitMl(fakeRuntime(client));

    ext.setModelFromURL({URL: 'https://example.test/m.zip'}).then(() => ext.classifyNow({}, null))
        .then(() => {
            ext.setConfidenceThreshold({CONFIDENCE_THRESHOLD: 0.5});
            t.equal(ext.getLabel(), 'rock', 'above threshold');
            t.equal(ext.labelConfidence({LABEL: 'paper'}), 0.4, 'confidence reported regardless');
            t.ok(ext.isLabelDetected({LABEL: 'rock'}), 'detected');
            t.ok(ext.whenLabelReceived({LABEL: 'any'}), 'hat fires for any');

            ext.setConfidenceThreshold({CONFIDENCE_THRESHOLD: 0.95});
            t.equal(ext.getLabel(), '', 'suppressed below threshold');
            t.notOk(ext.isLabelDetected({LABEL: 'rock'}));
            t.end();
        });
});

test('confidence threshold is clamped to 0..1', t => {
    const ext = new NomokitMl(fakeRuntime(fakeClient()));
    ext.setConfidenceThreshold({CONFIDENCE_THRESHOLD: 5});
    t.equal(ext.getConfidenceThreshold(), 1);
    ext.setConfidenceThreshold({CONFIDENCE_THRESHOLD: -3});
    t.equal(ext.getConfidenceThreshold(), 0);
    t.end();
});

test('results decay so hats stop firing after classification stops', t => {
    const client = fakeClient({
        classify: () => Promise.resolve({ok: true,
            result: {predictions: [
                {classId: 'c-a', name: 'rock', confidence: 0.99}
            ]}})
    });
    const ext = new NomokitMl(fakeRuntime(client));

    ext.setModelFromURL({URL: 'https://example.test/m.zip'}).then(() => ext.classifyNow({}, null))
        .then(() => {
            t.equal(ext.getLabel(), 'rock', 'fresh result is reported');
            // Pretend the last result is older than the decay window (2x interval).
            ext._lastResultAt = Date.now() - (5 * ext.interval);
            t.equal(ext.getLabel(), '', 'stale result is not reported');
            t.notOk(ext.whenLabelReceived({LABEL: 'any'}), 'hat no longer fires');
            t.end();
        });
});

test('PROJECT_STOP_ALL stops the frame pump', t => {
    const runtime = fakeRuntime(fakeClient());
    const ext = new NomokitMl(runtime);

    ext.setModelFromURL({URL: 'https://example.test/m.zip'}).then(() => {
        ext.toggleClassification({CLASSIFICATION_STATE: 'on'});
        t.ok(ext._running, 'pump running');

        // Leaving the camera live after the red stop button is a privacy problem, not just a
        // wasted timer.
        runtime.emit('PROJECT_STOP_ALL');
        t.notOk(ext._running, 'pump stopped');
        t.end();
    });
});

test('a failed load leaves the previous model in place and does not throw', t => {
    let fail = false;
    const client = fakeClient({
        loadModel: () => {
            if (fail) {
                return Promise.resolve({ok: false, error: {code: 'fetch-failed', message: 'nope'}});
            }
            return Promise.resolve({ok: true,
                result: {
                    sessionId: 's1',
                    name: 'Hands',
                    modality: 'image',
                    labels: [{classId: 'c-a', name: 'rock'}]
                }});
        }
    });
    const ext = new NomokitMl(fakeRuntime(client));

    ext.setModelFromURL({URL: 'https://example.test/ok.zip'}).then(() => {
        t.equal(ext.getModelName(), 'Hands');
        fail = true;
        return ext.setModelFromURL({URL: 'https://example.test/bad.zip'});
    })
        .then(() => {
            t.equal(ext.getModelName(), 'Hands', 'previous model survived the failure');
            t.same(ext.getLabelsMenu(), ['any', 'rock']);
            t.end();
        });
});

test('exposes EXTENSION_ID so it registers as an extension, not a device', t => {
    // extension-manager's _registerInternalExtension reads EXTENSION_ID to build the dispatch
    // service name. Without it the name becomes `device_<n>_undefined`, getIdFromServiceName then
    // reports a deviceId, _prepareExtensionInfo prefixes the category id with the current device
    // type, and the blocks never appear in the toolbox. That is how this shipped broken once.
    const ext = new NomokitMl(fakeRuntime(fakeClient()));
    t.equal(ext.EXTENSION_ID, 'nomokitml', 'id present');
    t.equal(ext.EXTENSION_ID, ext.getInfo()[0].id, 'matches the category id');
    t.end();
});

test('no argument uses an empty-string default', t => {
    // runtime.js's _convertForScratchBlocks writes the shadow's <field> only `if (defaultValue &&
    // fieldName)`. An empty string is falsy, so the field is omitted: a text input then renders as
    // the literal "undefined" and a dropdown renders blank. Both shipped that way once.
    const ext = new NomokitMl(fakeRuntime(fakeClient()));
    const bad = [];
    for (const block of ext.getInfo()[0].blocks) {
        if (block === '---' || !block.arguments) continue;
        for (const [name, arg] of Object.entries(block.arguments)) {
            if (arg.defaultValue === '' || typeof arg.defaultValue === 'undefined') {
                bad.push(`${block.opcode}.${name}`);
            }
        }
    }
    t.same(bad, [], 'every argument has a truthy defaultValue');
    t.end();
});

test('the model menu placeholder is selectable and ignored when run', t => {
    const client = fakeClient({
        loadModel: () => {
            t.fail('placeholder must not trigger a model load');
            return Promise.resolve({ok: false, error: {}});
        }
    });
    const ext = new NomokitMl(fakeRuntime(client));
    const placeholder = ext.getModelMenu()[0];

    t.ok(placeholder.value, 'placeholder has a non-empty value so it renders');
    t.doesNotThrow(() => ext.setModel({MODEL: placeholder.value}));
    t.end();
});

test('getInfo exposes dynamic menus by method name', t => {
    const ext = new NomokitMl(fakeRuntime(fakeClient()));
    const infoArray = ext.getInfo();
    t.ok(Array.isArray(infoArray), 'returns an array of categories, like the other ML extensions');
    const info = infoArray[0];

    t.equal(info.id, 'nomokitml');
    t.ok(info.blockIconURI && info.blockIconURI.startsWith('data:image/'), 'has a real block icon');
    // A string here tells extension-manager to re-invoke the named method each time the dropdown
    // opens, which is how the label menus track the loaded model.
    t.equal(info.menus.received_menu.items, 'getLabelsMenu');
    t.equal(info.menus.model_menu.items, 'getModelMenu');
    t.ok(info.blocks.some(b => b.opcode === 'whenLabelReceived'));
    t.ok(info.blocks.some(b => b.opcode === 'setModelFromURL'));
    t.end();
});
