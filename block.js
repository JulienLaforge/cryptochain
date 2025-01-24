const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    static genesis() {     
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }) {
        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            hash: cryptoHash(data),
            data
        });
    }
}

module.exports = Block;