function _1(md){return(
md`# Assignment 3
### Isak Svarvar
A couple of visualizations related to life expectancy.

First Visualization: Life expectancy in Finland<br>
Second Visualization: Life expectancy in different countries<br>
Third Visualization: Life expectancy compared to child mortality




`
)}

function _2(md){return(
md`---
#### Chart 1: Life expectancy in Finland`
)}

function _chart(d3,width,height,data,margin,formatDate)
{  
  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  
  //define scales
  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.amount)])
    .range([height - margin.bottom, margin.top])

  let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
  
  //create gradient effect
  let areaGradient = svg.append("defs")
                        .append("linearGradient")
                        .attr("id","areaGradient")
                        .attr("x1", "0%").attr("y1", "0%")
                        .attr("x2", "0%").attr("y2", "100%");

      areaGradient.append("stop")
                  .attr("offset", 0.2)
                  .attr("stop-color", "#2f5061")
                  .attr("stop-opacity", 0.6);

      areaGradient.append("stop")
                  .attr("offset", 0.96)
                  .attr("stop-color", "#4297a0")
                  .attr("stop-opacity", 0.05);
  //define line
  let line = d3.line()
      .defined(d => d.amount > 0)
      .x(d => x(d.date))
      .y(d => y(d.amount))
  //define area
  let area = d3.area()
      .defined(d => d.amount > 0)
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.amount))
  
  //draw line
  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .style("stroke","url(#areaGradient)")
      .attr("d", line);

  //fill area (gradient)
  svg.append("path")
      .datum(data)
      .attr("class", "area")
      .style("fill", "url(#areaGradient)")
      .attr("d", area);

   //define y axis
  let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class","y-axis")
    .call(d3.axisLeft(y)
         .tickSize(-width)
         .tickValues([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]))
  //define x axis
  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class","x-axis")
    .call(d3.axisBottom(x)
            .tickFormat(formatDate)
            .ticks(27))
  //draw axis
  svg.append("g")
      .call(yAxis);
  
  svg.append("g")
      .call(xAxis);
   
  return svg.node();
}


function _4(md){return(
md`---
#### Chart 2: Life expectancy comparison between different countries`
)}

function _chart2(margin3,d3,format,width,height3,formatDate,data3)
{  
  //x y axis
  let yAxis = g => g
    .attr("transform", `translate(${margin3.left},0)`)
    .attr("class","y-axis")
    .call(d3.axisLeft(y)
            .tickFormat(format)
            .tickSize(-width)
            .tickValues([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]))

  let xAxis = g => g
    .attr("transform", `translate(0,${height3 - margin3.bottom})`)
    .attr("class","x-axis")
    .call(d3.axisBottom(x)
            .tickFormat(formatDate)
            .ticks(20))
  
  //declare scales
  let x = d3.scaleTime()
    .domain(d3.extent(data3.dates))
    .range([margin3.left, width - margin3.right])

  let y = d3.scaleLinear()
    .domain([0,100])
    .range([height3 - margin3.bottom, margin3.top])

  //define line
  let line = d3.line()
    .curve(d3.curveBasis)
    .defined(d => d > 0)
    .x((d,i) => x(data3.dates[i]))
    .y(d => y(d));

  //FUNCTION: Hover animation
  function hover(svg, path) {
  
  svg
    .on("mousemove", moved)
    .on("mouseenter", entered)
    .on("mouseleave", left);

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("y", -8);

  function moved(event) {
    event.preventDefault();
    const pointer = d3.pointer(event, this);
    const xm = x.invert(pointer[0]);
    const ym = y.invert(pointer[1]);
    const i = d3.bisectCenter(data3.dates, xm);
    const s = d3.least(data3.series, d => Math.abs(d.values[i] - ym));
    path.attr("stroke", d => d === s ? null : "#b1d4e0")
        .attr("stroke-opacity", d => d === s ? null : 0.5)
        .attr("stroke-width", d => d === s ? null : 0.5)
         .filter(d => d === s)
         .raise();
    dot.attr("transform", `translate(${x(data3.dates[i])},${y(s.values[i])})`);
    dot.select("text")       
      .html(`\
 ${s.country}<br />\
 ${s.values[i]}<br />\
`);
  }

  function entered() {
    path.style("mix-blend-mode", null)
        .attr("stroke", "#145da0");
    dot.attr("display", null);
  }

  function left() {
    path.style("mix-blend-mode", "multiply")
        .attr("stroke", null)
        .attr("stroke-opacity", null)
        .attr("stroke-width", null);   
    dot.attr("display", "none");
  }
}

  
  //create chart
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height3]);
    
  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#2e8bc0")
      .attr("stroke-width", 1.2)
      .attr("stroke-opacity", 1)
    .selectAll("path")
    .data(data3.series)
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", d => line(d.values));

   svg.append("g")
      .call(yAxis);
  
  svg.append("g")
      .call(xAxis);

  svg.call(hover, path);
   
  return svg.node();
}


