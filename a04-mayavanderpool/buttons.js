// 
// buttons.js
// Buttons Example for CSC444 Assignment 04, Fall 2025
// Joshua A. Levine <josh@arizona.edu>
// Modified by Maya Vanderpool <mayavanderpool@arizona.edu>
//
// This file provides a simple example of using d3 to create buttons in
// an html webpage.  The buttons are created from a list of buttons
// (called buttonList) that specifies the id, display text, and
// event-handler function that should be called for each button click.
//
// All buttons are inserted by d3 within a div whose id is main
//

// New button list 

var buttonList = [
	{
		// Button 1
		id: "colormap-button-1",
		text: "Button 1",
		click: function () {
			// Interpolates linearly using .scaleLinear()
			var color = d3.scaleLinear().domain([970,
	1010, 1050]).range(['blue', 'white', 'yellow']);

			// Transitions to color
			d3.selectAll('circle').transition().duration(1500).attr('fill', d => color(d.GPA))

		}
	},
	{
		// Button 2
		id: "colormap-button-2",
		text: "Button 2",
		click: function () {
			// Continous color scale using .scaleDiverging()
			var color = d3.scaleDiverging().domain([d3.min(scores, d => d.GPA),
			d3.mean(scores, d => d.GPA), d3.max(scores, d => d.GPA)]).range(['#2c7bb6', '#ffffbf', '#d7191c']);

			// Transitions to color
			d3.selectAll('circle').transition().duration(1500).attr('fill', d => color(d.GPA))

		}
	},
	{
		// Button 3
		id: "colormap-button-3",
		text: "Button 3",
		click: function () {
			// Quantized color scale using d3.scaleQuantize()
			var color = d3.scaleQuantize()
				.domain([d3.min(scores, d => d.GPA),
				d3.max(scores, d => d.GPA)])
				.range(['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c']);

			// Transitions to color
			d3.selectAll('circle').transition().duration(1500).attr('fill', d => color(d.GPA))

		}
	}, {
		// SATV Button (extra credit)
		id: "SATV",
		text: "SATV",
		click: function () {
			// Define cxScale(_) to map SATV to x position
			mapAxis(d => d.SATV, "SATV")
		}
	}, {

		// SATV-cumulative (extra credit)
		id: "SAT-cumulative",
		text: "SAT-cumulative",
		click: function () {
			// Define cxScale(_) to map SATV+SATM to x position
			mapAxis(d => d.SATV + d.SATM, "SAT-cumulative")

		}
	}

];

// In the same way that we have been using d3 to create SVG elements,
// we can use d3 to create buttons and give them attributes.
//
// The only new feature in the code below is the use of the on()
// method, which defines *event handlers*.  In this case, we are
// telling d3 to call a function in the event that a button is
// clicked.

d3.select("#controls")
	.selectAll("button")
	.data(buttonList)
	.enter()
	.append("button")
	.attr("id", function (d) { return d.id; })
	.text(function (d) { return d.text; })
	.on("click", function (event, d) {
		return d.click();
	});
