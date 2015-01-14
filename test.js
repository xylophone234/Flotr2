window.onload = function() {
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
      d1.push([i, Math.sin(1 / i)]);
      d2.push([i, 1 / i]);
      d3.push([i, Math.tan(i)]);
    }

    options = {
      xaxis: {
        min: -5,
        max: 5
      },
      yaxis: {
        min: -5,
        max: 5
      },
      title: 'Mouse Drag'
    };

    // Draw graph with default options, overwriting with passed options
    function drawGraph(opts) {

      // Clone the options, so the 'options' variable always keeps intact.
      var o = Flotr._.extend(Flotr._.clone(options), opts || {});

      // Return a new graph.
      return Flotr.draw(
        container, [d1, d2, d3],
        o
      );
    }

    function sample(start,stop,step,fn){
      var list=[];
      for(var i=start;i<stop;i+=step){
        list.push([i,fn(i)]);
      }
      return list;
    }

    graph = drawGraph();
    $('.mathquill-editable').on('keyup',function(e){
      if(e.keyCode==13){
        var express=$('.mathquill-editable').mathquill('latex');
        console.log(express)
        var fn=Flotr.plugins.latex2js.latex2jsfun(express,'x');
        // console.log(fn);
        d3=sample(-40,40,0.01,fn);
        // console.log(d3);
        graph = drawGraph();
      }
      // console.log($('.mathquill-editable').mathquill().mathquill('latex'));
      // var a=Flotr.plugins.latex2js.latex2jsfun(,'x');
      // console.log(a);
    })
    
    // console.log(d3)    

    function initializeDrag(e) {
      start = graph.getEventPosition(e);
      Flotr.EventAdapter.observe(container, 'flotr:mousemove', move);
      Flotr.EventAdapter.observe(container, 'flotr:mouseup', stopDrag);
    }

    function move(e, o) {
      var
        xaxis = graph.axes.x,
        offset = start.x - o.x,
        yaxis = graph.axes.y,
        offsety = start.y - o.y;
      graph = drawGraph({
        xaxis: {
          min: xaxis.min + offset,
          max: xaxis.max + offset
        },
        yaxis: {
          min: yaxis.min + offsety,
          max: yaxis.max + offsety
        }
      });
    }

    function stopDrag() {
      Flotr.EventAdapter.stopObserving(container, 'flotr:mousemove', move);
    }

    Flotr.EventAdapter.observe(container, 'flotr:mousedown', initializeDrag);

  })(document.getElementById("container"));
}