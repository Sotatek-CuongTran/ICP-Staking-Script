import { HttpAgent, Actor } from "@dfinity/agent";
import { Secp256k1KeyIdentity } from "@dfinity/identity";
import { AccountIdentifier } from "@dfinity/nns";
import hdkey from "hdkey";
import bip39 from "bip39";
import { idlFactory as ledgerFactory } from "./ledger.did.js";
import { idlFactory as dip20Factory } from "./token.did.js";
import { idlFactory as poolFactory } from "./staking.did.js";
import fetch from "isomorphic-fetch";
import { Principal } from "@dfinity/principal";
// import fetch from "node-fetch";
// globalThis.fetch = fetch
const plug_mnemonic =
  "audit key initial source predict retreat mammal survey civil grocery grid brass";
const ledgerId = "qoctq-giaaa-aaaaa-aaaea-cai";
const dip20Id = "sgymv-uiaaa-aaaaa-aaaia-cai";
const poolId = "q4eej-kyaaa-aaaaa-aaaha-cai";

export const identityFromSeed = async (phrase) => {
  const seed = await bip39.mnemonicToSeed(phrase);
  const root = hdkey.fromMasterSeed(seed);
  const addrnode = root.derive("m/44'/223'/0'/0/0");
  const result = Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);

  return result;
};

const getRootKeyAgentLocal = async () => {
  const rootKeyAgentLocal = await agentLocal.fetchRootKey();
  console.log("root key agent local", rootKeyAgentLocal);
  return rootKeyAgentLocal;
};

const run = async () => {
  const identity = await identityFromSeed(plug_mnemonic);
  const privateKey = identity.getKeyPair().secretKey;
  const hostLocal = "http://localhost:8000/";
  const agentLocal = new HttpAgent({ host: hostLocal, identity, fetch });
  agentLocal.fetchRootKey();
  /**
   * @type {import("@dfinity/agent").ActorSubclass<import("./ledger.did.js")._SERVICE>}
   */
  const ledgerActor = Actor.createActor(ledgerFactory, {
    agent: agentLocal,
    canisterId: ledgerId,
  });
  /**
   * @type {import("@dfinity/agent").ActorSubclass<import("./dip20.did.js")._SERVICE>}
   */
  const dip20Actor = Actor.createActor(dip20Factory, {
    agent: agentLocal,
    canisterId: dip20Id,
  });

  /**
   * @type {import("@dfinity/agent").ActorSubclass<import("./pool.did.js")._SERVICE>}
   */
  const poolActor = Actor.createActor(poolFactory, {
    agent: agentLocal,
    canisterId: poolId,
  });
  let plug2Principal = Principal.fromText(
    "kss3o-w3c4z-elwmk-cop6h-mmxko-7nm32-pihz5-lofmv-rj3y7-ede44-lae"
  );
  let senderPrincipal = identity.getPrincipal();
  let poolPrincipal = Principal.fromText(poolId);
  let plug1 = AccountIdentifier.fromPrincipal({
    principal: senderPrincipal,
  }).toUint8Array();
  let plug2 = AccountIdentifier.fromPrincipal({
    principal: plug2Principal,
  }).toUint8Array();
  let pool = AccountIdentifier.fromPrincipal({
    principal: poolPrincipal,
  }).toUint8Array();
  // let senderAccount = 1;
  // let senderAccountBlob = senderPrincipal.toUint8Array();
  // let senderAccountBlob2 = identity.getPublicKey().toDer();
  // let transfer_result = await ledgerActor.transfer({
  //     memo: 0,
  //     amount: {e8s: 100000000},
  //     fee: {e8s: 10000},
  //     from_subaccount: [],
  //     to: plug2,
  //     created_at_time: [],
  // });
  // const balance1 = await ledgerActor.account_balance({account: plug1});
  // const balance2 = await ledgerActor.account_balance({account: plug2});
  // console.log(balance1);
  // console.log(balance2);
  // console.log(transfer_result);

  // Plug icp balance before deposit
  // const ui1 = await ledgerActor.account_balance({ account: plug1 });
  // console.log("Plug icp balance before deposit", ui1);
  // // Pool icp balance before deposit
  // const oi1 = await ledgerActor.account_balance({ account: pool });
  // console.log("Pool icp balance before deposit", oi1);
  // // Plug nmd balance before deposit
  // const un1 = await dip20Actor.balanceOf(senderPrincipal);
  // console.log("Plug nmd balance before deposit", un1);
  // // Pool nmd balance before deposit
  // const on1 = await dip20Actor.balanceOf(poolPrincipal);
  // console.log("Pool nmd balance before deposit", on1);

  // Call approve and deposit
  console.log("\x1b[36m%s\x1b[0m", "senderPrincipal", senderPrincipal.toString());
  await poolActor.stake(50);
  const principalBalance = await poolActor.balanceOf(senderPrincipal);
  console.log("principalBalance", principalBalance);

  // // Plug icp balance after deposit
  // const ui2 = await ledgerActor.account_balance({ account: plug1 });
  // console.log("Plug icp balance after deposit", ui2);
  // // Pool icp balance after deposit
  // const oi2 = await ledgerActor.account_balance({ account: pool });
  // console.log("Pool icp balance after deposit", oi2);
  // // Plug nmd balance after deposit
  // const un2 = await dip20Actor.balanceOf(senderPrincipal);
  // console.log("Plug nmd balance after deposit", un2);
  // // Pool nmd balance after deposit
  // const on2 = await dip20Actor.balanceOf(poolPrincipal);
  // console.log("Pool nmd balance after deposit", on2);

  // // Call withdraw
  // let withdrawResult = await poolActor.withdraw();
  // console.log("withdraw result", withdrawResult);

  // // Plug icp balance after withdraw
  // const ui3 = await ledgerActor.account_balance({ account: plug1 });
  // console.log("Plug icp balance after withdraw", ui3);
  // // Pool icp balance after withdraw
  // const oi3 = await ledgerActor.account_balance({ account: pool });
  // console.log("Pool icp balance after withdraw", oi3);
  // // Plug nmd balance after withdraw
  // const un3 = await dip20Actor.balanceOf(senderPrincipal);
  // console.log("Plug nmd balance after withdraw", un3);
  // // Pool nmd balance after withdraw
  // const on3 = await dip20Actor.balanceOf(poolPrincipal);
  // console.log("Pool nmd balance after withdraw", on3);

  // console.log(1);
};
run();
