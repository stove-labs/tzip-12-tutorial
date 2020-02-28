const tzip_12_tutorial = artifacts.require('tzip_12_tutorial');
const balance_requester = artifacts.require('balance_requester');

const { initial_storage } = require('../migrations/1_deploy_tzip_12_tutorial.js');
const bigMapKeyNotFound = require('./../helpers/bigMapKeyNotFound.js');
const constants = require('./../helpers/constants.js');
/**
 * For testing on a babylonnet (testnet), instead of the sandbox network,
 * make sure to replace the keys for alice/bob accordingly.
 */
const { alice, bob } = require('./../scripts/sandbox/accounts');

contract('tzip_12_tutorial', accounts => {
    let storage;
    let tzip_12_tutorial_instance;
    let balance_requester_instance;

    before(async () => {
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
                 * token_id: 0 represents the single token_id within our contract
                 */
                token_id: 0,
                amount: 1,
                from_: alice.pkh,
                to_: bob.pkh
            }
        ];
        
        /**
         * Call the `transfer` entrypoint
         */
        await tzip_12_tutorial_instance.transfer(transferParam);
        /**
         * Bob's token balance should now be 1
         */
        const deployedBalanceBob = await storage.get(bob.pkh);
        const expectedBalanceBob = 1;
        assert.equal(deployedBalanceBob, expectedBalanceBob);
    });

    it(`should not allow transfers from_ an address that did not sign the transaction`, async () => {
        const transferParam = [
            {   
                token_id: 0,
                amount: 1,
                from_: bob.pkh,
                to_: alice.pkh
            }
        ];

        try {
            /**
             * Transactions in the test suite are signed by a secret/private key
             * configured in truffle-config.js
             */
            await tzip_12_tutorial_instance.transfer(transferParam);
        } catch (e) {
            assert.equal(e.message, constants.contractErrors.fromEqualToSenderAddress)
        }
    });

    it(`should not transfer tokens from Alice to Bob when Alice's balance is insufficient`, async () => {
        const transferParam = [
            {   
                token_id: 0,
                // Alice's balance at this point is 9
                amount: 100,
                from_: alice.pkh,
                to_: bob.pkh
            }
        ];

        try {
            await tzip_12_tutorial_instance.transfer(transferParam);
        } catch (e) {
            assert.equal(e.message, constants.contractErrors.insufficientBalance)
        }
    });

    it('should return the balance of alice trough the balance interface', async () => {
        const balanceRequests =  [
            {
                owner: alice.pkh,
                token_id: 0
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
