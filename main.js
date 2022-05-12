(function () {
  "use strict";
  var constraints = {
    audio: true,
    video: {
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 850, max: 1080 },
      facingMode: "environment",
    },
  };
  var video = document.querySelector("video");
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
      video.srcObject = mediaStream;
      if (video.srcObject) {
        videoIn.srcObject.getTracks().forEach((track) => {
            track.stop()
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
