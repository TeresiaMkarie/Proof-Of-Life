use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Heir {
    pub address: ContractAddress,
    pub percentage: u16 // Basis points: 5000 = 50%
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct AssetConfig {
    pub token_address: ContractAddress,
    pub is_vault: bool // True = Vaulted, False = Allowance
}
