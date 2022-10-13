export const idlFactory = ({ IDL }) => {
  const Staking = IDL.Service({
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], []),
    'claim' : IDL.Func([IDL.Nat], [], []),
    'pendingReward' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'stake' : IDL.Func([IDL.Nat], [], []),
    'withdraw' : IDL.Func([IDL.Nat], [], []),
  });
  return Staking;
};
export const init = ({ IDL }) => { return []; };
