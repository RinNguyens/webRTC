import "./App.css";
import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'environment'
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 1920,
      height: 1080,
    });
  }, [webcamRef]);
  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button className="webcamCapture__button" onClick={capture}>Capture photo</button>
    </>
  );
};

function App() {
  return (
    <div className="webcamCapture">
      <WebcamCapture />
    </div>
  );
}

export default App;
