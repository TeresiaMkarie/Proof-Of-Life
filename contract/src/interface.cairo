use starknet::ContractAddress;
use super::types::{AssetConfig, Heir};

#[starknet::interface]
pub trait IProofOfLife<TContractState> {
    // Core Actions
    fn heartbeat(ref self: TContractState);
    fn claim_inheritance(ref self: TContractState, owner: ContractAddress);

    // Setup
    fn setup_switch(ref self: TContractState, threshold: u64, heirs: Array<Heir>);
    fn register_asset(ref self: TContractState, asset: AssetConfig);

    // Getters
    fn get_last_pulse(self: @TContractState, user: ContractAddress) -> u64;
    fn is_dead(self: @TContractState, user: ContractAddress) -> bool;
}
