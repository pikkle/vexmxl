"use strict";
exports.__esModule = true;
require("vexflow");
var vexmxl_1 = require("../src/vexmxl");
require("jszip");
/*
parseXMLFromFile("../support/Back In Black2.xml", true, true).then(tab => {
    console.log(tab);
    console.log(tab.toString());
    let img = generateImage(tab);
    document.getElementById("display").appendChild(img);
});
*/
var zip = new JSZip();
fetch("http://localhost:8000/uploads/mxl/479e36af-d5fa-4af5-b287-feed9cb4e95c.mxl").then(function (response) {
    return response.blob();
}).then(function (blob) {
    zip.loadAsync(blob).then(function (jszip) {
        jszip.file("META-INF\/container.xml").async("string").then(function (containerFile) {
            var mainFilename = new DOMParser().parseFromString(containerFile, "application/xml").getElementsByTagName("rootfile")[0].getAttribute("full-path");
            jszip.file(mainFilename).async("string").then(function (musicxmlString) {
                vexmxl_1.parseXMLFromString(musicxmlString, true).then(function (tab) {
                    var div = document.createElement("div");
                    var vextab = vexmxl_1.displayTablature(tab, div, false);
                    vextab.getArtist().staves[0].tab_notes.forEach(function (note) {
                        console.log(note.getAbsoluteX());
                    });
                });
            });
        });
    });
});
