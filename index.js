/**
 * Create an SVG colorer node
 * @param {string} url (required) - path to SVG image
 * @param {string} id - id of the wrapper element (default: none)
 * @param colors - either an Array of CSS colors or a number (default: 6 colors)
 * @param {boolean} autoColors - whether to automatically assign colors when `colors` is a number
 * @param {number} groupBy - group colors by this count
 * @param {boolean} addEraser - whether to add an extra 'eraser' color
 * @param {string} eraserColor - what color should the eraser be (default: transparent)
 * @param {string} defaultFill - initial fill for the SVG elements (default: don't fill)
 * @return DOMNode of the wrapper
 */
var createColorer = exports.createColorer = function ({url, id, colors, autoColors, groupBy, addEraser, eraserColor, defaultFill}) {
	if (!url) {
		return undefined;
	}
	let colorerData = {};
	let wrapper = document.createElement("div");
	if (id) {
		wrapper.id = id;
	}
	wrapper.className = "colorer_wrapper";

	let image_container = createImage({
		usedClass: "colorer_image", url: url, defaultFill: defaultFill,
		clickHandler: (e)=>{
			e.target.style.fill = colorerData.color;
		}
	});
	wrapper.appendChild(image_container);


	const currentColorClass = "colorer_selected_color";
	const usedClass = "colorer_palette";
	const eraserColorFinal = eraserColor ? eraserColor : "rgba(255,255,255,0)"
	let palette_container = createPalette({
		colors: colors, autoColors: autoColors, groupBy: groupBy,
		usedClass: usedClass, addEraser: addEraser, clickHandler: (e) => {
			colorerData.currentColorElement.classList.remove(currentColorClass);
			colorerData.currentColorElement = e.target;
			colorerData.currentColorElement.classList.add(currentColorClass);
			if (!colorerData.currentColorElement.classList.contains(usedClass + "_color_eraser")) {
				colorerData.color = colorerData.currentColorElement.style.backgroundColor;
			}
			else {
				colorerData.color = eraserColorFinal;
			}
		}
	});
	colorerData.currentColorElement = palette_container.getElementsByClassName(usedClass + "_color1")[0];
	colorerData.currentColorElement.classList.add(currentColorClass);
	colorerData.color = colorerData.currentColorElement.style.backgroundColor;
	wrapper.appendChild(palette_container);
	return wrapper;
}

/**
 * Create a clickable SVG image node
 * @param {string} url (required) - path to SVG image
 * @param {function} clickHandler - click handler for SVG elements
 * @param {string} usedClass - will be prepended to every class
 * @param {string} id - id of the image container
 * @param {string} defaultFill - initial fill for elements (default: don't fill)
 * @return DOMNode of the image container
 * Classes of the created elements:
 * container - `usedClass`_container
 * image - `usedClass`
 */
var createImage = exports.createImage = function ({url, clickHandler, defaultFill, usedClass, id}) {
	if (!url) {
		return undefined;
	}
	let image = document.createElement("object");
	let image_container = document.createElement("div");
	if (!usedClass) {
		usedClass = "";
	}
	if (id) {
		image_container.id = id;
	}
	image_container.appendChild(image);
	image_container.className = usedClass + "_container";
	image.className = usedClass;
	image.type = "image/svg+xml";
	image.data = url;
	image.addEventListener("load",()=>{
		let svgDoc = image.contentDocument;
		let elementTypes = ["polygon", "path", "circle", "rect"];
		elementTypes.forEach((type) =>{
			let els = svgDoc.querySelectorAll(type);
			els.forEach((el)=>{
				if (clickHandler) {
					el.addEventListener("click", clickHandler);
				}
				if (defaultFill) {
					el.style.fill = defaultFill;
				}
			});
		});
		let raster = svgDoc.querySelectorAll("image");
		raster.forEach((img) => {
			img.style.pointerEvents = "none";
		});
	},false);
	return image_container;
}

/**
 * Create a color palette node
 * @param colors - either an Array of CSS colors or a number of colors to create
 * @param {function} clickHandler - click handler for color buttons
 * @param {boolean} autoColors - whether to automatically assign colors when `colors` is a number
 * @param {number} groupBy - group colors by this count
 * @param {boolean} addEraser - whether to add an extra 'eraser' color
 * @param {string} usedClass - class for the container, will be prepended to every class
 * @param {string} id - id of the palette container
 * @return DOMNode of the palette container
 * autoColors will assign colors uniformly distributed through the hue wheel. If
 * it is false, color buttons will have no color at all, use CSS to remedy that.
 * If groupBy is specified and addEraser is true 'eraser' will be put into a
 * separate group.
 * Classes of the created elements:
 * container - `usedClass`
 * color buttons - `usedClass`_colorN
 * eraser button - `usedClass`_color_eraser
 * color groups - `usedClass`_groupN
 * eraser group - `usedClass`_group_eraser
 */
var createPalette = exports.createPalette = function ({colors, clickHandler, autoColors, groupBy, addEraser, usedClass, id}) {
	let palette_container = document.createElement("div");
	if (!usedClass) {
		usedClass = ""
	}
	if (id) {
		palette_container.id = id;
	}
	palette_container.className = usedClass;
	let nColors;
	if (!colors) {
		colors = ["#f00", "#ff0", "#0f0", "#0ff", "#00f", "#f0f"];
		nColors = colors.length;
	}
	else if (typeof colors == "number") {
		nColors = colors;
		if (autoColors) {
			colors = [];
			for (let angle = 0; angle <= 360; angle += 360/nColors) {
				colors.push("hsl("+angle+",90%,50%)");
			}
		}
		else {
			colors = undefined;
		}
	}
	else if (colors instanceof Array) {
		nColors = colors.length;
	}
	else {
		return undefined;
	}
	let groupi = 0;
	let group;
	let color;
	for (let i = 0; i < nColors; i++) {
		color = document.createElement("button");
		color.className = usedClass + "_color" + (i+1);
		if (clickHandler) {
			color.addEventListener("click", clickHandler);
		}
		if (colors) {
			color.style.backgroundColor = colors[i];
		}
		if (groupBy && groupBy > 0) {
			if (i % groupBy === 0) {
				groupi++;
				group = document.createElement("div");
				group.className = usedClass + "_group" + groupi;
				palette_container.appendChild(group);
			}
			group.appendChild(color);
		}
		else {
			palette_container.appendChild(color);
		}
	}
	if (addEraser) {
		let eraser = document.createElement("button");
		eraser.className = usedClass + "_color_eraser";
		if (clickHandler) {
			eraser.addEventListener("click", clickHandler);
		}
		if (groupBy) {
			group = document.createElement("div");
			group.className = usedClass + "_group_eraser";
			group.appendChild(eraser);
			palette_container.appendChild(group);
		}
		else {
			palette_container.appendChild(eraser);
		}
		if (autoColors) {
			eraser.style.backgroundColor = "#fff";
		}
	}
	return palette_container;
}
