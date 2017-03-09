'use strict';

const criticalcss = require('criticalcss');
const request = require('request');
const path = require('path');
const fs = require('fs');

class CriticalCSS {
    constructor(config) {
        this.options = config && config.plugins && config.plugins.criticalcss || {};
    }

    getRules(file) {
        const filename = config.filename;
        const buffer = config.buffer;
        const url = config.url;
        const outputfile = config.outputfile;
        const restoreFontFaces = config.restoreFontFaces;
        
        criticalcss.getRules( filename, { buffer: buffer }, function( err, content ){
            if( err ){
                throw new Error( err.message );
            }

            options.rules = JSON.parse( content );

            criticalcss.findCritical( url, this.options, function(err, content){
                if( err ){
                    throw new Error( err.message );
                }

                const originalCSS = fs.readFileSync(filename).toString();
                content = criticalcss.restoreOriginalDefs(originalCSS, content);

                // NOTE This should follow the original declarations restoration above
                // so that if a `font-family` declaration was restored from the original
                // CSS the corresponding `@font-face` will be included.
                if( restoreFontFaces ){
                    content = criticalcss.restoreFontFaces(originalCSS, content);
                }

                return Promise.resolve( content );
            });

        });


    }
}

CriticalCSS.prototype.brunchPlugin = true;
CriticalCSS.prototype.type = 'stylesheet';
CriticalCSS.prototype.extension = 'css';

module.exports = CriticalCSS;
