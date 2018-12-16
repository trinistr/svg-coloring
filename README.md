# SVG colorer

A module to create colorable SVG images with color palette

## Installation

	`npm install @trinistr/svg-coloring`

## Usage

	var coloring = require('@trinistr/svg-coloring');
	var colorer = coloring.createColorer({
		url: "image.svg", colors: ["red", "salmon", "black"]
	});
	document.body.appendChild(colorer);
