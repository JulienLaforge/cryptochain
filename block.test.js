const Block = require("./block");
const { GENESIS_DATA } = require("./config");

describe('Block', () => {
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'foo-bar';
    const data = ['blockchain', 'data'];
    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data
    });

    it('has a timestamp property', () => {
        expect(block.timestamp).toEqual(timestamp);
    });

    it('has a lastHash property', () => {
        expect(block.lastHash).toEqual(lastHash);
    });

    it('has a hash property', () => {
        expect(block.hash).toEqual(hash);
    });

    it('has a data property', () => {
        expect(block.data).toEqual(data);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        it('returns a block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const mineBlock = Block.mineBlock({lastBlock, data});

        it('returns a block instance', () => {
            expect(mineBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(mineBlock.lastHash).toBe(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(mineBlock.data).toEqual(data);
        });

        it('set a `timestamp`', () => {
            expect(mineBlock.timestamp).not.toEqual(undefined);
        });

        it('set a `hash`', () => {
            expect(mineBlock.hash).not.toEqual(undefined);
        });
    });
});