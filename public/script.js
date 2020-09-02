
// Add the ability to view our own videos


const socket = io('/');

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted= true;

var peer = new Peer(undefined, {
    path:'/peerjs',
    host: '/',
    port: '443'
}); 


let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then (stream => {
   myVideoStream = stream;
   addVideoStream(myVideo, stream);

   peer.on('call', call => {
       call.answer(stream)
       const video = document.createElement('video')
       call.on('stream', userVideoStream => {
           addVideoStream(video, userVideoStream)
       })
   })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);    //this point connect connec
  
    })
    // jquery for input message

let text = $('input')

$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val())
        socket.emit('message', text.val());
        text.val('')

    }
});

socket.on('createMessage', message =>{
    console.log("Create message", message);
   $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`);
   scrollToBottom()
})
})

peer.on('open', id => {
    // console.log(id)
    socket.emit('join-room', ROOM_ID, id);
})

const connectToNewUser = (userId, stream) => {
    // console.log(userId);
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}



const addVideoStream = (video, stream) => {
video.srcObject = stream;
video.addEventListener('loadedmetadata', () => {
    video.play();
})

videoGrid.append(video);
}

// Add the ability to view our own videos

// scroll the message 
const scrollToBottom = () => {
    let d = $('.main-chat-window'); 
    d.scrollTop(d.prop("scrollHeight"));
}

// scroll the message 


// function to mute and mute our video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>`
    document.querySelector('.main-mute-button2').innerHTML= html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>UnMute</span>`

    document.querySelector('.main-mute-button2').innerHTML= html;
}
// function to mute and unmute our video

//stop video function
const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()

    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

// play and stop video function html function
 const setStopVideo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>`

    document.querySelector('.main-video-button').innerHTML= html;
    }

   const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`

    document.querySelector('.main-video-button').innerHTML= html;
    }
    



