const path = require("path");

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// shared/ lives outside this project root and holds the pace/distance maths
// used by both the Next.js app and this one.
config.watchFolders = [path.resolve(__dirname, "..", "shared")];

module.exports = config;
