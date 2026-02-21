use contract::types::{AssetConfig, Heir};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IProofOfLife<TContractState> {
    // --- The Plugin Hook ---
    // This allows a modular account to "pulse" automatically during transaction execution.
    fn on_execute(ref self: TContractState, account: ContractAddress);

    // --- Core Actions ---
    fn heartbeat(ref self: TContractState);

    // Moves assets from user's wallet into the contract's secure vault.
    fn deposit(ref self: TContractState, token: ContractAddress, amount: u256);

    // Triggered by heirs after the inactivity threshold is met.
    fn claim_inheritance(ref self: TContractState, owner: ContractAddress);

    // --- Setup & Configuration ---
    // threshold: inactivity time in seconds (e.g., 15552000 for 6 months).
    fn setup_switch(ref self: TContractState, threshold: u64, heirs: Array<Heir>);

    // Adds a specific token to the list of assets to be monitored or distributed.
    fn register_asset(ref self: TContractState, asset: AssetConfig);

    // --- Getters ---
    fn get_last_pulse(self: @TContractState, user: ContractAddress) -> u64;
    fn is_dead(self: @TContractState, user: ContractAddress) -> bool;
    fn withdraw(ref self: TContractState, token: ContractAddress, amount: u256);
    fn emergency_withdraw_all(ref self: TContractState, token: ContractAddress);
}
