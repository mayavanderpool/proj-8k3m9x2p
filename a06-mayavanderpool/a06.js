// 
// a06.js
// Skeleton for CSC444 Assignment 06, Fall 2025
// Joshua A. Levine <josh@arizona.edu>
//
// Modified by Maya Vanderpool <mayavanderpool@arizona.edu> to
// (1) makeScatterplot(), which is used to generically create plots
// (2) onBrush(), which is the callback used to interact 
// 
// This file completes the skeleton code to visualize
//  scatteplots of the iris dataset with joint interactions.
//



////////////////////////////////////////////////////////////////////////
// Global variables for the dataset and brushes

let data = iris;

// brush1 and brush2 will store the extents of the brushes,
// if brushes exist respectively on scatterplot 1 and 2.
//
// if either brush does not exist, brush1 and brush2 will
// hold the null value.

let brush1 = null;
let brush2 = null;

// clicked stores the data item which has been clicked on by the user

let clicked = null;

// Categorical color scale

const color = d3.scaleOrdinal(['lightgreen', '#e292fc', '#fac870']).domain(['setosa', 'versicolor', 'virginica']);

////////////////////////////////////////////////////////////////////////
// xAccessor and yAccessor allow this to be generic to different data
// fields

// Generic function to create multiple scatterplots.
// inputs:
// 	sel - Selected HTML id.
//	xAccessor - Data values to encode x-axis.
//	yAccessor - Data values to encode y-axis.
//	xLabel - String label for X-Axis.
//	yLabel - String label for Y-Axis.
//
// returns:  A  plot object for global use in the brushes.
function makeScatterplot(sel, xAccessor, yAccessor, xLabel, yLabel) {
	let width = 500;
	let height = 500;

	let svg = sel
		.append("svg")
		.attr("width", width).attr("height", height);

	// For readability domain min and max
	min_x = d3.min(iris, xAccessor);
	max_x = d3.max(iris, xAccessor);
	padding = 50;

	// Create a scale for the x axis
	let xScale = d3.scaleLinear()
		.domain([min_x, max_x])
		.range([padding, width - padding]);

	// For readability y min and max
	min_y = d3.min(iris, yAccessor);
	max_y = d3.max(iris, yAccessor);

	// Create a scale for the y axis
	let yScale = d3.scaleLinear()
		.domain([min_y, max_y])
		.range([height - padding, padding]);


	let brush = d3.brush();

	svg.append("g")
		.attr("class", "brush")
		.call(brush);

	// Create scatterplot
	let circles = svg.append("g")
		.selectAll("circle")
		.data(iris)
		.enter()
		.append('circle')
		.attr('cx', function (d, i) {
			return xScale(xAccessor(d));
		})
		.attr('cy', function (d, i) {
			return yScale(yAccessor(d));
		})
		.attr('r', function (d, i) {
			return 4;
		})
		.attr('fill', function (d, i) {
			return color(d.species);
		})
		.on('click', function (event, d) { // Behavior for when a circle is clicked
			let circled = d3.select('body').selectAll('circle');


			// Any previously clicked circle and their corresponding circle  in the alternate plot will return to their original radius
			if (clicked) {
				circled.filter(d => d == clicked).attr('r', 4)
				d3.selectAll('.pointLabel').remove() // Remove labels from previously clicked data
			}

			// Note the clicked circle data
			clicked = d;
			// Increase the radius of the clicked circle and its corresponding circle in the alternate plot
			circled.filter(d => d == clicked)
				.attr('r', 8)

			//////////////////////////////////////////////////
			// Extra Credit

			// Append text labels to the clicked data and corresponding data on alternate scatterplot

			plot1.svg.append('text')
				.attr('class', 'pointLabel')
				.text(
					'(' + d.sepalLength + ', ' + d.sepalWidth + ')'
				)
				.attr('x', plot1.xScale(d.sepalLength) - 22)
				.attr('y', plot1.yScale(d.sepalWidth) - 12);

			plot2.svg.append('text')
				.attr('class', 'pointLabel')
				.text('(' + d.petalLength + ', ' + d.petalWidth + ')')
				.attr('x', plot2.xScale(d.petalLength) - 22)
				.attr('y', plot2.yScale(d.petalWidth) - 12);

			displayData(d)

		});


	// Create an axis object for the x axis
	let xAxis = d3.axisBottom().scale(xScale);
	// Create an axis object for the y axis
	let yAxis = d3.axisLeft().scale(yScale);

	// Append x-axis
	svg.append('g')
		.attr('transform', 'translate(0,' + (height - padding) + ')') // Map x-axis to correct position
		.call(xAxis)
		.append('text')
		.attr('x', 250) // Center horizontally
		.attr('y', 40) // Offset from graph
		.attr('text-anchor', 'middle')
		.attr('fill', 'black')
		.text(xLabel);


	// Append y-axis
	svg.append('g')
		.attr('transform', 'translate(' + padding + ', 0)') // Map y-axis to correct position
		.call(yAxis)
		.append('text')
		.attr('x', -250) // Center vertically
		.attr('y', -40) // Offset from graph
		.attr('transform', 'rotate(-90)')
		.attr('text-anchor', 'middle')
		.attr('fill', 'black')
		.text(yLabel);

	return {
		svg: svg,
		brush: brush,
		xScale: xScale,
		yScale: yScale
	};
}

