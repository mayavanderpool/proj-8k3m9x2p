// 
// a05.js
// Skeleton for CSC444 Assignment 05, Fall 2025
// Joshua A. Levine <josh@arizona.edu>
// Modified by Maya Vanderpool <mayavanderpool@arizona.edu> to complete the color functions.
//
// This file completes the provided skeleton code to write for A05.  It
// generates (using index.html and data.js) grids of 50x50 rectangles 
// to visualize the Hurricane Isabel dataset.

//////////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries to draw the grid of rectangles

var svgSize = 500;
var bands = 50;

var xScale = d3.scaleLinear().domain([0, bands]).range([0, svgSize]);
var yScale = d3.scaleLinear().domain([-1, bands - 1]).range([svgSize, 0]);

function createSvg(sel) {
	return sel
		.append("svg")
		.attr("width", svgSize)
		.attr("height", svgSize);
}

function createRects(sel) {
	return sel
		.append("g")
		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", function (d) { return xScale(d.Col); })
		.attr("y", function (d) { return yScale(d.Row); })
		.attr("width", 10)
		.attr("height", 10)
}

d3.selection.prototype.callAndReturn = function (callable) {
	return callable(this);
};

//////////////////////////////////////////////////////////////////////////////
// Color functions 

// Create a color scale to map color to temperature data montonically.
// inputs:
// 	d - Hurricane data value.
//
// returns:  A color scaled to the temperature value.
function colorT1(d) {
	var color = d3.scaleLinear().domain([d3.min(data, d => d.T), d3.max(data, d => d.T)]).range(['#7703fc', '#fffa96']);
	return color(d.T);
}

// Create a color scale to map color to pressure data uniformly.
// inputs:
// 	d - Hurricane data value.
//
// returns:  A color scaled to the pressure value.
function colorT2(d) {
	var color = d3.scaleLinear().domain([d3.min(data, d => d.T), d3.max(data, d => d.T)]).range(['#7703fc', '#fffa96']).interpolate(d3.interpolateHcl);
	return color(d.T);
}

// Create a var to map the range the domain can deviate from 0 in colorP3 and colorP4
var domainRange = d3.max(data, d => Math.abs(d.P));

// Create a diverging color scale to map color to pressure data.
// inputs:
// 	d - Hurricane data value.
//
// returns:  A color scaled to the pressure value.
function colorP3(d) {
	var color = d3.scaleLinear().domain([-domainRange,
		0, domainRange]).range(['#d7191c', '#ffffbf', '#2c7bb6']).interpolate(d3.interpolateLab);
	return color(d.P);
}

// Create a bivariate color map that portrays both pressure and temperature.
// inputs:
// 	d - Hurricane data value.
//
// returns:  A color scaled to both the pressure and temperature value.
function colorPT4(d) {
	// Pressure scale
	var pressure = d3.scaleLinear().domain([-domainRange,
		0, domainRange]).range([128, 0, -127]);

	// Temperature Scale
	var temp = d3.scaleLinear().domain([d3.min(data, d => d.T), d3.max(data, d => d.T)]).range([15, 85]);

	var t = temp(d.T);
	var neutral = 0;
	var p = pressure(d.P);

	// Return custom color
	return d3.lab(t, neutral, p);
}


//////////////////////////////////////////////////////////////////////////////
// 


d3.select("#plot1-temperature")
	.callAndReturn(createSvg)
	.callAndReturn(createRects)
	.attr("fill", colorT1);

d3.select("#plot2-temperature")
	.callAndReturn(createSvg)
	.callAndReturn(createRects)
	.attr("fill", colorT2);

d3.select("#plot3-pressure")
	.callAndReturn(createSvg)
	.callAndReturn(createRects)
	.attr("fill", colorP3);

d3.select("#plot4-bivariate")
	.callAndReturn(createSvg)
	.callAndReturn(createRects)
	.attr("fill", colorPT4);



//////////////////////////////////////////////////////////////////////////////
//
function legend(){
	var width = 300;
	var height = 100;
	
}