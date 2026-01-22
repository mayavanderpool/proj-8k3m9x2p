// 
// a10.js
// Template code for CSC444 Assignment 10, Fall 2025
// Joshua A. Levine <josh@arizona.edu>
//
// Modified by Maya Vanderpool <mayavanderpool@arizona.edu> to
// implement an editable transfer function to be used in concert
// with the volume renderer defined in volren.js by completing the 
// template code.
//




////////////////////////////////////////////////////////////////////////
// Global variables and helper functions

// colorTF and opacityTF store a list of transfer function control
// points.  Each element should be [k, val] where k is a the scalar
// position and val is either a d3.rgb or opacity in [0,1] 
let colorTF = [];
let opacityTF = [];

// D3 layout variables
let size = 500;
let svg = null;

// Variables for the scales
let xScale = null;
let yScale = null;
let colorScale = null;

//padding 
let padding = 50

// 1000 rectangles
let rects = 1000



////////////////////////////////////////////////////////////////////////
// Visual Encoding portion that handles the d3 aspects

// Function to create the d3 objects

// This function creates the d3 objects
// Input: None
// Return: None
function initializeTFunc() {
	svg = d3.select("#tfunc")
		.append("svg")
		.attr("width", size)
		.attr("height", size);

	//Initialize the axes 
	let xAxis = d3.axisBottom();
	svg.append('g')
		.attr('class', 'xAxis')
		.attr('transform', 'translate(0,' + (size - padding) + ')');

	let yAxis = d3.axisLeft();
	svg.append('g')
		.attr('class', 'yAxis')
		.attr('transform', 'translate(' + padding + ', 0)');

	//Initialize path for the opacity TF curve
	svg.append('polyline') // polyline
		.attr('class', 'opacityLine')
		.attr('fill', 'none')
		.attr('stroke', 'black')
		.attr('stroke-width', 1);

	//Initialize circles for the opacity TF control points
	let drag = d3.drag()
		.on('start', dragstarted)
		.on('drag', dragged)
		.on('end', dragended);

	svg.append("g")
		.attr("class", "points")
		.selectAll("circle")
		.data(opacityTF)
		.enter()
		.append("circle")
		.attr("index", (d, i) => i)
		.style('cursor', 'pointer')
		.call(drag);

	//Create the color bar to show the color TF
	svg.append('g').attr('class', 'colorbar');

	//After initializing, set up anything that depends on the TF arrays
	updateTFunc();
}

// Call this function whenever a new dataset is loaded or whenever
// colorTF and opacityTF change

// This function updates the TF whenever a new dataset is loaded or whenever colorTF and opacityTF change
// Input: None
// Return: None
function updateTFunc() {
	//update scales

	// map range of data values
	xScale = d3.scaleLinear()
		.domain(dataRange).range([padding, size - padding]);

	// map from the space of possible opacities
	yScale = d3.scaleLinear()
		.domain([0, 1]).range([size - padding, padding]);

	//  update polyline
	svg.select('.opacityLine')
		.datum(opacityTF)
		.attr('points', opacityTF.map(d => xScale(d[0]) + ',' + yScale(d[1])).join(' '));

	//hook up axes to updated scales
	d3.select('.xAxis')
		.call(d3.axisBottom(xScale));
	d3.select('.yAxis')
		.call(d3.axisLeft(yScale));

	//update opacity curves
	// set of discrete circles
	d3.select(".points")
		.selectAll("circle")
		.data(opacityTF)
		.join('circle')
		.attr('cx', d => xScale(d[0]))
		.attr('cy', d => yScale(d[1]))
		.attr('r', 5)
		.attr('fill', d => colorScale(d[0]))
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr("index", (d, i) => i);

	// More rectangles for smoother color
	let smooth = d3.scaleLinear().domain([0, rects]).range(dataRange);
	let color = d3.range(rects).map(d => [smooth(d), colorScale(smooth(d))]);

	let width = (size - 2 * padding) / color.length;

	//update colorbar
	svg.select('.colorbar')
		.selectAll('rect')
		.data(color)
		.join('rect')
		.attr('x', (d, i) => padding + i * width)
		.attr('y', size - 25)
		.attr('width', width + 1)
		.attr('height', 25)
		.attr('fill', d => d[1]);
}


// To start, let's reset the TFs and then initialize the d3 SVG canvas
// to draw the default transfer function

resetTFs();
initializeTFunc();


////////////////////////////////////////////////////////////////////////
// Interaction callbacks

// Will track which point is selected
let selected = null;

// Called when mouse down
function dragstarted(event, d) {
	selected = parseInt(d3.select(this).attr("index"));
}

// Called when mouse drags