// Displays the data of the clicked circle in the HTML table.
// inputs:
// 	d - Clicked data.
//
// returns:  NONE
function displayData(d) {
	d3.select('#table-sepalLength').text(d.sepalLength);
	d3.select('#table-sepalWidth').text(d.sepalWidth);
	d3.select('#table-petalLength').text(d.petalLength);
	d3.select('#table-petalWidth').text(d.petalWidth);
	d3.select('#table-species').text(d.species);
	// Extra credit
	d3.select('#color-box').remove();
	d3.select('#table-species')
		.append('div')
		.attr('id', 'color-box')
		.style('background-color', color(d.species));
}
////////////////////////////////////////////////////////////////////////
// Setup plots

plot1 = makeScatterplot(d3.select("#scatterplot_1"),
	function (d) { return d.sepalLength; },
	function (d) { return d.sepalWidth; },
	"Sepal Length", "Sepal Width");

plot2 = makeScatterplot(d3.select("#scatterplot_2"),
	function (d) { return d.petalLength; },
	function (d) { return d.petalWidth; },
	"Petal Length", "Petal Width");

////////////////////////////////////////////////////////////////////////
// Callback during brushing

// Function for callback during brushing
// inputs:
// 	NONE
//
// returns:  NONE
function onBrush() {
	let allCircles = d3.select("body").selectAll("circle");
	if (brush1 === null && brush2 === null) {
		// Return the circles to their original state without any stroke
		allCircles
			.attr('stroke', 'none')
			.attr('stroke-width', 0);
		return;
	}


	// Selection filter function determines if a circle is within brush
	// inputs:
	// 	d - Circle data
	//
	// returns:  A boolean.
	function isSelected(d) {
		let brush1_select = true;
		let brush2_select = true;

		// Determines if circles are within brush1
		if (brush1) {
			let minX = plot1.xScale.invert(brush1[0][0]);
			let maxX = plot1.xScale.invert(brush1[1][0]);
			let minY = plot1.yScale.invert(brush1[1][1]);
			let maxY = plot1.yScale.invert(brush1[0][1]);

			brush1_select = (d.sepalLength >= minX && d.sepalLength <= maxX && d.sepalWidth >= minY && d.sepalWidth <= maxY);
		}

		// Determines if circles are within brush2
		if (brush2) {
			let minX = plot2.xScale.invert(brush2[0][0]);
			let maxX = plot2.xScale.invert(brush2[1][0]);
			let minY = plot2.yScale.invert(brush2[1][1]);
			let maxY = plot2.yScale.invert(brush2[0][1]);

			brush2_select = (d.petalLength >= minX && d.petalLength <= maxX && d.petalWidth >= minY && d.petalWidth <= maxY);
		}

		// Boolean that determines if circle data lies in both brushes
		return brush1_select && brush2_select
	}

	let selected = allCircles
		.filter(isSelected);
	let notSelected = allCircles
		.filter(function (d) { return !isSelected(d); });

	// selected and notSelected are d3 selections, write code to set their
	// attributes as per the assignment specification.

	selected
		.attr('stroke', 'blue')
		.attr('stroke-width', 2);

	notSelected
		.attr('stroke', 'none')
		.attr('stroke-width', 0);
}

////////////////////////////////////////////////////////////////////////
//
// d3 brush selection
//
// The "selection" of a brush is the range of values in either of the
// dimensions that an existing brush corresponds to. The brush selection
// is available in the event.selection object.
// 
//   e = event.selection
//   e[0][0] is the minimum value in the x axis of the brush
//   e[1][0] is the maximum value in the x axis of the brush
//   e[0][1] is the minimum value in the y axis of the brush
//   e[1][1] is the maximum value in the y axis of the brush
//
// The most important thing to know about the brush selection is that
// it stores values in *PIXEL UNITS*. Your logic for highlighting
// points, however, is not based on pixel units: it's based on data
// units.
//
// In order to convert between the two of them, remember that you have
// the d3 scales you created with the makeScatterplot function above.
//
// It is not necessary to use, but you might also find it helpful to
// know that d3 scales have a function to *invert* a mapping: if you
// create a scale like this:
//
//  s = d3.scaleLinear().domain([5, 10]).range([0, 100])
//
// then s(7.5) === 50, and s.invert(50) === 7.5. In other words, the
// scale object has a method invert(), which converts a value in the
// range to a value in the domain. This is exactly what you will need
// to use in order to convert pixel units back to data units.
//
//

function updateBrush1(event) {
	brush1 = event.selection;
	onBrush();
}

function updateBrush2(event) {
	brush2 = event.selection;
	onBrush();
}

plot1.brush
	.on("brush", updateBrush1)
	.on("end", updateBrush1);

plot2.brush
	.on("brush", updateBrush2)
	.on("end", updateBrush2);



	// Keep track of previously brushed data elements
				if (brushRanges[dim]) {
					brushedData = [
						yScales[dim].invert(brushRanges[dim][0]),
						yScales[dim].invert(brushRanges[dim][1])
					];
				}

				if (brushedData) {
					var invertBrush = [yScales[dim](brushedData[0]), yScales[dim](brushedData[1])];
					brushRanges[dim] = invertBrush;
					svg.selectAll('.brush')
						.filter(function (d) {
							return d === dim;
						})
						.call(brushes[dim].move, invertBrush);
				}