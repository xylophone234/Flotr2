window.onload=function(){
	(function mouse_drag(container) {

  var
    d1 = [],
    d2 = [],
    d3 = [],
    options,
    graph,
    start,
    i;

  for (i = -40; i < 40; i += 0.01) {
    d1.push([i, Math.sin(1/i)]);
    d2.push([i, 1/i]);
    d3.push([i, Math.tan(i)]);
  }
      
  options = {
    xaxis: {min: -5, max: 5},
    yaxis: {min: -5, max: 5},
      title : 'Mouse Drag'
  };

  // Draw graph with default options, overwriting with passed options
  function drawGraph (opts) {

    // Clone the options, so the 'options' variable always keeps intact.
    var o = Flotr._.extend(Flotr._.clone(options), opts || {});

    // Return a new graph.
    return Flotr.draw(
      container,
      [d1,d2, d3 ],
      o
    );
  }

  graph = drawGraph();      

  function initializeDrag (e) {
    start = graph.getEventPosition(e);
    Flotr.EventAdapter.observe(container, 'flotr:mousemove', move);
    Flotr.EventAdapter.observe(container, 'flotr:mouseup', stopDrag);
  }

  function move (e, o) {
    var
      xaxis   = graph.axes.x,
      offset  = start.x - o.x,
      yaxis   = graph.axes.y,
      offsety = start.y - o.y;
    graph = drawGraph({
      xaxis : {
        min : xaxis.min + offset,
        max : xaxis.max + offset
      },
      yaxis : {
      	min : yaxis.min + offsety,
        max : yaxis.max + offsety
      }
    });
  }

  function stopDrag () {
    Flotr.EventAdapter.stopObserving(container, 'flotr:mousemove', move);
  }

  Flotr.EventAdapter.observe(container, 'flotr:mousedown', initializeDrag);

})(document.getElementById("container"));
}