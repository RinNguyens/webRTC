(function () {
  "use strict";
  var constraints = {
    audio: false,
    video: true,
    facingMode: { exact: "environment" }
  };
  console.log(constraints, 'constraints');
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
        console.log(mediaStream, 'mediaStream');
      video.srcObject = mediaStream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    }); // always check for errors at the end.
})();
