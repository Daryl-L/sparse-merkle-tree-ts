import { MergeValue } from "../merge/merge";

export class BranchNode {
  left: MergeValue;
  right: MergeValue;

  constructor(left: MergeValue, right: MergeValue) {
    this.left = left;
    this.right = right;
  }
}
