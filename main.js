/*
 * Copyright (c) 2014 MKLab. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

const codeGenerator = require('./code-generator')

function getGenOptions() {
    return {
        csharpDoc: app.preferences.get('csharp.gen.csharpDoc'),
        useTab: app.preferences.get('csharp.gen.useTab'),
        indentSpaces: app.preferences.get('csharp.gen.indentSpaces'),
        propertiesByDefault: app.preferences.get('csharp.gen.propertiesByDefault'),
        useCrLf: app.preferences.get('csharp.gen.useCrLf'),
        unorderedCollectionType: app.preferences.get('csharp.gen.unorderedCollectionType'),
        orderedCollectionType: app.preferences.get('csharp.gen.orderedCollectionType'),
        generateBackingField: app.preferences.get('csharp.gen.generateBackingField'),
        backingFieldPrefix: app.preferences.get('csharp.gen.backingFieldPrefix')
    };
}

/**
 * Command Handler for C# Generate
 *
 * @param {Element} base
 * @param {string} path
 * @param {Object} options
 */
function _handleGenerate(base, path, options) {
    // If options is not passed, get from preference
    options = options || getGenOptions();

    let choosePathAndGenerate = function(base, path, options) {
        // If path is not assigned, popup Open Dialog to select a folder
        if (!path) {
            var files = app.dialogs.showOpenDialog('Select a folder where generated codes to be located', null, null, { properties: ['openDirectory'] });
            if (files && files.length > 0) {
                path = files[0];
                codeGenerator.generate(base, path, options);
            }
        } else {
            codeGenerator.generate(base, path, options);
        }
    };

    // If base is not assigned, popup ElementPicker
    if (!base) {
        app.elementPickerDialog.showDialog('Select a base model to generate code for', null, type.UMLPackage)
            .then(function ({ buttonId, returnValue }) {
                if (buttonId === 'ok' && returnValue) {
                    base = returnValue;
                    choosePathAndGenerate(base, path, options);
                }
            });
    } else {
        choosePathAndGenerate(base, path, options);
    }
}

function _handleConfigure() {
    app.commands.execute('application:preferences', 'csharp');
}

function init () {
    app.commands.register('csharp:generate', _handleGenerate, 'C#: Generate Code...');
    app.commands.register('csharp:configure', _handleConfigure, 'C#: Configure...');
}
  
exports.init = init
