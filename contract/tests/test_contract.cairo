use contract::interface::{
    IProofOfLifeDispatcher, IProofOfLifeDispatcherTrait, IProofOfLifeSafeDispatcher,
    IProofOfLifeSafeDispatcherTrait,
};
use contract::types::Heir;
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_block_timestamp,
    start_cheat_caller_address, stop_cheat_block_timestamp,
};
use starknet::ContractAddress;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

#[test]
fn test_heartbeat_updates_timestamp() {
    let contract_address = deploy_contract("ProofOfLife");
    let dispatcher = IProofOfLifeDispatcher { contract_address };

    // Use a specific, non-zero address for the caller
    let caller = starknet::contract_address_const::<0x1337>();
    let mock_time: u64 = 1767225600;

    // 1. Force the caller to be our specific address
    snforge_std::start_cheat_caller_address(contract_address, caller);

    // 2. Force the block time
    snforge_std::start_cheat_block_timestamp(contract_address, mock_time);

    // 3. Perform the heartbeat
    dispatcher.heartbeat();

    // 4. Check the pulse for the SAME caller address
    let last_pulse = dispatcher.get_last_pulse(caller);

    assert(last_pulse == mock_time, 'Timestamp mismatch');

    // Clean up cheats
    snforge_std::stop_cheat_caller_address(contract_address);
    snforge_std::stop_cheat_block_timestamp(contract_address);
}

#[test]
#[feature("safe_dispatcher")]
fn test_heir_cannot_claim_early() {
    let contract_address = deploy_contract("ProofOfLife");
    let dispatcher = IProofOfLifeDispatcher { contract_address };
    let safe_dispatcher = IProofOfLifeSafeDispatcher { contract_address };

    let owner = starknet::get_caller_address();
    let heir_addr = starknet::contract_address_const::<0x123>();

    // 1. Setup
    let mut heirs = ArrayTrait::new();
    heirs.append(Heir { address: heir_addr, percentage: 10000 });

    // Ensure we are the owner when calling setup
    start_cheat_caller_address(contract_address, owner);
    dispatcher.setup_switch(2592000, heirs);

    // 2. Set pulse at T=100
    start_cheat_block_timestamp(contract_address, 100);
    dispatcher.heartbeat();

    // 3. Try to claim at T=200
    start_cheat_block_timestamp(contract_address, 200);

    match safe_dispatcher.claim_inheritance(owner) {
        Result::Ok(_) => core::panic_with_felt252('Should have panicked'),
        Result::Err(panic_data) => {
            // Updated assertion to ensure we grab the felt correctly
            let actual_panic_msg = *panic_data.at(0);
            assert(actual_panic_msg == 'Owner is still active', 'Wrong panic message');
        },
    };
}
