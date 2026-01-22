// 
// File: a04.js
// Assignment 04 from CSC 444, Fall 2025
// Author: Maya Vanderpool <mayavanderpool@arizona.edu>
//
// This file generates a visualization to view the Calvin college set through multiple views.

let svg_width = 500
let svg_height = 500
let padding = 50

// For readability SATV min and max
min_SATV = d3.min(scores, d => d.SATV);
max_SATV = d3.max(scores, d => d.SATV)

// Define cxScale(_) to map SATV to x position
let cxScale = d3.scaleLinear()
	.domain([min_SATV - 10, max_SATV]) // Domain (SATV scores increase by 10, so minus 10 to give a starting domain value)
	.range([padding, svg_width - padding]); // Range


// For readability ACT min and max
min_ACT = d3.min(scores, d => d.ACT);
max_ACT = d3.max(scores, d => d.ACT)

// Define cyScale(_) to map ACT to y position	
let cyScale = d3.scaleLinear()
	.domain([min_ACT - 1, max_ACT]) // Domain (ACT scores increase by 1, so minus 1 to give a starting domain value)
	.range([svg_height - padding, padding]); // Range


// For readability ACT min and max
min_SATM = d3.min(scores, d => d.SATM);
max_SATM = d3.max(scores, d => d.SATM)

// Define rScale(_) to map SATM to radius
let rScale = d3.scaleSqrt()
	.domain([min_SATM, max_SATM]) // Domain
	.range([2, 12]); // Range

// Skeleton for scatterplot used from A03

var scatterplot1 = d3.select('#div1')
	.append('svg')
	.attr('id', 'scatterplot1')
	.attr('width', svg_width)
	.attr('height', svg_height);

var group1 = scatterplot1.append('g').attr('id', 'plot');

// Plotting circles in scatterplot
group1.selectAll('circle')
	.data(scores)
	.enter()
	.append('circle')
	.attr('cx', function (d, i) {
		return cxScale(d.SATV);
	})
	.attr('cy', function (d, i) {
		return cyScale(d.ACT);
	})
	.attr('r', function (d, i) {
		return rScale(d.SATM);
	});


// Creating x and y axes
var xAxis = d3.axisBottom().scale(cxScale);
var yAxis = d3.axisLeft().scale(cyScale);

// Append x-axis
scatterplot1.append('g')
	.attr('id', 'x-axis')
	.attr('transform', 'translate(0,' + (svg_height - padding) + ')') // Map x-axis to correct position
	.call(xAxis)
	.append('text')
	.attr('id', 'x-axis-text')
	.attr('x', 250) // Center horizontally
	.attr('y', 40) // Offset from graph
	.attr('text-anchor', 'middle')
	.attr('fill', 'black')
	.text('SATV');


// Append y-axis
scatterplot1.append('g')
	.attr('id', 'y-axis')
	.attr('transform', 'translate(' + padding + ', 0)') // Map y-axis to correct position
	.call(yAxis)
	.append('text')
	.attr('x', -250) // Center vertically
	.attr('y', -40) // Offset from graph
	.attr('transform', 'rotate(-90)')
	.attr('text-anchor', 'middle')
	.attr('fill', 'black')
	.text('ACT');

// Extra Credit

// Function to change mapping of x-axis.
// inputs:
// 	value: The score to be mapped
// 	label: The label for the x-axis according to the data
//
// returns:  None
function mapAxis(value, label) {
	cxScale.domain([d3.min(scores, value) - 10, d3.max(scores, value)]); // Domain (SATV scores increase by 10, so minus 10 to give a starting domain value)

	// Change the scaling of the x-axis based on the provided values
	d3.select('#x-axis')
		.transition()
		.duration(1500)
		.call(d3.axisBottom(cxScale));

	// Change the label of the x-axis based on what option was clicked
	d3.select('#x-axis-text')
		.text(label);

	// Change the mapping of the values based on what option was clicked
	d3.selectAll('circle').
		transition()
		.duration(1500)
		.attr('cx', d => cxScale(value(d)));
}


function translate(dx, dy) {
	cxScale.domain([cxScale.domain()[0] - dx, cxScale.domain()[1] - dx]);
	cyScale.domain([cyScale.domain()[0] - dy, cyScale.domain()[1] - dy]);

	d3.selectAll('circle')
		.data(data)
		.transition()
		.duration(1500)
		.attr('cx', d => cxScale(d.x))
		.attr('cy', d => cyScale(d.y));

	xAxis.transition()
		.duration(1500)
		.call(d3.axisBottom(cxScale));

	yAxis.transition()
		.duration(1500)
		.call(d3.axisLeft(cyScale));
}