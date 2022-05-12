(function () {
  "use strict";
  var constraints = { audio: true, video: { facingMode: 'environment'} }
  var video = document.querySelector("video");

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
      video.srcObject = mediaStream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    }); // always check for errors at the end.
})();
