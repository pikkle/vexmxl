define(["require", "exports", "intern!object", "intern/chai!assert", "../../vexmxl.tab", "../../vexmxl"], function (require, exports, registerSuite, assert, vexmxl_tab_1, vexmxl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    registerSuite({
        "name": "vexmxl parse and display functions",
        "test display": function () {
            var tab = new vexmxl_tab_1.VexMxlTab.VexmxlTablature(true);
            vexmxl_1.VexMxl.generateSVG(tab);
            assert.equal(true, true);
        },
    });
});
//# sourceMappingURL=test.vexmxl.parse.js.map