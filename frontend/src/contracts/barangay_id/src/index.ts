import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export type DataKey = {tag: "Captain", values: void} | {tag: "Resident", values: readonly [string]};


export interface ResidentID {
  barangay: string;
  birth_date: string;
  is_active: boolean;
  name: string;
}

export interface Client {
  /**
   * Construct and simulate a get_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Retrieves the ID information for a resident.
   */
  get_id: ({resident}: {resident: string}, options?: MethodOptions) => Promise<AssembledTransaction<Option<ResidentID>>>

  /**
   * Construct and simulate a issue_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Issues a new digital ID for a resident. Only callable by the Captain.
   */
  issue_id: ({captain, resident, name, birth_date, barangay}: {captain: string, resident: string, name: string, birth_date: string, barangay: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a revoke_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Revokes an existing ID. Only callable by the Captain.
   */
  revoke_id: ({captain, resident}: {captain: string, resident: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initializes the contract with the Barangay Captain's address.
   */
  initialize: ({captain}: {captain: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAAB0NhcHRhaW4AAAAAAQAAAAAAAAAIUmVzaWRlbnQAAAABAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAClJlc2lkZW50SUQAAAAAAAQAAAAAAAAACGJhcmFuZ2F5AAAAEAAAAAAAAAAKYmlydGhfZGF0ZQAAAAAAEAAAAAAAAAAJaXNfYWN0aXZlAAAAAAAAAQAAAAAAAAAEbmFtZQAAABA=",
        "AAAAAAAAACxSZXRyaWV2ZXMgdGhlIElEIGluZm9ybWF0aW9uIGZvciBhIHJlc2lkZW50LgAAAAZnZXRfaWQAAAAAAAEAAAAAAAAACHJlc2lkZW50AAAAEwAAAAEAAAPoAAAH0AAAAApSZXNpZGVudElEAAA=",
        "AAAAAAAAAEVJc3N1ZXMgYSBuZXcgZGlnaXRhbCBJRCBmb3IgYSByZXNpZGVudC4gT25seSBjYWxsYWJsZSBieSB0aGUgQ2FwdGFpbi4AAAAAAAAIaXNzdWVfaWQAAAAFAAAAAAAAAAdjYXB0YWluAAAAABMAAAAAAAAACHJlc2lkZW50AAAAEwAAAAAAAAAEbmFtZQAAABAAAAAAAAAACmJpcnRoX2RhdGUAAAAAABAAAAAAAAAACGJhcmFuZ2F5AAAAEAAAAAA=",
        "AAAAAAAAADVSZXZva2VzIGFuIGV4aXN0aW5nIElELiBPbmx5IGNhbGxhYmxlIGJ5IHRoZSBDYXB0YWluLgAAAAAAAAlyZXZva2VfaWQAAAAAAAACAAAAAAAAAAdjYXB0YWluAAAAABMAAAAAAAAACHJlc2lkZW50AAAAEwAAAAA=",
        "AAAAAAAAAD1Jbml0aWFsaXplcyB0aGUgY29udHJhY3Qgd2l0aCB0aGUgQmFyYW5nYXkgQ2FwdGFpbidzIGFkZHJlc3MuAAAAAAAACmluaXRpYWxpemUAAAAAAAEAAAAAAAAAB2NhcHRhaW4AAAAAEwAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_id: this.txFromJSON<Option<ResidentID>>,
        issue_id: this.txFromJSON<null>,
        revoke_id: this.txFromJSON<null>,
        initialize: this.txFromJSON<null>
  }
}