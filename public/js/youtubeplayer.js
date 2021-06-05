var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var socket = io();

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '480',
        width: '760',
        videoId: '09R8_2nJtjg',
        playerVars: {
            "modestbranding" : 1,
            'showInfo': 1,
            'playsinline': 1,
            'controls' : 0,
            'disablekb' : 1,
            'enablejsapi' : 1,   
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}


function onPlayerReady(event) {
    // event.target.playVideo();
    // setLengthOfBar();
}

var done = false;
function onPlayerStateChange(event) {
    
    if (event.data == YT.PlayerState.PLAYING && !done) {
        done = true; 
        setInterval(updateStatusBar, 1000);
    }
    
}
function stopVideo() {
    player.stopVideo();
}

let time = 0;

document.getElementById("play").addEventListener("click", (e) => {
    e.preventDefault();
    time = player.getCurrentTime();
    data = {
        condition : 'play',
        time: time
    }
    socket.emit('data', data);
    data = {};
    player.playVideo();
});

document.getElementById("pause").addEventListener("click", () => {
    time = player.getCurrentTime();
    time = player.getCurrentTime();
    data = {
        condition : 'pause',
        time: time
    }
    socket.emit('data', data);
    data = {};
    document.getElementById("square").style.left = time*5 + "px";
    player.pauseVideo();
});

const setLengthOfBar = () => {
    let lengthOfBar = player.getDuration();
    lengthOfBar *= 5;
    lengthOfBar += 10;
    document.getElementById("bar").style.width = lengthOfBar + "px";
}


const updateStatusBar = () => {
    time = player.getCurrentTime();
    document.getElementById("square").style.left = time*(600/player.getDuration()) + "px";
}


const updateProgessBar = (event) => {
    let lengthOfBar = event.offsetX;
    document.getElementById("square").style.left = lengthOfBar*600/player.getDuration();
    seekTo = lengthOfBar*player.getDuration()/600;
    time = player.getCurrentTime();
    data = {
        condition : 'seek',
        time: time,
        lengthOfBar: lengthOfBar
    }
    socket.emit('data', data);
    data = {};
    player.seekTo(seekTo);
}

socket.on('data', (data) => {
    console.log(data);
    if(data.condition == 'play') {
        player.seekTo(data.time);
        updateStatusBar();
        player.playVideo();
    } else if(data.condition == 'pause') {
        player.seekTo(data.time);
        updateStatusBar();
        player.pauseVideo();
    } else if(data.condition == 'seek'){
        document.getElementById("square").style.left = data.lengthOfBar*600/player.getDuration();
        seekTo = data.lengthOfBar*player.getDuration()/600;
        player.seekTo(seekTo);
        updateStatusBar();
    }
})



