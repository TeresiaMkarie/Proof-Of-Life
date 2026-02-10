use starknet::ContractAddress;

// Defining the interface locally to bypass dependency path issues
#[starknet::interface]
trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256,
    ) -> bool;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
}

#[starknet::contract]
mod ProofOfLife {
    use contract::interface::IProofOfLife;
    use contract::types::{AssetConfig, Heir};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};

    // Use the locally defined dispatcher
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[storage]
    struct Storage {
        last_pulse: Map<ContractAddress, u64>,
        inactivity_threshold: Map<ContractAddress, u64>,
        heirs_count: Map<ContractAddress, u32>,
        heirs: Map<(ContractAddress, u32), Heir>,
        vault_balances: Map<(ContractAddress, ContractAddress), u256>,
    }

    #[abi(embed_v0)]
    impl ProofOfLifeImpl of IProofOfLife<ContractState> {
        fn heartbeat(ref self: ContractState) {
            let caller = get_caller_address();
            self.last_pulse.write(caller, get_block_timestamp());
        }

        fn setup_switch(ref self: ContractState, threshold: u64, heirs: Array<Heir>) {
            let owner = get_caller_address();
            self.inactivity_threshold.write(owner, threshold);

            let mut i: u32 = 0;
            let len = heirs.len();
            self.heirs_count.write(owner, len);

            while i < len {
                self.heirs.write((owner, i), *heirs.at(i));
                i += 1;
            }

            self.last_pulse.write(owner, get_block_timestamp());
        }

        fn claim_inheritance(ref self: ContractState, owner: ContractAddress) {
            let current_time = get_block_timestamp();
            let last_pulse = self.last_pulse.read(owner);
            let threshold = self.inactivity_threshold.read(owner);

            assert(last_pulse != 0, 'Switch not initialized');
            assert(current_time > last_pulse + threshold, 'Owner is still active');

            let count = self.heirs_count.read(owner);

            // Standard ETH address
            let eth_address: ContractAddress =
                0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
                .try_into()
                .unwrap();

            let vault_bal = self.vault_balances.read((owner, eth_address));
            if vault_bal > 0 {
                self._distribute_vault(owner, eth_address, vault_bal, count);
            }

            let token = IERC20Dispatcher { contract_address: eth_address };
            let allowance_bal = token.allowance(owner, starknet::get_contract_address());
            if allowance_bal > 0 {
                self._distribute_allowance(owner, eth_address, allowance_bal, count);
            }
        }

        fn get_last_pulse(self: @ContractState, user: ContractAddress) -> u64 {
            self.last_pulse.read(user)
        }

        fn is_dead(self: @ContractState, user: ContractAddress) -> bool {
            let last_pulse = self.last_pulse.read(user);
            let threshold = self.inactivity_threshold.read(user);
            if last_pulse == 0 {
                return false;
            }
            get_block_timestamp() > last_pulse + threshold
        }

        fn register_asset(ref self: ContractState, asset: AssetConfig) {}
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _distribute_vault(
            ref self: ContractState,
            owner: ContractAddress,
            token_addr: ContractAddress,
            amount: u256,
            heir_count: u32,
        ) {
            let token = IERC20Dispatcher { contract_address: token_addr };
            let mut i: u32 = 0;
            while i < heir_count {
                let heir = self.heirs.read((owner, i));
                let share = (amount * heir.percentage.into()) / 10000;
                token.transfer(heir.address, share);
                i += 1;
            }
            self.vault_balances.write((owner, token_addr), 0);
        }

        fn _distribute_allowance(
            ref self: ContractState,
            owner: ContractAddress,
            token_addr: ContractAddress,
            amount: u256,
            heir_count: u32,
        ) {
            let token = IERC20Dispatcher { contract_address: token_addr };
            let mut i: u32 = 0;
            while i < heir_count {
                let heir = self.heirs.read((owner, i));
                let share = (amount * heir.percentage.into()) / 10000;
                token.transfer_from(owner, heir.address, share);
                i += 1;
            };
        }
    }
}
