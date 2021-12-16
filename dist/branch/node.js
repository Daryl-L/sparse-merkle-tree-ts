System.register([], function (exports_1, context_1) {
    "use strict";
    var BranchNode;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            BranchNode = class BranchNode {
                constructor(left, right) {
                    this.left = left;
                    this.right = right;
                }
            };
            exports_1("BranchNode", BranchNode);
        }
    };
});
//# sourceMappingURL=node.js.map