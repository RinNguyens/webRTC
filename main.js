//-----------------------------------------------------
// グローバル変数
//-----------------------------------------------------
const VIDEO = document.querySelector("#camera"); // <video>
const idVideo = document.getElementById("dialog-result");
const FRAME = document.querySelector("#frame"); // <canvas>
const FRAMERESULT = document.querySelector("#frameResult"); // <canvas>
const RESULTIMG = document.querySelector("#resultImg");
const STILL = document.querySelector("#still"); // <canvas>
const SE = document.querySelector("#se");
const photo = document.getElementById("photo");

let getWeight = {};
let startFrame = {};

let base64 = null;

/** フレーム素材一覧 */
const FRAMES = [
  {
    large: "image/watch.png",
    small: "image/w.png",
  },
];

/** カメラ設定 */
const CONSTRAINTS = {
  audio: false,
  video: {
    width: 1920,
    height: 1080,
    // facingMode: "user" // フロントカメラを利用する
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
  VIDEO.play();

  startFrame = FRAME.getBoundingClientRect();
  //-----------------------------
  // フレーム初期化
  //-----------------------------
  drawFrame(FRAMES[0].large); // 初期フレームを表示
  setFrameList(); // 切り替え用のフレーム一覧を表示

  //-----------------------------
  // シャッターボタン
  //-----------------------------
  document.querySelector("#btn-shutter").addEventListener("click", () => {
    // SE再生＆映像停止
    VIDEO.pause();
    SE.play();

    // 画像の生成
    onShutter(); // カメラ映像から静止画を取得

    // get width and height IMG

    // concatCanvas("#resultImg", ["#frameResult"], WH); // フレームと合成
    changeWidth("#dialog-result", "80%");
    hiddenTag("#content-detail");
    dialogShowImgResult("#wrapImg", "#download");
    // 最終結果ダイアログを表示
    setTimeout(() => {
      // 演出目的で少しタイミングをずらす
      dialogShow("#dialog-result");
    }, 400);
  });

  document.querySelector("#show-Detail").addEventListener("click", () => {
    VIDEO.pause();
    changeWidth("#dialog-result", "auto");
    showTag("#content-detail");
    dialogHideImgResult("#wrapImg", "#download");
    setTimeout(() => {
      dialogShow("#dialog-result");
    }, 400);
  });

  //-----------------------------
  // ダイアログ
  //-----------------------------
  // 閉じるボタン
  document
    .querySelector("#dialog-result-close")
    .addEventListener("click", (e) => {
      VIDEO.play();
      dialogHide("#dialog-result");
    });

  // ダウンロードボタン
  document.querySelector("#dialog-result-dl").addEventListener("click", (e) => {
    // canvasDownload("#photo", base64);
    html2canvas(document.querySelector("#resultImg")).then((canvas) => {
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
 * [onload] フレーム一覧を表示する
 *
 * @return {void}
 **/
function setFrameList() {
  const list = document.querySelector("#framelist");
  let i = 0;
  FRAMES.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${item.small}">`; // <li><img ...></li>
    li.classList.add("framelist"); // <li class="framelist" ...
    li.setAttribute("data-index", i++); // <li data-index="1" ...

    // クリックされるとフレーム変更
    li.addEventListener("click", (e) => {
      const idx = e.target.parentElement.getAttribute("data-index"); // 親(parent)がli
      drawFrame(FRAMES[idx].large);
    });

    // ulに追加
    list.appendChild(li);
  });
}

/**
 * 指定フレームを描画する
 *
 * @param {string} path  フレームの画像URL
 * @return {void}
 */
function drawFrame(path) {
  const modal = "#dialog-nowloading";
  const image = new Image();
  image.src = path;
  image.onload = () => {
    const ctx = FRAME.getContext("2d");
    ctx.clearRect(0, 0, frame.width, frame.height);
    ctx.drawImage(image, 0, 0, frame.width, frame.height);

    setTimeout(() => {
      dialogHide(modal);
    }, 100);
  };
  dialogShow(modal);
}

async function drawFrameCopy(path, obj) {
  console.log(obj, 'obj')
  const modal = "#dialog-nowloading";
  const image = new Image();
  image.src = path;
  frameResult.width = obj.width - 120;
  frameResult.height = obj.height - 100;

  image.onload = () => {
    const ctx = FRAMERESULT.getContext("2d");
    ctx.clearRect(0, 0, frameResult.width, frameResult.height);
    ctx.drawImage(image, 0, 0, frameResult.width, frameResult.height);

    setTimeout(() => {
      dialogHide(modal);
    }, 100);
  };
  dialogShow(modal);
}

/**
 * シャッターボタンをクリック
 *
 * @return {void}
 **/
async function onShutter() {
  console.log(FRAME.getBoundingClientRect(), 'asdas')

  getWeight = {
    height: FRAME.getBoundingClientRect().height,
    width: FRAME.getBoundingClientRect().width,
  }
  await drawFrameCopy(FRAMES[0].large, getWeight);

  if (getWeight.height > startFrame.height) {
    frameResult.style.top = '50%';
    frameResult.style.left = '30%';
    console.log(11111111);
  }


  const ctx = STILL.getContext("2d");

  ctx.clearRect(0, 0, STILL.width, STILL.height);

  // videoを画像として切り取り、canvasに描画
  ctx.drawImage(VIDEO, 0, 0, STILL.width, STILL.height);

  base64 = STILL.toDataURL("image/png");
  photo.setAttribute("src", base64);

  const img = new Image();

  img.src = base64;

  img.onload = function () {
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
  };
}

/**
 * ダイアログを表示
 *
 * @param {string} id
 **/
function dialogShow(id) {
  document.querySelector("#dialog-outer").style.display = "block";
  document.querySelector(id).style.display = "block";
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
function showTag(id) {
  document.querySelector(id).style.display = "inline-grid";
}
function changeWidth(id, value) {
  document.querySelector(id).style.height = value;
}
