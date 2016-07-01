"use strict";

let target = process.env.FORGE_TARGET || "localhost";

module.exports = require(`./config.${target}.json`);
