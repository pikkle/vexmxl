# vexmxl

Vexmxl has for purpose to use VexTab (by extension VexFlow) alongside MusicXML files to display tablatures and music sheets.

This project will eventually be able to read MusicXML on both MXL and XML file extensions (right now with XML only).

Types for typescript is already given in the output ! You simple have to import the project with npm :)

## Usage
This package


Install the package using npm:
```
npm install vexmxl
```

Parse your XML and display the computed tablature (here in typescript):
```
parseXMLFromFile("Back In Black.xml").then(tab => {
    let img = generateImage(tab);
    document.getElementById("display").appendChild(img);
});
```

Both the parsing and the displaying by VexFlow take a while ! (a few seconds).