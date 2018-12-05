(function() {
  let margin = { top: 20, left: 50, right: 20, bottom: 20 }

  let height = 100 - margin.top - margin.bottom
  let width = 700 - margin.left - margin.right

  let svg = d3
    .select('#mackerel')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0)

  var xPositionScale = fisheye.scale(d3.scaleLinear)
    .range([0, width])
    .focus(width / 2)
    // .distortion(2.5)

  var colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  d3.csv('mackerel.csv')
    .then(ready)
    .catch(err => console.log('Failed on', err))

  function ready(datapoints) {
    xPositionScale.domain([0, datapoints.length])

    svg.append('g')
      .selectAll('rect')
      .data(datapoints)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', '#fff880')
      .attr('stroke', 'black')
      .attr('height', height)
      .attr('x', (d, i) => xPositionScale(i))
      .attr('width', (d, i) => {
        return xPositionScale(i + 1) - xPositionScale(i)
      })

    function clamp(num, min, max){ 
      return Math.max(min, Math.min(max, num))
    }

    function redraw(d) {
      let [mouseX, mouseY] = d3.mouse(this)

      // focus the x axis where the mouse is
      xPositionScale.focus(mouseX)
      svg.selectAll('.bar')
        .attr('x', (d, i) => xPositionScale(i))
        .attr('width', (d, i) => {
          return xPositionScale(i + 1) - xPositionScale(i)
        })
    }

    var drag = d3.drag()
      .on('start', redraw)
      .on('drag', redraw)

    svg.on('mousemove', redraw)
      .on('click', redraw)
      .call(drag)
  }
})()
