// Data Visualization
// Javascript Plotly using Python API with HTML Rendering
// Fervis Lauan       11-27-17

var names=[];
var sample_meta=[];
var sample_wfreq=0;
var sample_otu=[];
var otu=[];


function init(){
  console.log("Initializing....");
  
  d3.json('/names', function(error, response) {names=response});
  setTimeout('delayNames()', 2000);

}



// PIE *****************************************

// function initPie() {

//   console.log("AT PIE"+sample_otu);

//   var pval= sample_otu[1][0]["otu_val"];
//   var plab= sample_otu[0]["otu_id"];

//   console.log(pval);
//   console.log(plab);
  
//   var data = [{
//     // values: sample_otu[1][0]["otu_val"],
//     // labels: sample_otu[0]["otu_id"],
//     values: pval.slice(0,10),
//     labels: plab.slice(0,10),
//     type: "pie"
//   }];
//   var layout = {
//     height: 500,
//     width: 500
//   };

//   Plotly.plot("pie",data, layout);

// }


function initPie() {

  console.log("AT PIE"+sample_otu);

  var pval= sample_otu[1][0]["otu_val"];
  var plab= sample_otu[0]["otu_id"];

  console.log(pval);
  console.log(plab);

  var myPlot = document.getElementById('pie'),
  hoverInfo = document.getElementById('hoverpie'),  
  data = [{
    // values: sample_otu[1][0]["otu_val"],
    // labels: sample_otu[0]["otu_id"],
    values: pval.slice(0,10),
    labels: plab.slice(0,10),
    type: "pie"
  }];
  layout = {
    height: 500,
    width: 500,
    title:"Top 10 OTU"
  };

  Plotly.plot("pie",data, layout);


  var desc='';
  myPlot.on('plotly_hover', function(data){
      var infotext = data.points.map(function(d){        
        desc='';

        for (var index = 0; index < otu.length; ++index) {                        
            if (otu[index]["otu_id"]==d.label){desc="Desc: "+otu[index]["desc"]}
        }
        return (desc);
      });
    
      hoverInfo.innerHTML = infotext.join('<br/>');
  })
  .on('plotly_unhover', function(data){
      hoverInfo.innerHTML = 'Desc: ';
  });

}



function updatePie(newdata) {
  var PIE = document.getElementById("pie");
  console.log("Updating Pie");
  console.log(newdata);
  Plotly.restyle(PIE, "values", [newdata]);
}



// Bubble *************************************
// function initBubble(){
// var trace1 = {
//   x: samples_otu[0]["otu_id"],
//   y: samples_otu[1][0]["otu_val"],
//   mode: 'markers',
//   type: 'scatter',
//   marker: { size:samples_otu[1][0]["otu_val"],
//             color:samples_otu[0]["otu_id"]}  
// };

// var data = [trace1];
// Plotly.newPlot('bubble', data);
// }



function initBubble(){
    var myPlot = document.getElementById('bubble'),
      hoverInfo = document.getElementById('hoverinfo'),
      data = [{x: sample_otu[0]["otu_id"],
               y: sample_otu[1][0]["otu_val"],
               mode: 'markers',
               type: 'scatter',               
               marker: { size:sample_otu[1][0]["otu_val"],
                         color:sample_otu[0]["otu_id"]}  
              }];
      layout = { 
          hovermode:'closest',
          title:'',
          xaxis:{title:"OTU ID"},
          yaxis:{title:"Value"}
      };

  Plotly.plot('bubble', data, layout);

  var desc='';
  myPlot.on('plotly_hover', function(data){
      var infotext = data.points.map(function(d){        
        desc=''
        for (var index = 0; index < otu.length; ++index) {                        
            if (otu[index]["otu_id"]==d.x){desc="Desc: "+otu[index]["desc"];}
        }
        return (desc);
      });
    
      hoverInfo.innerHTML = infotext.join('<br/>');
  })
  .on('plotly_unhover', function(data){
      hoverInfo.innerHTML = 'Desc: ';
  });
}

