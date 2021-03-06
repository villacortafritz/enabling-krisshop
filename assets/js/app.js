(() => {
  const video = document.getElementById('video')
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  
  var tense =0;
  var neutral =0;
  var confident =0;
  var desperate =0;

  let isVideoRun = true
  let isLoadedMetaData = false
  let constraints = { audio: false, video: {facingMode: 'user'} }

  let ctrack = new clm.tracker()
  ctrack.init()

  delete emotionModel['disgusted']
  delete emotionModel['fear']
  let ec = new emotionClassifier()
  ec.init(emotionModel)
  let emotionData = ec.getBlank()
  let outputItem = document.querySelectorAll('.output_item')

  function assess(neutral, confident, desperate, tense){
    console.log(neutral);
    console.log(confident);
    console.log(desperate);
    console.log(tense);
    var array = [{key: 'Confident', value:confident}, {key:'Tense', value:tense}, {key:'Desperate', value:desperate}, {key:'Neutral', value:neutral}];
    array.sort(function(obj1, obj2) {
      return obj1.value - obj2.value;
   });
    document.getElementById("five").innerHTML = array[3].key;
  }

  function start(){
    navigator.mediaDevices.getUserMedia( constraints )
      .then( mediaStrmSuccess )
      .catch( mediaStrmFailed )
  }

  function mediaStrmSuccess( stream ){
    video.srcObject = stream

    if(isLoadedMetaData) return
    isLoadedMetaData = true

    video.addEventListener('loadedmetadata', () => {
      video.width = video.videoWidth        // width
      video.height = video.videoHeight      // height
      canvas.width = video.videoWidth  
      canvas.height = video.videoHeight

      ctrack.start(video)

      requestAnimationFrame( draw )
    }, false)
  }

  function mediaStrmFailed( e ){
    console.log( e )
  }

  function stop(){
    let stream = video.srcObject
    let tracks = stream.getTracks()

    tracks.forEach( (track) => {
      track.stop()
    })
    video.srcObject = null
  }

  function draw(){
    if(isVideoRun){
      detectFace()
    }
    requestAnimationFrame( draw )
  }

  start()

  const stopBtn = document.getElementById('stop')
  const frontBtn = document.getElementById('front')
  const rearBtn = document.getElementById('rear')

  stopBtn.addEventListener('click', () => {
    if(isVideoRun){
      stop()
      stopBtn.textContent = 'START'
      var deleter = firebase.database().ref('emo');
      deleter.remove();

    }else{
      start()
      stopBtn.textContent = 'STOP'
    }
    isVideoRun = !isVideoRun
    
  }, false)

  frontBtn.addEventListener('click', () => {
    if(isVideoRun){
      stop()
      stopBtn.textContent = 'START'
    }
    var deleter = firebase.database().ref('emo');
      deleter.remove();
 
      tense =0;
      neutral =0;
      confident =0;
      desperate =0;  
      document.getElementById("one").innerHTML = 0;
      document.getElementById("two").innerHTML = 0;
      document.getElementById("three").innerHTML = 0;
      document.getElementById("four").innerHTML = 0;
  }, false)

  rearBtn.addEventListener('click', () => {
    
    lineCharts();
    lineCharts2();
    lineCharts3();
    lineCharts4();
    pieChart();
    
    assess(neutral, confident, desperate, tense);
    
  }, false)

  function pieChart(){
    let myChart = document.getElementById('myChart5').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#000';

    let massPopChart = new Chart(myChart, {
      type:'pie', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:{
        labels:['Confidence', 'Tense', 'Neutral', 'Desperation'],
        datasets:[{
          label:'Time',
          data:[
            confident,
            tense,
            neutral,
            desperate
          ],
          //backgroundColor:'green',
          backgroundColor:[
            'rgba(0, 255, 64, 0.6)',
            'rgba(0, 64, 255, 0.6)',
            'rgba(255, 0, 191, 0.6)',
            'rgba(0, 255, 255, 0.6)',
          ],
          borderWidth:1,
          borderColor:'#fff',
          hoverBorderWidth:3,
          hoverBorderColor:'#fff'
        }]
      },
      options:{
       // maintainAspectRatio: true,
       // responsive: true,
        title:{
          display:true,
          text:'Dominant Emotion for the Interview',
          fontSize:25,
          fontColor: '#fff'
        },
        legend:{
          display:true,
          position:'bottom',
          labels:{
            fontColor:'#fff'
          }
        },
        layout:{
          padding:{
            left:0,
            right:0,
            bottom:0,
            top:0
          },
        },

        tooltips:{
          enabled:true
        }
      }
    });
  }
  
  function lineCharts(){

    let myChart = document.getElementById('myChart').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#000';

    let massPopChart = new Chart(myChart, {
      type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:{
        labels:['Confidence', 'Tense', 'Neutral', 'Desperation'],
        datasets:[{
          label:'Time',
          data:[
            confident,
            tense,
            neutral,
            desperate
          ],
          //backgroundColor:'green',
          backgroundColor:[
            'rgba(0, 255, 64, 0.6)',
            'rgba(0, 64, 255, 0.6)',
            'rgba(255, 0, 191, 0.6)',
            'rgba(0, 255, 255, 0.6)',
          ],
          borderWidth:1,
          borderColor:'#fff',
          hoverBorderWidth:3,
          hoverBorderColor:'#fff'
        }]
      },
      options:{
       // maintainAspectRatio: true,
       // responsive: true,
        title:{
          display:true,
          text:'Dominant Emotion for the Interview',
          fontSize:25,
          fontColor: '#fff'
        },
        legend:{
          display:true,
          position:'bottom',
          labels:{
            fontColor:'#fff'
          }
        },
        layout:{
          padding:{
            left:0,
            right:0,
            bottom:0,
            top:0
          },
        },

        tooltips:{
          enabled:true
        }
      }
    });

  }
  function lineCharts2(){

    let myChart = document.getElementById('myChart2').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#000';

    let massPopChart = new Chart(myChart, {
      type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:{
        labels:['Confidence', 'Tense', 'Desperation', 'Neutral Emotion'],
        datasets:[{
          label:'Time',
          data:[
            tense,
            confident,
            desperate,
            neutral,
          ],
          //backgroundColor:'green',
          backgroundColor:[
            'rgba(0, 255, 64, 0.6)',
            'rgba(0, 64, 255, 0.6)',
            'rgba(255, 0, 191, 0.6)',
            'rgba(0, 255, 255, 0.6)',
          ],
          borderWidth:1,
          borderColor:'#fff',
          hoverBorderWidth:3,
          hoverBorderColor:'#fff'
        }]
      },
      options:{
       // maintainAspectRatio: true,
       // responsive: true,
        title:{
          display:true,
          text:'Dominant Emotion for the Interview',
          fontSize:25,
          fontColor: '#fff'
        },
        legend:{
          display:true,
          position:'bottom',
          labels:{
            fontColor:'#fff'
          }
        },
        layout:{
          padding:{
            left:0,
            right:0,
            bottom:0,
            top:0
          },
        },

        tooltips:{
          enabled:true
        }
      }
    });

  }
  function lineCharts3(){

    let myChart = document.getElementById('myChart3').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#000';

    let massPopChart = new Chart(myChart, {
      type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:{
        labels:['Confidence', 'Tense', 'Desperation', 'Neutral Emotion'],
        datasets:[{
          label:'Time',
          data:[
            tense,
            confident,
            desperate,
            neutral,
          ],
          //backgroundColor:'green',
          backgroundColor:[
            'rgba(0, 255, 64, 0.6)',
            'rgba(0, 64, 255, 0.6)',
            'rgba(255, 0, 191, 0.6)',
            'rgba(0, 255, 255, 0.6)',
          ],
          borderWidth:1,
          borderColor:'#fff',
          hoverBorderWidth:3,
          hoverBorderColor:'#fff'
        }]
      },
      options:{
       // maintainAspectRatio: true,
       // responsive: true,
        title:{
          display:true,
          text:'Dominant Emotion for the Interview',
          fontSize:25,
          fontColor: '#fff'
        },
        legend:{
          display:true,
          position:'bottom',
          labels:{
            fontColor:'#fff'
          }
        },
        layout:{
          padding:{
            left:0,
            right:0,
            bottom:0,
            top:0
          },
        },

        tooltips:{
          enabled:true
        }
      }
    });

  }
  function lineCharts4(){

    let myChart = document.getElementById('myChart4').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#000';

    let massPopChart = new Chart(myChart, {
      type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:{
        labels:['Confidence', 'Tense', 'Desperation', 'Neutral Emotion'],
        datasets:[{
          label:'Time',
          data:[
            tense,
            confident,
            desperate,
            neutral,
          ],
          //backgroundColor:'green',
          backgroundColor:[
            'rgba(0, 255, 64, 0.6)',
            'rgba(0, 64, 255, 0.6)',
            'rgba(255, 0, 191, 0.6)',
            'rgba(0, 255, 255, 0.6)',
          ],
          borderWidth:1,
          borderColor:'#fff',
          hoverBorderWidth:3,
          hoverBorderColor:'#fff'
        }]
      },
      options:{
       // maintainAspectRatio: true,
       // responsive: true,
        title:{
          display:true,
          text:'Dominant Emotion for the Interview',
          fontSize:25,
          fontColor: '#fff'
        },
        legend:{
          display:true,
          position:'bottom',
          labels:{
            fontColor:'#fff'
          }
        },
        layout:{
          padding:{
            left:0,
            right:0,
            bottom:0,
            top:0
          },
        },

        tooltips:{
          enabled:true
        }
      }
    });

  }
  
  function detectFace(){
    ctx.drawImage(video, 0, 0)

    if( ctrack.getCurrentPosition() ){
      ctrack.draw(canvas)
    }
    let cp = ctrack.getCurrentParameters()

    let er = ec.meanPredict(cp)
    if(er){
      for(let i = 0; i < er.length; i++){
        if(er[i].value > 0.4){
          console.log(er[i].emotion)

          var today = new Date();
          var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

          var myFirebase = firebase.database().ref();
          var emo = myFirebase.child("emo");
          emo.push({
              "title": er[i].emotion,
              "time": time,
              "date": date
          });

          if(er[i].emotion=='angry'){
            tense++;
          }
          else if(er[i].emotion=='sad'){
            desperate++;
          }
          else if(er[i].emotion=='happy'){
            confident++;
          }
          else if(er[i].emotion=='surprised'){
            neutral++;
          }

          document.getElementById("one").innerHTML = tense;
          document.getElementById("two").innerHTML = confident;
          document.getElementById("three").innerHTML = neutral;
          document.getElementById("four").innerHTML = desperate;
          
          for(let j = 0; j < outputItem.length; j++){
            if(outputItem[j].getAttribute('data-emotion') === er[i].emotion){
              outputItem[j].classList.add('is-show')
            }else{
              outputItem[j].classList.remove('is-show')
            }
          }
             
        }
        
      }
     
    }
  }
})()