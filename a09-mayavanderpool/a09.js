// 
// a09.js
// Template for CSC444 Assignment 09, Fall 2024
// Joshua A. Levine <josh@arizona.edu>
//
// Modified by Maya Vanderpool <mayavanderpool@arizona.edu> to
// complete the template code.
//
// This file provides the template code for A11, providing a skeleton
// for how to initialize and compute isocontours.
//


////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries, and helper functions

let svgSize = 490;
let bands = 49;

let xScale = d3.scaleLinear().domain([0, bands]).range([0, svgSize]);
let yScale = d3.scaleLinear().domain([-1, bands - 1]).range([svgSize, 0]);

function createSvg(sel) {
	return sel
		.append("svg")
		.attr("width", svgSize)
		.attr("height", svgSize);
}

function createGroups(data) {
	return function (sel) {
		return sel
			.append("g")
			.selectAll("rect")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", function (d) {
				return "translate(" + xScale(d.Col) + "," + yScale(d.Row) + ")";
			});
	};
}

d3.selection.prototype.callReturn = function (callable) {
	return callable(this);
};

// This function returns the pair [min/max] for a cell d.
function gridExtent(d) {
	return [Math.min(d.NW, d.NE, d.SW, d.SE),
	Math.max(d.NW, d.NE, d.SW, d.SE)];
}



////////////////////////////////////////////////////////////////////////
// Functions for isocontouring

// Given a cell d and an isovalude value, this returns a 4-bit polarity
// signature in result.case as an integer [0,15].  Any bit that is 1
// indicates that the associate cell corner is on or above the contour.
function polarity(d, value) {
	let result = {
		NW: d.NW < value ? 0 : 1,
		NE: d.NE < value ? 0 : 1,
		SW: d.SW < value ? 0 : 1,
		SE: d.SE < value ? 0 : 1
	};
	result.case = result.NW + result.NE * 2 + result.SW * 4 + result.SE * 8;
	return result;
}

// currentContour is a global variable which stores the value
// of the contour we are currently extracting
var currentContour;

function includesOutlineContour(d) {
	let extent = gridExtent(d);
	return currentContour >= extent[0] && currentContour <= extent[1];
}

// This function determines id a contour is filled
// inputs:
// 	d - Cell
//
// returns:  A boolean true if the currentContour is not less than min cell and false if it is
function includesFilledContour(d) {
	// TODO: WRITE THIS PART.
	let extent = gridExtent(d);
	// Returns true if currentContour is not less than the min cell
	return currentContour >= extent[0];
}

// This function generates the outline contour.
// inputs:
// 	d - Cell
//
// returns: An SVG path specifier for the contour given at cell d
function generateOutlineContour(d) {
	// HINT: you should set up scales which, given a contour value, can be
	// used to interpolate the function along each side in the boundary of
	// the square
	let wScale = d3.scaleLinear().domain([d.SW, d.NW]).range([0, 10]);
	let eScale = d3.scaleLinear().domain([d.SE, d.NE]).range([0, 10]);
	let nScale = d3.scaleLinear().domain([d.NW, d.NE]).range([0, 10]);
	let sScale = d3.scaleLinear().domain([d.SW, d.SE]).range([0, 10]);

	switch (polarity(d, currentContour).case) {
		// TODO: WRITE THIS PART.
		case 0: // Nothing above
			return ""
		case 1: // NW above
			return "M 0," + wScale(currentContour) + " L" + nScale(currentContour) + ",10";
		case 2: // NE above
			return "M 10," + eScale(currentContour) + " L" + nScale(currentContour) + ",10";
		case 3: // NW and NE above
			return "M 0," + wScale(currentContour) + " L 10, " + eScale(currentContour);
		case 4: // SW above
			return "M 0," + wScale(currentContour) + " L" + sScale(currentContour) + ",0";
		case 5: // NW and SW above
			return "M" + sScale(currentContour) + ",0  L" + nScale(currentContour) + ",10";
		case 6: // NE and SW above
			return "M" + sScale(currentContour) + ",0 L 10," + eScale(currentContour) + " M 0," + wScale(currentContour) + " L" + nScale(currentContour) + ",10";
		case 7: // NW, NE, and SW above
			return "M" + sScale(currentContour) + ",0 L 10," + eScale(currentContour);
		case 8: // SE above
			return "M 10," + eScale(currentContour) + " L" + sScale(currentContour) + ",0";
		case 9: // NW and SE above
			return "M 0," + wScale(currentContour) + " L" + nScale(currentContour) + ",10 M 10," + eScale(currentContour) + " L" + sScale(currentContour) + ",0";
		case 10: // NE and SE above
			return "M" + sScale(currentContour) + ",0" + " L" + nScale(currentContour) + ",10";
		case 11: // NW, NE, and SE above
			return "M 0," + wScale(currentContour) + " L" + sScale(currentContour) + ",0";
		case 12: // SW and SE above 
			return "M 10," + eScale(currentContour) + " L 0, " + wScale(currentContour);
		case 13: // NW, SW, and SE above
			return "M 10," + eScale(currentContour) + " L" + nScale(currentContour) + ",10";
		case 14: // NE, SW, and SE above
			return "M" + nScale(currentContour) + ",10 L 0," + wScale(currentContour);
		case 15: // All above
			return "";
	}

}

