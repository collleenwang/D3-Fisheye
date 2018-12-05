(function() {
  let margin = { top: 20, left: 50, right: 20, bottom: 20 }

  let height = 500 - margin.top - margin.bottom
  let width = 960 - margin.left - margin.right
  var radius = 10

  let svg = d3
    .select('#beeswarm')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var yPositionScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, height])  

  var xPositionScale = d3.scalePoint()
    .domain(['F','M'])
    .range([0, width])
    .padding(0.5)

  var colorScale = d3.scaleOrdinal().range(['cyan' ,'magenta'])

  // d.Total_Months_Obama_NSC
  var forceX = d3.forceX(d => xPositionScale(d.Sex)).strength(0.25)
  var forceY = d3.forceY(d => yPositionScale(d.Total_Months_Obama_NSC)).strength(2)
  var forceCollide = d3.forceCollide(radius)

  var simulation = d3.forceSimulation()
    .force('x', forceX)
    .force('y', forceY) 
    .force('collide', forceCollide)
    .alphaDecay(0)
    .alpha(0.12)

  d3.csv("NSC_F_Directors.csv")
    .then(ready)

  function ready(datapoints) {
    svg.selectAll('.person')
      .data(datapoints)
      .enter()
      .append('circle')
      .classed('person', true)
      .attr('r', radius)
      .attr("fill", d => colorScale(d.Sex))
      .attr('cx', height / 2)
      .attr('cy', d => {
        return xPositionScale(d.Total_Months_Obama_NSC)
      })
      .attr('opacity', 0.25)

    // This is where you start from
    datapoints.forEach(d => {
      d.x = height / 2
      d.y = xPositionScale(d.Total_Months_Obama_NSC)
    })

    simulation.nodes(datapoints)
      .on('tick', tick) 

    var xAxis = d3.axisTop(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,0)')
      .call(xAxis)

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .attr('transform', 'translate(0,0)')
      .call(yAxis)


    function tick(){
      d3.selectAll('.person')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    }
  }
})()