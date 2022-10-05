//source https://bobbyhadz.com/blog/javascript-get-value-of-textarea#:~:text=Use%20the%20value%20property%20to,an%20empty%20string%20is%20returned.

// source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea 

// source: https://javascript.plainenglish.io/create-an-array-of-alphabet-characters-in-javascript-with-this-simple-trick-930033079dd3 


const x = document.getElementById("input_area");
const submit_button = document.getElementById("submit-button");
const viz_button = document.getElementById("viz-button");

const re = /[A-Za-z]/g;
//empty hashtable
var h = {};

function alphabet_creator() {
  const alpha = Array.from(Array(26)).map((e, i) => i + 97);
  const alphabet = alpha.map((e) => String.fromCharCode(e));
  console.log(alphabet);
  return alphabet;
}

function create_alpha_dict(empty_table, alphabet_arr) {
  alphabet_arr.forEach(elem => {
    empty_table[elem] = 0;
  });
  // console.log(empty_table);
  return empty_table;
};

submit_button.addEventListener('click', function handleSubmit(event) {

  h = create_alpha_dict(h, alphabet_creator());

  var char_array = x.value.toLowerCase().match(re);
  char_array.forEach(function (i) {
    h[i] = (h[i] || 0) + 1;
  });
})

//Now do the d3 part
// set the dimensions and margins of the graph
const margin = {
  top: 30,
  right: 30,
  bottom: 70,
  left: 60
},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#data_viz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

viz_button.addEventListener('click', function (event) {
  console.log('nina', h);

  // X axis
  const x_axis = d3.scaleBand()
    .range([0, width])
    .domain(Object.keys(h))
    .padding(0.2);

  // Add Y axis
  const y_axis = d3.scaleLinear()
    .domain([0, 15])
    .range([height, 0]);

  // Append axes 
    
  svg.append("g")
    .call(d3.axisLeft(y_axis));

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x_axis))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  console.log('nina', h);

  // Add dots for each data point
  svg
    .selectAll("whatever")
    .data(Object.keys(h))
    .join("rect")
    .attr("x", d => x_axis(d))
    .attr("y", d => y_axis(h[d]))
    .attr("width", x_axis.bandwidth())
    .attr("height", d => height - y_axis(h[d]))
    .attr("fill", "#69b3a2");



    // .join("circle")
    // .attr("cx", function(d){
    //   console.log(d); 
    //   return x_axis(d)
    // })
    // .attr("cy", function(d){
    //   return y_axis(h[d]);
    // })
    // .attr("r", 3)
    // .style("fill", "gray");


})
