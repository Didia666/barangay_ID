#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_id_issuance_and_revocation() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, BarangayIDContract);
    let client = BarangayIDContractClient::new(&env, &contract_id);

    let captain = Address::generate(&env);
    let resident = Address::generate(&env);

    client.initialize(&captain);

    let name = String::from_str(&env, "Juan Dela Cruz");
    let birth_date = String::from_str(&env, "1990-01-01");
    let barangay = String::from_str(&env, "Brgy. Sample");

    // Captain issues ID
    client.issue_id(&captain, &resident, &name, &birth_date, &barangay);

    let id = client.get_id(&resident).unwrap();
    assert_eq!(id.name, name);
    assert_eq!(id.is_active, true);

    // Captain revokes ID
    client.revoke_id(&captain, &resident);
    let revoked_id = client.get_id(&resident).unwrap();
    assert_eq!(revoked_id.is_active, false);
}

#[test]
#[should_panic(expected = "Only the Captain can issue IDs")]
fn test_unauthorized_issuance() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, BarangayIDContract);
    let client = BarangayIDContractClient::new(&env, &contract_id);

    let captain = Address::generate(&env);
    let fake_captain = Address::generate(&env);
    let resident = Address::generate(&env);

    client.initialize(&captain);

    let name = String::from_str(&env, "Juan Dela Cruz");
    let birth_date = String::from_str(&env, "1990-01-01");
    let barangay = String::from_str(&env, "Brgy. Sample");

    // Non-captain tries to issue ID
    client.issue_id(&fake_captain, &resident, &name, &birth_date, &barangay);
}
