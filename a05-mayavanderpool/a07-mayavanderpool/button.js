// 
// buttons.js
// CSC444 Assignment 07, Fall 2025
// Maya Vanderpool <mayavanderpool@arizona.edu>
//
// This file contains a button used to create an interaction that inverts axes to switch their minimum and maximum.
//

var buttonList = [
	{
		// Button 1
		id: "button-1",
		text: "Invert Axes",
		click: function () {
			dims.forEach(function (dim) {

				// Switches minimum and maximum of y-axes
				var prevRange = yScales[dim].range()
				yScales[dim].range([prevRange[1], prevRange[0]])

			});

			redrawElements()

		}
	}

];



// Create buttons from buttons.js in A04
d3.select("body")
	.selectAll("button")
	.data(buttonList)
	.enter()
	.append("button")
	.attr("id", function (d) { return d.id; })
	.text(function (d) { return d.text; })
	.on("click", function (event, d) {
		return d.click();
	});
