import * as util from '@nervosnetwork/ckb-sdk-utils'

export const merge = (height: u8, node_key: H256, left: MergeValue, right: MergeValue): MergeValue => {
  let hasher = util.blake2b(32, null, null, util.PERSONAL);
  hasher
    .update(new H256(height))
    .update(node_key)
    .update(left.hash())
    .update(right.hash());

  return from_h256(hasher.final('binary') as H256);
}

export const from_h256 = (value: H256): MergeValue => {
  return new MergeValueNormal(value);
}