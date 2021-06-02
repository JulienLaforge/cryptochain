const { GENESIS_DATA, MINE_RATE } = require("../config");
const { cryptoHash } = require("../util");
const hexToBinary = require("hex-to-binary");

class Block {
    constructor({ timestamp, previousHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new this(GENESIS_DATA);
    }

    static mineBlock({previousBlock, data}) {
        const previousHash = previousBlock.hash;
        let hash, timestamp;
        let { difficulty } = previousBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({
                originalBlock: previousBlock,
                timestamp
            });
            hash = cryptoHash(timestamp, previousHash, data, nonce, difficulty)
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp,
            previousHash,
            data,
            difficulty,
            nonce,
            hash,
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if ( difficulty < 1 ) return 1;
        if ( timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    }
}

module.exports = Block;