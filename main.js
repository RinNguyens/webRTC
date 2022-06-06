//-----------------------------------------------------
// グローバル変数
//-----------------------------------------------------
const VIDEO = document.querySelector("#camera"); // <video>
const FRAME = document.querySelector("#frame"); // <canvas>
const canvasReplicate = document.getElementById("canvasReplicate");
const canvasctx = canvasReplicate.getContext("2d");
const photo = document.getElementById("photo");
let scaleTotal = 1;
let base64 = null;
let resImage = '';

/** フレーム素材一覧 */
const FRAMES = [
  {
    large: "image/main-watch.png",
    small: "image/w.png",
  },
];

/** カメラ設定 */
const CONSTRAINTS = {
  audio: false,
  video: {
    width: 1920,
    height: 1080,
    // facingMode: "user", // フロントカメラを利用する
    facingMode: { exact: "environment" }, // リアカメラを利用する場合
  },
};

//-----------------------------------------------------
// onload
//-----------------------------------------------------
window.onload = () => {
  //-----------------------------
  //カメラを<video>と同期
  //-----------------------------
  syncCamera();

  VIDEO.addEventListener("loadeddata", initCanvas);

  VIDEO.play();
  //-----------------------------
  // フレーム初期化
  //-----------------------------
  drawFrame(FRAMES[0].large); // 初期フレームを表示

  //-----------------------------
  // シャッターボタン
  //-----------------------------
  document.querySelector("#btn-shutter").addEventListener("click", () => {
    // SE再生＆映像停止
    VIDEO.pause();
    // 画像の生成
    onShutter(); // カメラ映像から静止画を取得

    changeWidth("#dialog-result", "85%");
    hiddenTag("#content-detail");
    dialogShowImgResult("#wrapImg", "#download");
    // 最終結果ダイアログを表示
    setTimeout(() => {
      dialogShow("#dialog-result");
    }, 200);
  });

  document.querySelector("#show-Detail").addEventListener("click", () => {
    VIDEO.pause();
    changeWidth("#dialog-result", "auto");
    showTag("#content-detail", "#dialog-result");
    dialogHideImgResult("#wrapImg", "#download");
    setTimeout(() => {
      dialogShow("#dialog-result");
    }, 200);
  });

  //-----------------------------
  // ダイアログ
  //-----------------------------
  // 閉じるボタン
  document
    .querySelector("#dialog-result-close")
    .addEventListener("click", (e) => {
      showParams("#btn-shutter", "#show-Detail", "#show-Detail");
      hiddenTag("#container-shutter");
      VIDEO.play();
      dialogHide("#dialog-result");
    });

  // ダウンロードボタン
  document.querySelector("#dialog-result-dl").addEventListener("click", (e) => {
    // canvasDownload("#photo", base64);
    html2canvas(document.querySelector("#wrapPhoto")).then((canvas) => {
      var dataURL = canvas.toDataURL("image/png");
      var data = atob(dataURL.substring("data:image/png;base64,".length)),
        asArray = new Uint8Array(data.length);

      for (var i = 0, len = data.length; i < len; ++i) {
        asArray[i] = data.charCodeAt(i);
      }
      var filename = makeName(9);
      var blob = new Blob([asArray.buffer], { type: "image/png" });
      const dataURI = window.URL.createObjectURL(blob);
      const event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      const a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
      a.href = dataURI; // URI化した画像
      a.download = filename; // デフォルトのファイル名
      a.dispatchEvent(event); // イベント発動
      // saveAs(blob, "photo.png");
    });
  });
};

function initCanvas() {
  canvasReplicate.width = VIDEO.videoWidth;
  canvasReplicate.height = VIDEO.videoHeight;
  drawVideo();
}

function drawVideo() {
  canvasctx.drawImage(
    VIDEO,
    0,
    0,
    canvasReplicate.width,
    canvasReplicate.height
  );
  requestAnimationFrame(drawVideo);
}

/**
 * [onload] カメラを<video>と同期
 */

async function syncCamera() {
  try {
    await navigator.mediaDevices
      .getUserMedia(CONSTRAINTS)
      .then((stream) => {
        VIDEO.srcObject = stream;
        VIDEO.play();
      })
      .catch((err) => {
        console.log(`${err.name}: ${err.message}`);
      });
  } catch (err) {
    alert("Could not access the camera!");
  }
}


/**
 * 指定フレームを描画する
 *
 * @param {string} path  フレームの画像URL
 * @return {void}
 */
function drawFrame(path) {
  // const modal = "#dialog-nowloading";
  const image = new Image();
  image.src = path;
  image.onload = () => {
    const ctx = FRAME.getContext("2d");
    ctx.clearRect(0, 0, frame.width, frame.height);
    ctx.drawImage(image, 0, 0, frame.width, frame.height);
  };
}

/**
 * シャッターボタンをクリック
 *
 * @return {void}
 **/
function onShutter() {
  hideParams("#img-noti", "#show-Detail", "#watch-tooltip", "#container-shutter", "#btn-shutter", "#hand");
  html2canvas(document.querySelector("#contents"), {
    imageTimeout: 15000,
    scale: 1,
    allowTaint: true,
    useCORS: true,
    logging: true,
  }).then((canvas) => {
    resImage = canvas.toDataURL("image/jpeg")
    photo.crossOrigin = 'anonymous';
    // photo.setAttribute("src", url);
    photo.style.backgroundImage = `url(${resImage})`;
    photo.style.backgroundImage = 'no-repeat';
    event.preventDefault();
  });
}

/**
 * ダイアログを表示
 *
 * @param {string} id
 **/
function dialogShow(id) {
  document.querySelector("#dialog-outer").style.display = "block";
  document.querySelector(id).style.display = "flex";
}

/**
 * ダイアログを非表示
 *
 * @param {string} id
 **/
function dialogHide(id) {
  document.querySelector("#dialog-outer").style.display = "none";
  document.querySelector(id).style.display = "none";
}

function dialogHideImgResult(id1, id2) {
  document.querySelector(id1).style.display = "none";
  document.querySelector(id2).style.display = "none";
}

function dialogShowImgResult(id1, id2) {
  document.querySelector(id1).style.display = "block";
  document.querySelector(id2).style.display = "block";
}
function hiddenTag(id) {
  document.querySelector(id).style.display = "none";
}
function showTag(id1, id2) {
  document.querySelector(id1).style.display = "flex";
  document.querySelector(id2).style.border = "none";
  document.querySelector(id2).style.padding = "0";
}
function changeWidth(id, value) {
  document.querySelector(id).style.height = value;
  document.querySelector(id).style.border = "5px solid #ebd8b9";
  document.querySelector(id).style.padding = "35px";
}

function hideParams(id1, id2, id3, id4, id5, id6) {
  document.querySelector(id1).style.visibility = "hidden";
  document.querySelector(id2).style.visibility = "hidden";
  document.querySelector(id3).style.visibility = "hidden";
  document.querySelector(id4).style.visibility = "hidden";
  document.querySelector(id5).style.visibility = "hidden";
  document.querySelector(id6).style.visibility = "hidden";
}

function showParams(id1, id2, id3, id4) {
  document.querySelector(id1).style.visibility = "visible";
  document.querySelector(id2).style.visibility = "visible";
  document.querySelector(id3).style.visibility = "visible";
}
