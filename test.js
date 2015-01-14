window.onload = function() {
  (function mouse_drag(container) {

    var
      latexList,
      dataList,
      options,
      graph,
      start,
      i;
    latexList=[];
    dataList=[];

    options = {
      xaxis: {
        min: -5,
        max: 5
      },
      yaxis: {
        min: -5,
        max: 5
      },
      title: 'Math Graph For Function,Equation And Inequation'
    };

    // Draw graph with default options, overwriting with passed options
    function drawGraph(opts) {

      // Clone the options, so the 'options' variable always keeps intact.
      var o = Flotr._.extend(Flotr._.clone(options), opts || {});

      // Return a new graph.
      return Flotr.draw(container, dataList,o);
    }

    function sample(start,stop,step,fn){
      var list=[];
      for(var i=start;i<stop;i+=step){
        list.push([i,fn(i)]);
      }
      return list;
    }

    graph = drawGraph();
    $('#show-hide').on('click',function(){
      $('#cbp-spmenu-s1').toggleClass('cbp-spmenu-open');
    })

    function edit(e){
      if(e.keyCode==13){
        console.log($('#functin-list').find('div'))
        var index=$('#functin-list').find('div').index($(this).parents('div')[0]);
        var express=$(this).mathquill('latex');
        try{
          latexList[index]=Flotr.plugins.latex2js.latex2jsfun(express,'x');
          dataList[index]=sample(-40,40,0.01,latexList[index]);
          graph = drawGraph();
        }catch(e){

        }
        
      }
    }

    function remove(e){
      var index=$('#functin-list').find('div').index($(this).parents('div .function-bar')[0]);
      // console.log(index);
      // console.log(dataList);
      if(index<latexList.length) latexList.splice(index,1);
      if(index<dataList.length) dataList.splice(index,1);
      console.log($(this).parents('div .function-bar'))
      $(this).parents('div .function-bar').detach();
      // console.log(dataList);
      graph = drawGraph();
    }
    
    $('.add-new').on('click',function(){
      var template='<div class="function-bar"><a href="#"><span class="function-delete">删除</span><span class="mathquill-editable"></span></a></div>';
      var mq='<span class="mathquill-editable"></span>';
      
      $(template).appendTo('#functin-list').find('.mathquill-editable').mathquill('editable').on('keyup',edit).parents('div .function-bar').find('.function-delete').on('click',remove);
      // $('#functin-list').find('.function-delete').on('click',remove)
      latexList.push([]);
      dataList.push([]);
    })

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