// This function handles drag events
// Input: event, datapoint
// Return: None
function dragged(event, d) {
	if (selected != null) {
		let pos = [];
		pos[0] = xScale.invert(event.x);
		pos[1] = yScale.invert(event.y);

		//based on pos and selected, update opacityTF
		let xPos = pos[0] // x position
		let yPos = Math.max(0, Math.min(1, pos[1])); // constrain to [0,1]

		//  only allow endpoint moving up or down
		if (selected === 0) {
			xPos = dataRange[0];
		}
		//  only allow endpoint moving up or down
		else if (selected === opacityTF.length - 1) {
			xPos = dataRange[1];
		}
		// interior point stay between left and right point
		else {
			let minPosX = opacityTF[selected - 1][0];
			let maxPosX = opacityTF[selected + 1][0];
			xPos = Math.max(minPosX, Math.min(maxPosX, pos[0]));
		}

		opacityTF[selected] = [xPos, yPos];

		//update TF window
		updateTFunc();

		//update volume renderer
		updateVR(colorTF, opacityTF);
	}
}

// Called when mouse up
function dragended() {
	selected = null;
}



////////////////////////////////////////////////////////////////////////
// Function to read data

// Check VR was intialized
let init = false;

// Function to process the upload
function upload() {
	if (input.files.length > 0) {
		let file = input.files[0];
		console.log("You chose", file.name);

		let fReader = new FileReader();
		fReader.readAsArrayBuffer(file);

		fReader.onload = function (e) {
			let fileData = fReader.result;

			//load the .vti data and initialize volren
			initializeVR(fileData);

			//upon load, we'll reset the transfer functions completely
			resetTFs();

			//Update the tfunc canvas
			updateTFunc();

			//update the TFs with the volren
			updateVR(colorTF, opacityTF, false);

			// VR initialized
			init = true
		}
	}
}

// Attach upload process to the loadData button
var input = document.getElementById("loadData");
input.addEventListener("change", upload);



////////////////////////////////////////////////////////////////////////
// Functions to respond to buttons that switch color TFs

function resetTFs() {
	makeSequential();
	makeOpacity();
}



// Make a default opacity TF

// This is a default opacity TF
// Input: None
// Return: None
function makeOpacity() {

	opacityTF = [];
	// at least five control points
	for (let i = 0; i < 5; i++) {
		let t = i / 4
		let val = dataRange[0] + t * (dataRange[1] - dataRange[0]);
		opacityTF.push([val, t]);
	}
}


// Make a sequential color TF

// This is a sequential color TF
// Input: None
// Return: None
function makeSequential() {
	// Specify the variable colorScale
	colorScale = d3.scaleSequential(d3.interpolateCool).domain(dataRange);

	// Specify the variable colorTF
	colorTF = [];
	// 15 control points
	for (let i = 0; i < 15; i++) {
		let t = i / 14;
		let val = dataRange[0] + t * (dataRange[1] - dataRange[0]);
		colorTF.push([val, d3.rgb(d3.interpolateCool(t))]);
	}
}


// Make a diverging color TF

// This is a diverging color TF
// Input: None
// Return: None
function makeDiverging() {
	// Specify the variable colorScale
	colorScale = d3.scaleSequential(d3.interpolateSpectral).domain(dataRange);

	// Specify the variable colorTF
	colorTF = [];
	// 15 control points
	for (let i = 0; i < 15; i++) {
		let t = i / 14;
		let val = dataRange[0] + t * (dataRange[1] - dataRange[0]);
		colorTF.push([val, d3.rgb(d3.interpolateSpectral(t))]);
	}
}


// Make a categorical color TF

// This is a categorical color TF
// Input: None
// Return: None
function makeCategorical() {
	// Specify the variable colorScale
	colorScale = d3.scaleQuantize().domain(dataRange).range(d3.schemePaired);

	// Specify the variable colorTF
	colorTF = [];
	// 12 control points
	for (let i = 0; i < 12; i++) {
		let val = dataRange[0] + (i / 12) * (dataRange[1] - dataRange[0]);
		colorTF.push([val, d3.rgb(d3.schemePaired[i])]);
	}
}

// Configure callbacks for each button
d3.select("#sequential").on("click", function () {
	makeSequential();
	updateTFunc();
	// only if VR initialized
	if (init) {
		updateVR(colorTF, opacityTF, false);
	}
	updateButton(this);
});

// Configure callbacks for each button
d3.select("#diverging").on("click", function () {
	makeDiverging();
	// only if VR initialized
	updateTFunc();
	if (init) {
		updateVR(colorTF, opacityTF, false);
	}
	updateButton(this);
});

// Configure callbacks for each button
d3.select("#categorical").on("click", function () {
	makeCategorical();
	// only if VR initialized
	updateTFunc();
	if (init) {
		updateVR(colorTF, opacityTF, true);
	}
	updateButton(this);
});

// This updates the button clicked on to have the color of the gradient as a border
// Input: Button selected
// Return: None
function updateButton(button) {
	d3.selectAll('.btn').style('border', '1px solid black').style('border-image', 'none');

	let smooth = d3.scaleLinear().domain([0, rects]).range(dataRange);
	let color = d3.range(11).map(i => colorScale(smooth(i * 100)).toString());

	d3.select(button)
		.style('border', '6px solid')
		.style('border-image', `linear-gradient(to right, ${color.join(', ')}) 1`);
}