function _6(md){return(
md`---
#### Chart 3: Life expectancy (in blue) compared to Child mortality percentage (in red)`
)}

function _dataswap(Inputs){return(
Inputs.radio(["finland", "south korea"], {value: "finland", label: "Country"})
)}

function _chart3(d3,width,height,data4,margin,formatDate,dataswap,data5)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  //define scales and axis
  let x = d3.scaleTime()
    .domain(d3.extent(data4, d => d.year))
    .range([margin.left, width - margin.right])

  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class","x-axis")
    .call(d3.axisBottom(x)
            .tickFormat(formatDate)
            .ticks(10))
  let y = d3.scaleLinear()
    .domain([0, d3.max(data4, d => d.life)])
    .range([height - margin.bottom, margin.top])

  let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class","y-axis")
    .call(d3.axisLeft(y)
         .tickValues([0,10, 20, 30, 40, 50, 60, 70, 80, 90])
         .tickSize(-width))

  //define line
  let line = d3.line()
      .defined( d => d.mort > 0)
      .x(d => x(d.year))
      .y(d => y(d.mort))

  let line2 = d3.line()
      .defined( d => d.life > 0)
      .x(d => x(d.year))
      .y(d => y(d.life))

  //function to swap data
  function chartswap(){
    if(dataswap == "finland"){
      return data4;
    } else{
      return data5;
    }
  }

  //draw lines
  svg.append("path")
      .datum(chartswap())
      .attr("class", "line")
      .attr("d", line)
      .style("stroke", "#f00")
      .transition()
      .duration(5000)
      .ease(d3.easeLinear)
      .attrTween("stroke-dasharray", function() {
      const length = this.getTotalLength();
      return d3.interpolate(`0,${length}`, `${length},${length}`);
    });

  svg.append("path")
      .datum(chartswap)
      .attr("class", "line")
      .attr("d", line2)
      .transition()
      .style("stroke", "#44f")
      .duration(5000)
      .ease(d3.easeLinear)
      .attrTween("stroke-dasharray", function() {
      const length = this.getTotalLength();
      return d3.interpolate(`0,${length}`, `${length},${length}`);
    });
     
    
  svg.append("g")
      .call(yAxis);
  
  svg.append("g")
      .call(xAxis);
   
  return svg.node();
}


function _9(md){return(
md`---
 ### Data`
)}

function _10(md){return(
md`Here's where all the data is imported`
)}

function _data(d3,parseDate){return(
d3.csv( "https://gist.githubusercontent.com/IsakSvarvar/25f15d3ba53f91498fa5609cbc6820bc/raw/c56750769ece95b08668ce8721a310cffb2decfa/lifeXpectFin.csv", ({year, value}) => ({date: parseDate(year), amount: +value}))
)}

function _dataset3(d3){return(
d3.csv("https://gist.githubusercontent.com/IsakSvarvar/3a3da6f4ec99d54c4e09ae7b96caa6fb/raw/68c0b5c40f47d2e178247c64412f6c76d3622f21/lifexpect.csv", (d => {
  const {country, ...rest} = d
  return {
    values: Object.values(rest).map(Number),
    country,
  };
}))
)}

function _data3(dataset3,d3){return(
{ series: dataset3, dates: dataset3.columns.slice(1).map(d3.timeParse("%Y")) }
)}

function _data4(d3,parseDate){return(
d3.csv( "https://gist.githubusercontent.com/IsakSvarvar/f65f242c08d27d5c9c2d07c8a157ecb8/raw/ffd2aafe82933d1dfd928536a882d4a3233ea6c6/lifedeath.csv", ({year, life, mort}) => ({year: parseDate(year), life: +life, mort:+mort/10}))
)}

