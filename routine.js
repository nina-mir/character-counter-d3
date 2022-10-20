//source https://bobbyhadz.com/blog/javascript-get-value-of-textarea#:~:text=Use%20the%20value%20property%20to,an%20empty%20string%20is%20returned.

// source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea 

// source: https://javascript.plainenglish.io/create-an-array-of-alphabet-characters-in-javascript-with-this-simple-trick-930033079dd3 


const _x = document.getElementById("input_area");
const viz_button = document.getElementById("viz-button");

const re = /[A-Za-z]/g;
//empty hashtable
var h = [];

function alphabet_creator() {
  const alpha = Array.from(Array(26)).map((e, i) => i + 97);
  const alphabet = alpha.map((e) => String.fromCharCode(e));
  console.log(alphabet);
  return alphabet;
}

function create_alpha_dict(empty_table, alphabet_arr) {
  alphabet_arr.forEach((elem, index) => {

    var utility_1 = "key: " + String(elem);
    var utility_2 = "val: "+ String(0);
    empty_table[index] = {
      key: String(elem), 
      val: 0
    };
  });
  console.log(empty_table, empty_table.length);
  return empty_table;
}

//Now do the d3 part
// set the dimensions and margins of the graph
const margin = {
  top: 30,
  right: 30,
  bottom: 70,
  left: 60
},
  width = 460 - margin.left - margin.right,
  height = 460 - margin.top - margin.bottom;


// append the svg object to the body of the page

const svg = d3.select("#data_viz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

var svg_2 = d3.select("#bubble_chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)


viz_button.addEventListener('click', function(event) {

  h = create_alpha_dict(h, alphabet_creator());
  var char_array = _x.value.toLowerCase().match(re);
  char_array.forEach(function(elem) {
    // compute the corresponding index in the array
    var i = elem.charCodeAt(0) - 97;
    h[i].val = (h[i].val || 0) + 1;
  });

  console.log(h);

	// Size scale for the alphabet bubbles
  var size = d3.scaleLinear()
    .domain([0, _x.value.length])
    .range([5,20])  // circle will be between 7 and 50 px wide

  var data = h;
console.log(char_array.length);
//   data = [ {"key": "a", "value": 10},
//   {"key": "b", "value": 7},
//   {"key": "c", "value": 4}
//  ] ;  
  

// Scatter plot

// X axis
const x_axis = d3.scaleBand()
.range([0, width])
.domain(alphabet_creator())
.padding(0.2);

// Add Y axis
const y_axis = d3.scaleLinear()
.domain([0, _x.value.length])
.range([height, 0]);

// Append axes 

svg
.call(d3.axisLeft(y_axis));

svg.append("g")
.attr("transform", `translate(0, ${height})`)
.call(d3.axisBottom(x_axis))
.selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.style("text-anchor", "end");



  // Add dots for each data point
  svg
    .selectAll("whatever")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x_axis(d.key))
    .attr("y", (d) => y_axis(d.val))
    .attr("width", x_axis.bandwidth())
    .attr("height", (d) => height - y_axis(d.val))
    .attr("fill", "#69b3a2");


// bubble chart code is below 

// Initialize the circle: all located at the center of the svg area
  var node = svg_2.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "node")
      .attr("r", function(d){ 
      	// console.log(size(h[d]));
      	return size(d.val)
      })
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", function(d){ return null})
      .style("fill-opacity", 0.6)
      .attr("stroke", "black")
      .style("stroke-width", 1);
      // commenting tooltip behaviors for now
      /* .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave) */
     /*  .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended)); */
           

 // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
     .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(0.1))// Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(0.5).radius(function(d){ return size(d.val) +1 }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha ' value is low enough), simulations will stop.
 simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
      });

  // What happens when a circle is dragged?
 /*  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0.03);
    d.fx = null;
    d.fy = null;
  } */



})
