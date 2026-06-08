#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Captain,
    Resident(Address),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResidentID {
    pub name: String,
    pub birth_date: String,
    pub barangay: String,
    pub is_active: bool,
}

#[contract]
pub struct BarangayIDContract;

#[contractimpl]
impl BarangayIDContract {
    /// Initializes the contract with the Barangay Captain's address.
    pub fn initialize(env: Env, captain: Address) {
        if env.storage().persistent().has(&DataKey::Captain) {
            panic!("Already initialized");
        }
        env.storage().persistent().set(&DataKey::Captain, &captain);
    }

    /// Issues a new digital ID for a resident. Only callable by the Captain.
    pub fn issue_id(env: Env, captain: Address, resident: Address, name: String, birth_date: String, barangay: String) {
        captain.require_auth();
        
        let stored_captain: Address = env.storage().persistent().get(&DataKey::Captain).expect("Not initialized");
        if captain != stored_captain {
            panic!("Only the Captain can issue IDs");
        }

        let resident_id = ResidentID {
            name,
            birth_date,
            barangay,
            is_active: true,
        };

        env.storage().persistent().set(&DataKey::Resident(resident), &resident_id);
    }

    /// Revokes an existing ID. Only callable by the Captain.
    pub fn revoke_id(env: Env, captain: Address, resident: Address) {
        captain.require_auth();
        
        let stored_captain: Address = env.storage().persistent().get(&DataKey::Captain).expect("Not initialized");
        if captain != stored_captain {
            panic!("Only the Captain can revoke IDs");
        }

        if let Some(mut resident_id) = env.storage().persistent().get::<_, ResidentID>(&DataKey::Resident(resident.clone())) {
            resident_id.is_active = false;
            env.storage().persistent().set(&DataKey::Resident(resident), &resident_id);
        } else {
            panic!("Resident ID not found");
        }
    }

    /// Retrieves the ID information for a resident.
    pub fn get_id(env: Env, resident: Address) -> Option<ResidentID> {
        env.storage().persistent().get(&DataKey::Resident(resident))
    }
}

mod test;
