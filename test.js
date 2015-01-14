window.onload = function() {
  (function mouse_drag(container) {

    var
      latexList,
      dataList,
      options,
      graph,
      start,
      i,
      xidu=1;
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

    function reSample(){
      var left=options.xaxis.min*2-options.xaxis.max;
      var right=options.xaxis.max*2-options.xaxis.min;
      var wid=(options.xaxis.max-options.xaxis.min)/container.offsetWidth*xidu;
      for(var i=0;i<dataList.length;i++){
        dataList[i]=sample(left,right,wid,latexList[i])
      }
    }

    graph = drawGraph();
    $('#show-hide').on('click',function(){
      $('#cbp-spmenu-s1').toggleClass('cbp-spmenu-open');
    })

    function edit(e){
      if(e.keyCode==13){
        console.log($('#functin-list').find('div'));
        var left=options.xaxis.min*2-options.xaxis.max;
        var right=options.xaxis.max*2-options.xaxis.min;
        var wid=(options.xaxis.max-options.xaxis.min)/container.offsetWidth*xidu;
        // console.log(left,right,wid)
        var index=$('#functin-list').find('div').index($(this).parents('div')[0]);
        var express=$(this).mathquill('latex');
        try{
          latexList[index]=Flotr.plugins.latex2js.latex2jsfun(express,'x');
          dataList[index]=sample(left,right,wid,latexList[index]);
          graph = drawGraph();
        }catch(e){
          console.log(e)
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

    

    function initializeDrag(e) {
      start = graph.getEventPosition(e);
      Flotr.EventAdapter.observe(container, 'flotr:mousemove', move);
      Flotr.EventAdapter.observe(container, 'flotr:mouseup', stopDrag);
      Flotr.EventAdapter.observe(container, 'flotr:click', scale);
    }

    function move(e, o) {
      var
        xaxis = graph.axes.x,
        offset = start.x - o.x,
        yaxis = graph.axes.y,
        offsety = start.y - o.y;
        opt={
          xaxis: {
            min: xaxis.min + offset,
            max: xaxis.max + offset
          },
          yaxis: {
            min: yaxis.min + offsety,
            max: yaxis.max + offsety
          }
        }
        options.xaxis=opt.xaxis;
        options.yaxis=opt.yaxis;
      graph = drawGraph(opt);
    }

    function stopDrag() {
      Flotr.EventAdapter.stopObserving(container, 'flotr:mousemove', move);
      reSample();
    }

    function scale(e){
      console.log(e);
      var ld=e.x-options.xaxis.min;
      var rd=e.x-options.xaxis.max;
      var td=e.y-options.yaxis.min;
      var bd=e.y-options.yaxis.max;
      ld*=0.5;
      rd*=0.5;
      td*=0.5;
      bd*=0.5;
      options.xaxis.min=e.x-ld;
      options.xaxis.max=e.x-rd;
      options.yaxis.min=e.y-td;
      options.yaxis.max=e.y-bd;
      reSample();
      graph = drawGraph(options);
    }

    Flotr.EventAdapter.observe(container, 'flotr:mousedown', initializeDrag);

  })(document.getElementById("container"));
}