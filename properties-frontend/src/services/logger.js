'use strict';

const util = require('util');

function logger() {

    function loggFunc(lvl) {
        return function (msg, ...args) {

            console.log(util.format("[%s] %s", lvl, util.format(msg, args)))
        }
    }

    return {
        info: loggFunc("info"),
        debug: loggFunc("debug"),
        error: loggFunc("error"),
        warn: loggFunc("warn"),
    }
}

module.exports = logger();



