const balance_requester = artifacts.require('balance_requester');

const initial_storage = [];

module.exports = async (deployer, network, accounts) => {
    await deployer.deploy(balance_requester, initial_storage);
};

module.exports.initial_storage = initial_storage;