// This function generates the filled contour.
// inputs:
// 	d - Cell
//
// returns: An SVG path specifier for the contour given at cell d
function generateFilledContour(d) {
	// HINT: you should set up scales which, given a contour value, can be
	// used to interpolate the function along each side in the boundary of
	// the square
	let wScale = d3.scaleLinear().domain([d.SW, d.NW]).range([0, 10]);
	let eScale = d3.scaleLinear().domain([d.SE, d.NE]).range([0, 10]);
	let nScale = d3.scaleLinear().domain([d.NW, d.NE]).range([0, 10]);
	let sScale = d3.scaleLinear().domain([d.SW, d.SE]).range([0, 10]);

	switch (polarity(d, currentContour).case) {
		// TODO: WRITE THIS PART.
		case 0: // Nothing above
			return "M 0,0 L 0,10 L 10,10 L 10,0 Z"
		case 1: // NW above
			return "M 0," + wScale(currentContour) + " L" + nScale(currentContour) + ",10 L 10,10 L 10,0 L 0,0 Z";
		case 2: // NE above
			return "M 10," + eScale(currentContour) + " L" + nScale(currentContour) + ",10 L 0,10 L 0,0 L 10,0 Z";
		case 3: // NW and NE above
			return "M 0," + wScale(currentContour) + " L 10, " + eScale(currentContour) + " L 10,0 L 0,0 Z";
		case 4: // SW above
			return "M 0," + wScale(currentContour) + " L" + sScale(currentContour) + ",0 L 10,0 L 10,10 L 0,10 Z";
		case 5: // NW and SW above
			return "M" + sScale(currentContour) + ",0  L" + nScale(currentContour) + ",10 L 10,10 L 10,0 Z";
		case 6: // NE and SW above
			return "M" + sScale(currentContour) + ",0 L 10," + eScale(currentContour) + " Z M 0," + wScale(currentContour) + " L" + nScale(currentContour) + ",10 Z";
		case 7: // NW, NE, and SW above
			return "M" + sScale(currentContour) + ",0 L 10," + eScale(currentContour) + " L 10,0 Z";
		case 8: // SE above
			return "M 10," + eScale(currentContour) + " L" + sScale(currentContour) + ",0 L 0,0 L 0,10 L 10,10 Z";
		case 9: // NW and SE above
			return "M 0," + wScale(currentContour) + " L" + nScale(currentContour) + ",10 Z M 10," + eScale(currentContour) + " L" + sScale(currentContour) + ",0 Z";
		case 10: // NE and SE above
			return "M" + sScale(currentContour) + ",0  L" + nScale(currentContour) + ",10 L 0,10 L 0,0 Z";
		case 11: // NW, NE, and SE above
			return "M 0," + wScale(currentContour) + " L" + sScale(currentContour) + ",0 L 0,0 Z";
		case 12: // SW and SE above 
			return "M 10," + eScale(currentContour) + " L 0, " + wScale(currentContour) + " L 0,10 L 10,10 Z";
		case 13: // NW, SW, and SE above
			return "M 10," + eScale(currentContour) + " L" + nScale(currentContour) + ",10 L 10,10 Z";
		case 14: // NE, SW, and SE above
			return "M" + nScale(currentContour) + ",10 L 0," + wScale(currentContour) + " L 0,10 Z";
		case 15: // All above
			return "";
	}
}



