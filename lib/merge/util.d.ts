import H256 from '../h256';
import Hasher from '../hasher';
import { u8 } from '../u8';
import { MergeValue } from './merge';
export declare const merge: (height: u8, node_key: H256, left: MergeValue, right: MergeValue, hasherFactory: () => Hasher) => MergeValue;
export declare const from_h256: (value: H256) => MergeValue;
