const tzip_12_tutorial = artifacts.require('tzip_12_tutorial');
const balance_requester = artifacts.require('balance_requester');

const { initial_storage } = require('../migrations/1_deploy_tzip_12_tutorial.js');
const bigMapKeyNotFound = require('./../helpers/bigMapKeyNotFound.js');
const { unit } = require('./../helpers/constants');
/**
 * For testing on a babylonnet (testnet), instead of the sandbox network,
 * make sure to replace the keys for alice/bob accordingly.
 */
const { alice, bob } = require('./../scripts/sandbox/accounts');

contract('tzip_12_tutorial', accounts => {
    let storage;
    let tzip_12_tutorial_instance;
    let balance_requester_tutorial_instance;

    beforeEach(async () => {
        tzip_12_tutorial_instance = await tzip_12_tutorial.deployed();
        balance_requester_instance = await balance_requester.deployed();
        /**
         * Display the current contract address for debugging purposes
         */
        console.log('Token contract deployed at:', tzip_12_tutorial_instance.address);
        console.log('Balance requester contract deployed at:', balance_requester_instance.address);

        storage = await tzip_12_tutorial_instance.storage();
    });

    const expectedBalanceAlice = initial_storage[alice.pkh];
    it(`should store a balance of ${expectedBalanceAlice} for Alice`, async () => {
        /**
         * Get balance for Alice from the smart contract's storage (by a big map key)
         */
        const deployedBalanceAlice = await storage.get(alice.pkh);
        assert.equal(expectedBalanceAlice, deployedBalanceAlice);
    });

    it(`should not store any balance for Bob`, async () => {
        let fetchBalanceError;

        try {
            /**
             * If a big map key does not exist in the storage, the RPC returns a 404 HttpResponseError
             */
            await storage.get(bob.pkh);
        } catch (e) {
            fetchBalanceError = e;
        }

        assert(bigMapKeyNotFound(fetchBalanceError))
    });

    it('should transfer 1 token from Alice to Bob', async () => {
        const transferParam = [
            {   
                /**
                 * { 'single': unit } is a representation of our parameter variant `token_id`
                 */
                token_id: { 'single': unit },
                amount: 1,
                from_: alice.pkh,
                to_: bob.pkh
            }
        ];
        await tzip_12_tutorial_instance.transfer(transferParam);
        const deployedBalanceBob = await storage.get(bob.pkh);
        const expectedBalanceBob = 1;
        assert.equal(deployedBalanceBob, expectedBalanceBob);
    });

    it('should return the balance of alice trough the balance_of interface', async () => {
        const balanceRequests =  [
            {
                owner: alice.pkh,
                token_id: { 'single': unit }
            }
        ];
        const at = tzip_12_tutorial_instance.address;

        await balance_requester_instance.request_balance(
            at,
            balanceRequests
        );

        const balance_requesterStorage = await balance_requester_instance.storage();
        const deployedBalanceAlice = await storage.get(alice.pkh);
        const balanceResponse = balance_requesterStorage[0];
        assert(balanceResponse.balance.isEqualTo(deployedBalanceAlice));
    });
});