function updateBubble(newdata) {
  var BUB = document.getElementById("bubble");
  console.log("RESTYLING BUBBLE")  
  Plotly.update(BUB, [newdata]);
}

function initGauge(){
    // Enter a speed between 0 and 180
    var level = sample_wfreq;
    var glevel=level;
    console.log("WFREQ : "+sample_wfreq)
    if (level>=9){glevel=8.5}
    if (level<=0){glevel=.5}

    // Trig to calc meter point
    var degrees = 180-((22.5*glevel)-11.25),//180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'Freq',
        text: level,
        hoverinfo: 'text+name'},
      {values: [50/8, 50/8, 50/8, 50/8, 50/8, 50/8,50/8,50/8,50],
      rotation: 90,
      text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2',''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                       'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                       'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                       'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',                       
                       'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3','1-2',''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Washing Frequency: '+sample_wfreq,
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout);

}






function initMeta(){
  
  document.getElementById("meta").innerHTML='Attributes'; 

  var node = document.createElement("li");
  var textnode = document.createTextNode("Age : "+sample_meta[0]["Age"]); 
  node.appendChild(textnode);    
  document.getElementById("meta").appendChild(node);

  node = document.createElement("li");
  textnode = document.createTextNode("BBType : "+sample_meta[0]["BBType"]); 
  node.appendChild(textnode);    
  document.getElementById("meta").appendChild(node);

  node = document.createElement("li");
  textnode = document.createTextNode("Ethnicity : "+sample_meta[0]["Ethnicity"]); 
  node.appendChild(textnode);    
  document.getElementById("meta").appendChild(node);

  node = document.createElement("li");
  textnode = document.createTextNode("Gender : "+sample_meta[0]["Gender"]); 
  node.appendChild(textnode);    
  document.getElementById("meta").appendChild(node);

  node = document.createElement("li");
  textnode = document.createTextNode("Location : "+sample_meta[0]["Location"]); 
  node.appendChild(textnode);    
  document.getElementById("meta").appendChild(node);

  node = document.createElement("li");
  textnode = document.createTextNode("Sample ID : "+sample_meta[0]["SampleID"]); 
  node.appendChild(textnode);    
  document.getElementById("meta").appendChild(node);
}

function refreshSample(){
  console.log("Refresh Sample"+names);
  // console.log(otu);
  console.log(sample_meta);
  console.log(sample_wfreq);
  console.log(sample_otu);

  Plotly.deleteTraces("pie", 0);
  Plotly.deleteTraces("bubble", 0);
  Plotly.deleteTraces("gauge", 0);

  initPie();
  initBubble();
  initMeta();
  initGauge();
}

function delayInit(){
  console.log("Initial Values"+names);
  // console.log(otu);
  console.log(sample_meta);
  console.log(sample_wfreq);
  console.log(sample_otu);

  console.log("FIRSTNAME: "+names[0]);

  initPie();
  initBubble();
  initMeta();
  initGauge();

}

function delayNames(){
  
  var initsample=names[0];
  console.log("Initial Sample "+initsample);  
  d3.json('/otu', function(error, response) {otu=JSON.parse(response)});
  d3.json('/metadata/'+initsample, function(error,response) {sample_meta=JSON.parse(response)});
  d3.json('/wfreq/'+initsample, function(error, response) {sample_wfreq=JSON.parse(response)});
  d3.json('/samples/'+initsample, function(error, response) {sample_otu=JSON.parse(response)});
    
  setTimeout('delayInit()', 2000);
}

function optionChanged(sampleid){
  console.log(sampleid);
 
  d3.json('/names', function(error, response) {names=response;});
  d3.json('/otu', function(error, response) {otu=JSON.parse(response);});
  d3.json('/metadata/'+sampleid, function(error, response) {sample_meta=JSON.parse(response);});
  d3.json('/wfreq/'+sampleid, function(error, response) {sample_wfreq=JSON.parse(response);});
  d3.json('/samples/'+sampleid, function(error, response) {sample_otu=JSON.parse(response);});
 
  setTimeout("refreshSample()", 2000);      
}
console.log(names);
init("BB_940"); //Default sample upon loading

