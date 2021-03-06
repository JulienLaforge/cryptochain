const Block = require('./block');
const { cryptoHash } = require("../util");
const { GENESIS_DATA, MINE_RATE } = require('../config');
const hexToBinary = require('hex-to-binary');

describe('Block', () => {
    const timestamp = 2000;
    const previousHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({
        timestamp,
        hash,
        previousHash,
        data,
        nonce,
        difficulty,
    });

    it('has a timestamp property', () => {
        expect(block.timestamp).toEqual(timestamp);
    });

    it('has a previousHash property', () => {
        expect(block.previousHash).toEqual(previousHash);
    });
    
    it('has a hash property', () => {
        expect(block.hash).toEqual(hash);
    });
    
    it('has a data property', () => {
        expect(block.data).toEqual(data);
    });

    it('has a data property', () => {
        expect(block.nonce).toEqual(nonce);
    });

    it('has a difficulty property', () => {
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        it('return a block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const previousBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({previousBlock, data});

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `previousHash` to be the `hash` of the previousBlock', () => {
            expect(minedBlock.previousHash).toEqual(previousBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets the `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual(cryptoHash(
                    minedBlock.timestamp,
                    minedBlock.nonce,
                    minedBlock.difficulty,
                    previousBlock.hash,
                    data
                )
            );
        });

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [ previousBlock.difficulty + 1, previousBlock.difficulty - 1 ];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });

    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        });

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1);
        });

        it('has a lower limit of 1', () => {
            block.difficulty = -1;
            expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
        });
    });
});