////////////////////////////////////////////////////////////////////////
// Visual Encoding portion that handles the d3 aspects


// d3 function to compute isocontours for all cells that span given a
// range of values, [minValue,maxValues], this function produces a set
// of size "steps" isocontours to be added to the selection "sel"
function createOutlinePlot(minValue, maxValue, steps, sel) {
	let contourScale = d3.scaleLinear().domain([1, steps]).range([minValue, maxValue]);
	for (let i = 1; i <= steps; ++i) {
		currentContour = contourScale(i);
		sel.filter(includesOutlineContour).append("path")
			.attr("transform", "translate(0, 10) scale(1, -1)") // ensures that positive y points up
			.attr("d", generateOutlineContour)
			.attr("fill", "none")
			.attr("stroke", "black");
	}
}

// d3 function to compute filled isocontours for all cells that span
// given a range of values, [minValue,maxValues], this function produces
// a set of size "steps" isocontours to be added to the selection "sel".
// colorScale is used to assign their fill color.
function createFilledPlot(minValue, maxValue, steps, sel, colorScale) {
	let contourScale = d3.scaleLinear().domain([1, steps]).range([minValue, maxValue]);
	for (let i = steps; i >= 1; --i) {
		currentContour = contourScale(i);
		sel.filter(includesFilledContour).append("path")
			.attr("transform", "translate(0, 10) scale(1, -1)") // ensures that positive y points up
			.attr("d", generateFilledContour)
			.attr("fill", function (d) { return colorScale(currentContour); });
	}
}

// Compute the isocontour plots
let plot1T = d3.select("#plot1-temperature")
	.callReturn(createSvg)
	.callReturn(createGroups(temperatureCells));
let plot1P = d3.select("#plot1-pressure")
	.callReturn(createSvg)
	.callReturn(createGroups(pressureCells));

createOutlinePlot(-70, -60, 10, plot1T);
createOutlinePlot(-500, 200, 10, plot1P);

// Compute the filled isocontour plots
let plot2T = d3.select("#plot2-temperature")
	.callReturn(createSvg)
	.callReturn(createGroups(temperatureCells));
let plot2P = d3.select("#plot2-pressure")
	.callReturn(createSvg)
	.callReturn(createGroups(pressureCells));

createFilledPlot(-70, -60, 10, plot2T,
	d3.scaleLinear()
		.domain([-70, -60])
		.range(["blue", "red"]));
createFilledPlot(-500, 200, 10, plot2P,
	d3.scaleLinear()
		.domain([-500, 0, 500])
		.range(["#ca0020", "#f7f7f7", "#0571b0"]));

// This function creates a tooltip element for extra credit.
// inputs:
// 	sel- Selected plot
// label- Text label
//
// returns: None
function tooltip(sel, label,) {
	let tooltip = d3.select("#tooltip");

	sel.each(function (d) {
		// Calculate average value in cell
		let avg = (d.NE + d.NW + d.SE + d.SW) / 4;

		// Append tooltip
		d3.select(this)
			.append('rect')
			.attr('fill', 'transparent')
			.attr('width', 10)
			.attr('height', 10)
			.on('mouseenter', function (event) {
				// make tooltip appear on hovering
				tooltip.classed('show', true)
					.html(label + ":" + avg.toFixed(3))
					.style('left', (event.pageX + 10) + 'px')
					.style('top', (event.pageY + 10) + 'px');
			})
			// make tooltip dissapear when no longer hovering
			.on('mouseleave', function (d) {
				tooltip.classed('show', false);
			});
	});
}

tooltip(plot1T, "Temperature")
tooltip(plot1P, "Pressure")
tooltip(plot2T, "Temperature")
tooltip(plot2P, "Pressure")
