(async function () {
  "use strict";
  var constraints = {
    audio: false,
    video: { facingMode: 'enviroment' },
    
  };
  console.log(constraints, "constraints");
  var video = document.querySelector("video");
  // Fix for iOS Safari from https://leemartin.dev/hello-webrtc-on-safari-11-e8bcb5335295
  video.style.width = document.width + "px";
  video.style.height = document.height + "px";
  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  let result = { hasBack: false, hasFront: false, videoDevices: [] };

  let videoinput = false;

  await navigator.mediaDevices.enumerateDevices().then((devices) => {
    if (devices.filter((device) => device.kind === "videoinput")) {
      videoinput = true;
    }
  });

  if (videoinput) {
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
  }

  async function hasFrontBack() {
    let result = { hasBack: false, hasFront: false, videoDevices: [] };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      let devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => {
        if (device.kind === "videoinput") {
          if (device.label && device.label.length > 0) {
            if (device.label.toLowerCase().indexOf("back") >= 0) {
              result.hasBack = true;
            } else if (device.label.toLowerCase().indexOf("front") >= 0) {
              result.hasFront = true;
            } else {
              /* some other device label ... desktop browser? */
            }
          }
          return true;
        }
        return false;
      });
      result.videoDevices = videoDevices;
      /* drop stream */
      const tracks = stream.getTracks();
      if (tracks) {
        for (let t = 0; t < tracks.length; t++) tracks[t].stop();
      }
      return result;
    } catch (ex) {
      /* log and swallow exception, this is a probe only */
      console.error(ex);
      return result;
    }
  }
})();
