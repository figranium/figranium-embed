const upstream = require('./.figranium-source/tailwind.config.js');

module.exports = {
  ...upstream,
  content: [
    './iframe.internal.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './.figranium-source/src/**/*.{js,ts,jsx,tsx}',
  ],
};
