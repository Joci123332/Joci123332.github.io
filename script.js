var div = document.getElementsByClassName("aud");
var audio = document.querySelector("audio");
var song = document.querySelector("p");
var next = document.getElementById("next");
var prevous = document.getElementById("prevous");
var play = document.getElementById("play");
var pause = document.getElementById("pause");
var songs = [
			"Song/1-18. Tacabro - Tacata.mp3",
			"Song/05 - Loona Vs. Movetown - El Cucaracho  El Muchacho-(Video Mix) =03.22=.mp3",
			"Song/05 - Miss Ventura - Can You Feel It (Extended Version) =04.47=.mp3",
			"Song/05 - Mohombi Ft Nicole Scherzinger - Coconut Tree =03.35=.mp3",
			"Song/05. Tom Boxer & Morena Feat. J Warner - Deep In Love.mp3",
			"Song/37 Calvin Harris + Disciples - How Deep Is Your Love(musicbolt.com).mp3"];
var progress = document.querySelector("progress");
var leng = songs.length;
var pieces = 100/leng;
var del = pieces;
var i = 0;
var del1 = 1/leng;
var seeking = false;
var seekslider = document.getElementById("seekslider");
var volumeslider = document.getElementById("volumeslider");
var curtimetext = document.getElementById("curtimetext");
var durtimetext = document.getElementById("durtimetext");
// VARIABLES END HERE 

//PREPROGRAM
start();
checkplay();
progress.setAttribute("value",pieces);
play.style.display = "none";
//audio.crossOrigin = 'anonymous';

//FUNCTIONS AND STUFF LIKE THAT
function checkplay(){
	if(audio.play()){
		play.style.display = "none";
		pause.style.display = "block";
	}else{
		pause.style.display = "none";
		play.style.display = "block";
	}
}

pause.addEventListener("click",function(){
	audio.pause();
	pause.style.display = "none";
	play.style.display = "block";
});

play.addEventListener("click",function(){
	audio.play();
	play.style.display = "none";
	pause.style.display = "block";
});
	
next.addEventListener("click", function(){
	i++;
    if(i>leng-1){
    	i=0;
    	start();
    	progr();
    }else{
    start();progr();}
});

prevous.addEventListener("click",function(){
	i--;
    if(i<0){
    	alert("No songs");
    	del = pieces;
    	i=0;
    	songs[0];
    }else{
    start();
	del = del -pieces-del1;
	progress.setAttribute("value",del); }
});

function progr(){
	console.log(del);
		if(del >100){
			del = pieces;
			progress.setAttribute("value",del);
		}else{
           del = del + pieces +del1;
			progress.setAttribute("value",del);
	}
}

function start(){
	audio.setAttribute("autoplay","");
	audio.setAttribute("src",songs[i]);
	var c = audio.getAttribute("src");
	var s = c.substr(5).slice(0,-4);
	song.textContent  = s;
	audio.play();

}


audio.onended = function() {
    i++;
    if(i>leng-1){
    	i=0;
    	start();
    	progr();
    }else{
    start();progr();}
};

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

window.onload = function() {
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio); 
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    analyser.fftSize = 128;
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    var canvas = document.getElementById('canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 10;
        meterWidth = 8, 
        gap = 1,
        capHeight = 2,
        capStyle = '#fff',
        meterNum = 800 / (10 + 2), 
        capYPositionArray = []; 
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#0f0');
    gradient.addColorStop(0.7, '#ff0');
    gradient.addColorStop(0.3, '#f00');
    // loop
    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum);
        ctx.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            };
            ctx.fillStyle = capStyle;
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            };
            ctx.fillStyle = gradient; 
            ctx.fillRect(i * 12 , cheight - value + capHeight, meterWidth, cheight); 
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
    audio.play();
};

	volumeslider.addEventListener("mousemove", setvolume);
	audio.addEventListener("timeupdate", function(){ seektimeupdate(); });

	function setvolume(){
	    audio.volume = volumeslider.value / 100;
    }
	function seektimeupdate(){
		var nt = audio.currentTime * (100 / audio.duration);
		seekslider.value = nt;
		var curmins = Math.floor(audio.currentTime / 60);
	    var cursecs = Math.floor(audio.currentTime - curmins * 60);
	    var durmins = Math.floor(audio.duration / 60);
	    var dursecs = Math.floor(audio.duration - durmins * 60);
		if(cursecs < 10){ cursecs = "0"+cursecs; }
	    if(dursecs < 10){ dursecs = "0"+dursecs; }
	    if(curmins < 10){ curmins = "0"+curmins; }
	    if(durmins < 10){ durmins = "0"+durmins; }
		curtimetext.innerHTML = curmins+":"+cursecs;
	    durtimetext.innerHTML = durmins+":"+dursecs;
	}