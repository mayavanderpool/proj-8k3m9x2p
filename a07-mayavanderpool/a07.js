// 
// a07.js
// Template for CSC444 Assignment 07, Fall 2025
// Joshua A. Levine <josh@arizona.edu>
//
// Modified by Maya Vanderpool <mayavanderpool@arizona.edu> to 
// complete the template code.
//
// This file initializes and draws the parallel coordinates plots. 
//



////////////////////////////////////////////////////////////////////////
// Global variables for the dataset 

let data = penguins
//this would instead work with a smaller random subset:
//let data = d3.shuffle(penguins).slice(0,50)

// dims will store the four axes in left-to-right display order
let dims = [
	"bill_length",
	"bill_depth",
	"flipper_length",
	"body_mass"
];

// mapping from dimension id to dimension name used for text labels
let dimNames = {
	"bill_length": "Bill Length",
	"bill_depth": "Bill Depth",
	"flipper_length": "Flipper Length",
	"body_mass": "Body Mass",
};




////////////////////////////////////////////////////////////////////////
// Global variables for the svg

let width = dims.length * 125;
let height = 500;
let padding = 50;

let svg = d3.select("#pcplot")
	.append("svg")
	.attr("width", width).attr("height", height);




////////////////////////////////////////////////////////////////////////
// Initialize the x and y scales, axes, and brushes.  
//  - xScale stores a mapping from dimension id to x position
//  - yScales[] stores each y scale, one per dimension id
//  - axes[] stores each axis, one per id
//  - brushes[] stores each brush, one per id
//  - brushRanges[] stores each brush's event.selection, one per id

let xScale = d3.scalePoint()
	.domain(dims)
	.range([padding, width - padding]);

let yScales = {};
let axes = {};
let brushes = {};
let brushRanges = {};

// For each dimension, we will initialize a yScale, axis, brush, and
// brushRange
dims.forEach(function (dim) {
	//create a scale for each dimension
	yScales[dim] = d3.scaleLinear()
		.domain(d3.extent(data, function (datum) { return datum[dim]; }))
		.range([height - padding, padding]);

	//set up a vertical axis for each dimensions
	axes[dim] = d3.axisLeft()
		.scale(yScales[dim])
		.ticks(10);

	//set up brushes as a 20 pixel width band
	//we will use transforms to place them in the right location
	brushes[dim] = d3.brushY()
		.extent([[-10, padding], [+10, height - padding]]);

	//brushes will be hooked up to their respective updateBrush functions
	brushes[dim]
		.on("brush", updateBrush(dim))
		.on("end", updateBrush(dim))

	//initial brush ranges to null
	brushRanges[dim] = null;
});




////////////////////////////////////////////////////////////////////////
// Make the parallel coordinates plots 


// Color scale
const colorScale = d3.scaleOrdinal(['#569afaff', '#d86efbff', '#6aa14cff']).domain(['Adelie', 'Gentoo', 'Chinstrap', '']);

// add the actual polylines for data elements, each with class "datapath"
svg.append("g")
	.selectAll(".datapath")
	.data(data)
	.enter()
	.append("path")
	.attr("class", "datapath")
	// From example Jason Davies' Parallel Coordinate block, draws the paths
	.attr('d', function (d) {
		return d3.line()(
			dims.map(function (dim) {
				return [xScale(dim), yScales[dim](d[dim])];
			})
		);
	})
	.attr('stroke', function (d) {
		return colorScale(d.species);
	})
	.attr('opacity', 0.75)
	.attr('fill', 'none');

// add the axis groups, each with class "axis"
svg.selectAll(".axis")
	.data(dims)
	.enter()
	.append('g')
	.attr('class', 'axis')
	.attr('transform', function (d) {
		return 'translate(' + xScale(d) + ', 0)';
	})
	// Call the axes functions
	.each(function (d) {
		d3.select(this).call(axes[d])
	});

// add the axes labels, each with class "label"
svg.selectAll(".label")
	.data(dims)
	.enter()
	.append('text')
	.attr('class', 'label')
	.attr('transform', function (d) {
		return 'translate(' + xScale(d) + ', 25)';
	})
	// Center label
	.attr('text-anchor', 'middle')
	// Set label
	.text(function (d) {
		return dimNames[d];
	})
	.on('click', onClick);

// add the brush groups, each with class ".brush" 
svg.selectAll(".brush")
	.data(dims)
	.enter()
	.append('g')
	.attr('class', 'brush')
	.attr('transform', function (d) {
		return 'translate(' + xScale(d) + ', 0)';
	})
	// Call brush function for initialization
	.each(function (d) {
		d3.select(this).call(brushes[d])
	});



////////////////////////////////////////////////////////////////////////
// Interaction Callbacks

// Callback for swapping axes when a text label is clicked.
function onClick(event, d) {
	var length = dims.length;
	var index = dims.indexOf(d);
	var temp = dims[index];

	// Swapping axes when axis clicked is at the end 
	if (index == length - 1) {
		dims[index] = dims[index - 1]
		dims[index - 1] = temp;
	}
	// Swapping axes otherwise
	else {
		dims[index] = dims[index + 1]
		dims[index + 1] = temp;
	}

	// Rebuild xScale
	xScale.domain(dims)

	// Turned into helper function
	redrawElements()


}

// This helper function redraws the elements. Removed into helper function to simplify extra credit.
// inputs:
// 	NONE
//
// returns:  NONE
function redrawElements() {
	// Redraw axes
	svg.selectAll('.axis')
		.transition()
		.duration(1000)
		.attr('transform', function (d) {
			return 'translate(' + xScale(d) + ', 0)';
		})
		// Call the axes functions 
		.each(function (d) {
			d3.select(this).call(axes[d])
		});

	// Redraw label
	svg.selectAll('.label')
		.transition()
		.duration(1000)
		.attr('transform', function (d) {
			return 'translate(' + xScale(d) + ', 25)';
		});

	// Redraw brushes
	svg.selectAll(".brush")
		.transition()
		.duration(1000)
		.attr('transform', function (d) {
			return 'translate(' + xScale(d) + ', 0)';
		});

	// Redraw data paths
	svg.selectAll('.datapath')
		.transition()
		.duration(1000)
		.attr('d', function (d) {
			return d3.line()(
				dims.map(function (dim) {
					return [xScale(dim), yScales[dim](d[dim])];
				})
			);
		});
}

// Returns a callback function that calls onBrush() for the brush
// associated with each dimension
function updateBrush(dim) {
	return function (event) {
		brushRanges[dim] = event.selection;
		onBrush();
	};
}

// Callback when brushing to select elements in the PC plot
function onBrush() {
	let allLines = d3.selectAll(".datapath");

	// Selection filter function determines if data is within brush.
	// inputs:
	// 	d - penguins data elements
	//
	// returns:  A boolean.
	function isSelected(d) {
		// Checks all dimensions
		return dims.every(function (dim) {
			// Checks if axis's brush is turned off
			if (brushRanges[dim] == null) {
				return true;
			}

			var yPixel = yScales[dim](d[dim]);
			// Returns true if data element is in range
			return brushRanges[dim][0] <= yPixel && yPixel <= brushRanges[dim][1]

		})
	}

	let selected = allLines
		.filter(isSelected);
	let notSelected = allLines
		.filter(function (d) { return !isSelected(d); });

	// Update the style of the selected and not selected data
	selected.attr('opacity', 0.75);
	notSelected.attr('opacity', 0.1);
}