function _data5(d3,parseDate){return(
d3.csv( "https://gist.githubusercontent.com/IsakSvarvar/fc207f619e32bd958897dfadf11b85c6/raw/233792fb5193982e74cd28866d8894e04b40fdac/lifedeathsk.csv", ({year, life, mort}) => ({year: parseDate(year), life: +life, mort:+mort/10}))
)}

function _parseDate(d3){return(
d3.timeParse("%Y")
)}

function _formatDate(d3){return(
d3.timeFormat("%Y")
)}

function _format(d3){return(
d3.format(".2s")
)}

function _19(md){return(
md` 
---
### Appendix`
)}

function _d3(require){return(
require("d3@6")
)}

function _margin(){return(
{top: 20, right: 20, bottom: 30, left: 30}
)}

function _margin3(){return(
{top: 20, right: 20, bottom: 30, left: 30}
)}

function _height(){return(
500
)}

function _height3(){return(
600
)}

function _style(html){return(
html`<style>

@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');

body {
  font-family: 'Raleway', sans-serif;
  font-weight:400;
  font-size:13px;
  background-color:white;
}

svg {
  background-color:#f7f7f7;
}

/*Defining text stylings*/

h1 {
  margin-top: 50;
  font-size: 1.3rem;
  color:#004369;
  margin-bottom: 50;
  font-weight:600;
}

h2 {
  margin-top: 5px;
  font-size: 1rem;
  margin-bottom: 5px;
  color:#004369;
  font-weight:500;
}

h3 {
  margin-top: 5px;
  font-size: 1rem;
  margin-bottom: 10px;
  color:#004369;
  font-weight:400;
}

h4 {
  margin-top: 5px;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color:#ff6501;
  font-weight:300;
}

h5 {
  margin-top: 5px;
  font-size: 1rem;
  margin-bottom: 0px;
  color:#004369;
  font-weight:400;
}

a:link, a:active, a:visited {
  margin-top:0.5px;
  color:#662e9b;
  font-size:12px;
  font-weight:500;
}

a:hover {
  margin-top:0.5px;
  color:#662e9b;
  font-size:12px;
  font-weight:500;
}

/*Defining axis stylings*/

.y-axis text, .x-axis text {
  font-family: 'Raleway', sans-serif;
  font-weight:400;
  font-size:10px;
  opacity:1;
  fill:#495867;
}

.x-axis path {
  fill:none;
  stroke-width:0;
  stroke-opacity:1;
  stroke:#495867;
}

.y-axis path {
  fill:none;
  stroke-width:0;
  stroke-opacity:1;
  stroke:#495867;
}

.y-axis line {
  fill:none;
  stroke-width:0.5;
  stroke-opacity:0.5;
  stroke:#4c5355;
  stroke-dasharray:2;
}

.x-axis line {
  fill:none;
  stroke-width:0;
  stroke-opacity:1;
  stroke:#495867;
  stroke-dasharray:2;
}

/*Defining chart stylings*/

.line {
   fill:none;
   stroke:#04BFAD;
   stroke-width:1px;
   opacity:1;
}

</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","margin","formatDate"], _chart);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("chart2")).define("chart2", ["margin3","d3","format","width","height3","formatDate","data3"], _chart2);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("viewof dataswap")).define("viewof dataswap", ["Inputs"], _dataswap);
  main.variable(observer("dataswap")).define("dataswap", ["Generators", "viewof dataswap"], (G, _) => G.input(_));
  main.variable(observer("chart3")).define("chart3", ["d3","width","height","data4","margin","formatDate","dataswap","data5"], _chart3);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("data")).define("data", ["d3","parseDate"], _data);
  main.variable(observer("dataset3")).define("dataset3", ["d3"], _dataset3);
  main.variable(observer("data3")).define("data3", ["dataset3","d3"], _data3);
  main.variable(observer("data4")).define("data4", ["d3","parseDate"], _data4);
  main.variable(observer("data5")).define("data5", ["d3","parseDate"], _data5);
  main.variable(observer("parseDate")).define("parseDate", ["d3"], _parseDate);
  main.variable(observer("formatDate")).define("formatDate", ["d3"], _formatDate);
  main.variable(observer("format")).define("format", ["d3"], _format);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("margin3")).define("margin3", _margin3);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("height3")).define("height3", _height3);
  main.variable(observer("style")).define("style", ["html"], _style);
  return main;
}
