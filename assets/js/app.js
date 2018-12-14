(() => {
  const video = document.getElementById('video')
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  
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

  let ua = navigator.userAgent
  if(ua.indexOf('iPhone') < 0 && ua.indexOf('Android') < 0 && ua.indexOf('Mobile') < 0 && ua.indexOf('iPad') < 0){
    frontBtn.disabled = true
    rearBtn.disabled = true
  }

  stopBtn.addEventListener('click', () => {
    if(isVideoRun){
      stop()
      stopBtn.textContent = 'START'
    }else{
      start()
      stopBtn.textContent = 'STOP'
    }
    isVideoRun = !isVideoRun
  }, false)

  frontBtn.addEventListener('click', () => {
    stop()
    constraints.video.facingMode = 'user'
    setTimeout( () => {
      start()
    }, 500)
  }, false)

  rearBtn.addEventListener('click', () => {
    stop()
    constraints.video.facingMode = 'environment'
    setTimeout( () => {
      start()
    }, 500)
  }, false)

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
          

          for(let j = 0; j < outputItem.length; j++){
            if(outputItem[j].getAttribute('data-emotion') === er[i].emotion){
              outputItem[j].classList.add('is-show')
             
                 
              document.getElementById("test").innerHTML = er[i].emotion;
            }else{
              outputItem[j].classList.remove('is-show')
            }
          }
             
        }
        
      }
     
    }
  }
})()