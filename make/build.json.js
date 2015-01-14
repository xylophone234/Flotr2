var m={
  "JAVASCRIPT": {
    "DIST_DIR": "./build",
    "ie": [
      { "src": "./lib/excanvas.js", "jshint": false },
      { "src": "./lib/base64.js", "jshint": false },
      { "src": "./lib/canvastext.js", "jshint": false }
    ],
    "lib": [
      { "src": "./lib/bean.js", "jshint": false },
      { "src": "./lib/underscore.js", "jshint": false }
    ],
    "flotr2": [
      "./js/Flotr.js",
      "./js/DefaultOptions.js",
      "./js/Color.js",
      "./js/Date.js",
      "./js/DOM.js",
      "./js/EventAdapter.js",
      "./js/Text.js",
      "./js/Graph.js",
      "./js/Axis.js",
      "./js/Series.js",
      "./js/types/lines.js",
      "./js/types/bars.js",
      "./js/types/bubbles.js",
      "./js/types/candles.js",
      "./js/types/gantt.js",
      "./js/types/markers.js",
      "./js/types/pie.js",
      "./js/types/points.js",
      "./js/types/radar.js",
      "./js/types/timeline.js",
      "./js/plugins/crosshair.js",
      "./js/plugins/download.js",
      "./js/plugins/grid.js",
      "./js/plugins/hit.js",
      "./js/plugins/selection.js",
      "./js/plugins/labels.js",
      "./js/plugins/legend.js",
      "./js/plugins/spreadsheet.js",
      "./js/plugins/titles.js"
    ],
    "flotr2-basic": [
      "./js/Flotr.js",
      "./js/DefaultOptions.js",
      "./js/DOM.js",
      "./js/EventAdapter.js",
      "./js/Color.js",
      "./js/Date.js",
      "./js/Text.js",
      "./js/Graph.js",
      "./js/Axis.js",
      "./js/Series.js",
      "./js/types/lines.js",
      "./js/types/bars.js",
      "./js/types/markers.js",
      "./js/types/points.js",
      "./js/plugins/grid.js",
      "./js/plugins/labels.js",
      "./js/plugins/legend.js",
      "./js/plugins/titles.js"
    ],
    "examples": [
      "./examples/js/Examples.js",
      "./examples/js/Example.js",
      "./examples/js/Editor.js",
      "./examples/js/Profile.js"
    ],
    "examples-types": [
      "./examples/js/ExampleList.js",
      "./examples/js/examples/basic.js",
      "./examples/js/examples/basic-stacked.js",
      "./examples/js/examples/basic-axis.js",
      "./examples/js/examples/basic-bars.js",
      "./examples/js/examples/basic-bars-stacked.js",
      "./examples/js/examples/basic-pie.js",
      "./examples/js/examples/basic-radar.js",
      "./examples/js/examples/basic-bubble.js",
      "./examples/js/examples/basic-candle.js",
      "./examples/js/examples/basic-legend.js",
      "./examples/js/examples/mouse-tracking.js",
      "./examples/js/examples/mouse-zoom.js",
      "./examples/js/examples/mouse-drag.js",
      "./examples/js/examples/basic-time.js",
      "./examples/js/examples/negative-values.js",
      "./examples/js/examples/click-example.js",
      "./examples/js/examples/download-image.js",
      "./examples/js/examples/download-data.js",
      "./examples/js/examples/advanced-titles.js",
      "./examples/js/examples/color-gradients.js",
      "./examples/js/examples/profile-bars.js",
      "./examples/js/examples/basic-timeline.js",
      "./examples/js/examples/advanced-markers.js"
    ]
  }
}
var list=m.JAVASCRIPT.flotr2;
var str='';
for(var i=0;i<list.length;i++){
  str+='<script type="text/javascript" src="'+list[i]+'"></script>\n';
}
console.log(str);