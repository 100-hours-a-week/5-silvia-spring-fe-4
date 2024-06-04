const path = require('path');

module.exports = function override(config, env) {
    config.resolve.alias['react-toastify'] = path.resolve(__dirname, 'node_modules/react-toastify/dist/react-toastify.esm.mjs');
    return config;
};
