import * as util from '@nervosnetwork/ckb-sdk-utils'
import { H256 } from '../h256';
import { u8 } from '../u8';
import { MergeValue, MergeValueNormal, MergeValueWithZero } from './merge';

export const merge = (height: u8, node_key: H256, left: MergeValue, right: MergeValue): MergeValue => {
  if (left.is_zero() && right.is_zero()) {
    return new MergeValueNormal(H256.zero());
  }

  if (left.is_zero()) {
    return merge_with_value(height, node_key, right, true);
  }

  if (right.is_zero()) {
    return merge_with_value(height, node_key, left, false);
  }

  let hasher = util.blake2b(32, null, null, util.PERSONAL);
  hasher
    .update(new H256(height))
    .update(node_key)
    .update(left.hash())
    .update(right.hash());

  return from_h256(new H256(hasher.final('binary') as Uint8Array));
}

const merge_with_value = (height: u8, node_key: H256, value: MergeValue, set_bit: boolean): MergeValueWithZero => {
  let res = new MergeValueWithZero;
  if (value instanceof MergeValueWithZero) {
    res.base_node = value.base_node;
    let zero_bits = new H256(value.zero_bits);
    if (set_bit) {
      zero_bits.set_bit(height);
    }
    res.zero_bits = zero_bits;
    if (value.zero_count == 255) {
      res.zero_count = 0;
    } else {
      res.zero_count = value.zero_count + 1 as u8;
    }
  }

  if (value instanceof MergeValueNormal) {
    res.zero_bits = H256.zero();
    if (set_bit) {
      res.zero_bits.set_bit(height);
    }
    res.base_node = new H256(
      util
        .blake2b(32, null, null, util.PERSONAL)
        .update(new H256([height]))
        .update(node_key)
        .update(value.value)
        .final('binary') as Uint8Array
    );
    res.zero_count = 1;
  }

  return res;
}

export const from_h256 = (value: H256): MergeValue => {
  return new MergeValueNormal(value);
}