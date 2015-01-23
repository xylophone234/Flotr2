(function() {
	Flotr.addPlugin('graphcalc', {
		callbacks: {},
		graphcalc:function(container,funcList,opt){
			var
			  latexList,
			  dataList,
			  options,
			  graph,
			  start,
			  i,
			  mathParams={},
			  latex2js=Flotr.plugins.latex2js,
			  xidu=0.1;
			latexList=[] ;
			dataList=[];

			options = opt || {
			  xaxis: {
			    min: -5,
			    max: 5,
			    noTicks: 8
			  },
			  yaxis: {
			    min: -5,
			    max: 5,
			    noTicks: 8
			  },
			  mouse : {
			    track           : true, // Enable mouse tracking
			    lineColor       : 'purple',
			    relative        : true,
			    position        : 'ne',
			    sensibility     : 1,
			    trackDecimals   : 2,
			    trackFormatter  : function (o) { return 'x = ' + o.x +', y = ' + o.y; }
			  },
			  crosshair : {
			    mode : 'xy',
			    color : 'rgba(255,255,255,0)',
			    hideCursor : false
			  },
			  shadowSize:0,
			  title: 'Math Graph For Function,Equation And Inequation'
			};

			// console.log(this)

			

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
			    list.push([i,fn(mathParams,i)]);
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

			

			function edit(index,express){
			    if(index>latexList.length) return ;
			    var left=options.xaxis.min*2-options.xaxis.max;
			    var right=options.xaxis.max*2-options.xaxis.min;
			    var wid=(options.xaxis.max-options.xaxis.min)/container.offsetWidth*xidu;
			    try{
			      latexList[index]=latex2js.latex2jsfun(express,mathParams);
			    }catch(e){
			      console.log(e);
			      dataList[index]=[[0,NaN]];
			    }
			    dataList[index]=sample(left,right,wid,latexList[index]);
			    graph = drawGraph();
			    
			}

			function remove(index){
			  if(index<latexList.length) latexList.splice(index,1);
			  if(index<dataList.length) dataList.splice(index,1);
			  graph = drawGraph();
			}
			
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
			    options.xaxis.min=xaxis.min + offset;
			    options.xaxis.max=xaxis.max + offset;
			    options.yaxis.min=yaxis.min + offsety;
			    options.yaxis.max=yaxis.max + offsety;
			    graph = drawGraph(options);
			}

			function stopDrag() {
			  Flotr.EventAdapter.stopObserving(container, 'flotr:mousemove', move);
			  reSample();
			}

			function scale(e){
			  // console.log(e);
			  var times=(e.wheelDelta || e.detail)>0?0.5:2;
			  e.preventDefault ();
			  e=graph.getEventPosition(e);
			  var ld=e.x-options.xaxis.min;
			  var rd=e.x-options.xaxis.max;
			  var td=e.y-options.yaxis.min;
			  var bd=e.y-options.yaxis.max;
			  ld*=times;
			  rd*=times;
			  td*=times;
			  bd*=times;
			  options.xaxis.min=e.x-ld;
			  options.xaxis.max=e.x-rd;
			  options.yaxis.min=e.y-td;
			  options.yaxis.max=e.y-bd;
			  // console.log(graph)
			  
			  try{
			    var dec=graph.axes.x.ticks[0].v.split('.')[1].length;
			  }catch(e){
			    dec=2;
			  }
			  options.mouse.trackDecimals=Math.max(2,dec);//调整显示精度
			  reSample();
			  graph = drawGraph(options);
			}

			function addnewparam(name){
			  console.log('add name');
			  mathParams[name]=0;
			  // changeParam(name,0);
			  // Flotr.EventAdapter.fire(this,'flotr:addnewparam',[name]);
			  
			}

			function changeParam(param,value){
				mathParams[param]=value;
				reSample();
			    graph = drawGraph(options);
			}

			Flotr.EventAdapter.observe(container, 'flotr:mousedown', initializeDrag);
			Flotr.EventAdapter.observe(latex2js, 'flotr:addnewparam', addnewparam);
			container.addEventListener('mousewheel',scale);

			if(funcList){
				for(i=0;i<funcList.length;i++){
					edit(i,funcList[i]);
				}
			}
			this.edit=edit;
			this.remove=remove;
			this.changeParam=changeParam;
		}
	})
})()