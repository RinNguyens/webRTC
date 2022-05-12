(function () {
  "use strict";
  var constraints = {
    audio: false,
    video: {
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 850, max: 1080 },
      facingMode: "user",
    },
  };
  var video = document.querySelector("video");
  // Fix for iOS Safari from https://leemartin.dev/hello-webrtc-on-safari-11-e8bcb5335295
  video.style.width = document.width + 'px';
  video.style.height = document.height + 'px';
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
      video.srcObject = mediaStream;
      if (video.srcObject) {
        videoIn.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
      }
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    }); // always check for errors at the end.
})();
