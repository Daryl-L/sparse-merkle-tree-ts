"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchKey = void 0;
class BranchKey {
    constructor(height, key) {
        this.key = key;
        this.height = height;
    }
    is_right(height) {
        return this.key.is_right(height);
    }
    toString() {
        return this.key.toString() + this.height.toString();
    }
}
exports.BranchKey = BranchKey;
//# sourceMappingURL=key.js.map