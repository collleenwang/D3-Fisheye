(function() {
  let margin = { top: 20, left: 50, right: 20, bottom: 20 }

  let height = 500 - margin.top - margin.bottom
  let width = 700 - margin.left - margin.right

  let svg = d3
    .select('#scatter')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0)

  // var xPositionScale = d3.scaleLinear()
  var xPositionScale = fisheye.scale(d3.scaleLinear)
    .domain([0,250])
    .range([0, width])
    .focus(width / 2)
    .distortion(2.5)

  var yPositionScale = d3.scaleLinear().domain([0,100]).range([height, 0])
  var colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  d3.csv('all_songs.csv')
    .then(ready)
    .catch(err => console.log('Failed on', err))

  function ready(datapoints) {
    
    svg
      .selectAll('circle')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('r', d => 7)
      .attr('cx', function(d) {
        return xPositionScale(d.BPM)
      })
      .attr('cy', function(d) {
        return yPositionScale(d.DANCE)
      })
      .attr('fill', function(d) {
        return colorScale(d.positiveness)
      })
      .attr('opacity', 0.25)
      .on('mouseover', function(d) {
        d3.select(this)
          .raise()
          .attr('opacity', 0.75)
          .attr('stroke', 'black')
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .attr('opacity', 0.25)
          .attr('stroke', 'none')
      })

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)

    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    function redraw() {
      // Get the mouse position
      let [mouseX, mouseY] = d3.mouse(this)

      // focus the x axis where the mouse is
      xPositionScale.focus(mouseX)

      // move the circles
      svg.selectAll('circle')
        .attr('cx', d => xPositionScale(d.BPM))

      // update the x axis
      svg.select('.x-axis').call(xAxis)
    }

    var drag = d3.drag()
      .on('drag', redraw)

    svg.on('mousemove', redraw)
      .on('click', redraw)
      .call(drag)
  }
})()
