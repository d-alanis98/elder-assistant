const { randomBytes } = require('crypto');

const keyGenerator = numberOfBytes => randomBytes(numberOfBytes).toString('hex');

module.exports = {
    keyGenerator
};