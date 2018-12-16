# SVG colorer

A module to create colorable SVG images with color palette

## Installation

	npm install @trinistr/svg-coloring

## Usage

	var coloring = require('@trinistr/svg-coloring');
	var colorer = coloring.createColorer({
		url: "image.svg", colors: ["red", "salmon", "black"]
	});
	document.body.appendChild(colorer);

## Longer description

This module allows to create a container with an SVG image and a color palette.
Use createColorer() for this. All polygons, paths, rects and circles in SVG get
a click handler which sets their fill color to the currently selected one. Color
palette consists of a bunch of &lt;button&gt;s with background-color set.

Alternatively, createImage() and createPalette() can be used separately, but
this will require creating your own click handlers.

Please do note that this module does not style any of the elements except
setting background-color of the buttons, and even this is not neccessary.

Currently all of the documentation is provided in source code.
