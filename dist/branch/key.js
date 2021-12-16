System.register([], function (exports_1, context_1) {
    "use strict";
    var BranchKey;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            BranchKey = class BranchKey {
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
            };
            exports_1("BranchKey", BranchKey);
        }
    };
});
//# sourceMappingURL=key.js.map