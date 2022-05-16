//-----------------------------------------------------
// グローバル変数
//-----------------------------------------------------
const VIDEO = document.querySelector("#camera"); // <video>
const FRAME = document.querySelector("#frame"); // <canvas>
const STILL = document.querySelector("#still"); // <canvas>
const SE = document.querySelector('#se');
const width = document.querySelector('#contents').offsetWidth;
const hight = document.querySelector('#contents').offsetHeight;

const FRAMECOPY = document.querySelector("#frameCopy"); // <canvas>
/** フレーム素材一覧 */
const FRAMES = [{
  large: "image/w.png",
  small: "image/w.png"
}];


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("btn-shutter");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



/** カメラ設定 */
const CONSTRAINTS = {
  audio: false,
  video: {
    width: 1920,
    height: 1080,
    aspectRatio: 1.7777777778,
    // facingMode: "user" // フロントカメラを利用する
    facingMode: { exact: "environment" }  // リアカメラを利用する場合
  }
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
    drawFrameCopy(FRAMES[0].large); // 初期フレームを表示

    concatCanvas("#result", ["#still", "#frame"]); // フレームと合成

    // 最終結果ダイアログを表示
    setTimeout(() => { // 演出目的で少しタイミングをずらす
      dialogShow("#dialog-result");
    }, 300);
  });

  //-----------------------------
  // ダイアログ
  //-----------------------------
  // 閉じるボタン
  document.querySelector("#dialog-result-close").addEventListener("click", (e) => {
    VIDEO.play();
    dialogHide("#dialog-result");
  });

  // ダウンロードボタン
  document.querySelector("#dialog-result-dl").addEventListener("click", (e) => {
    canvasDownload("#result");
  });
};

/**
 * [onload] カメラを<video>と同期
 */

async function syncCamera() {
  try {
    await navigator.mediaDevices.getUserMedia(CONSTRAINTS)
      .then((stream) => {
        VIDEO.srcObject = stream;
        VIDEO.play();
        // VIDEO.onloadedmetadata = (e) => {
        //   VIDEO.play();
        // };
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
  FRAMES.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${item.small}">`; // <li><img ...></li>
    li.classList.add("framelist"); // <li class="framelist" ...
    li.setAttribute("data-index", i++); // <li data-index="1" ...

    // クリックされるとフレーム変更
    li.addEventListener("click", (e) => {
      const idx = e.target.parentElement.getAttribute("data-index"); // 親(parent)がli
      drawFrame(FRAMES[idx].large);
    })

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

/**
 * 指定フレームを描画する
 *
 * @param {string} path  フレームの画像URL
 * @return {void}
 */
 function drawFrameCopy(path) {
  const modal = "#dialog-nowloading";
  const image = new Image();
  image.src = path;
  image.onload = () => {
    const ctx = FRAMECOPY.getContext("2d");
    ctx.clearRect(0, 0, frame.width, frame.height);
    ctx.drawImage(image, 0, 0, frame.width, frame.height);

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
function onShutter() {
  const ctx = STILL.getContext("2d");
  // 前回の結果を消去
  ctx.clearRect(0, 0, STILL.width, STILL.height);

  // videoを画像として切り取り、canvasに描画
  ctx.drawImage(VIDEO, 0, 0, STILL.width, STILL.height);
}

/**
 * ダイアログを表示
 *
 * @param {string} id
 **/
function dialogShow(id) {
  document.querySelector("#myModal").style.display = "block";
  document.querySelector(id).style.display = "block";
}

/**
 * ダイアログを非表示
 *
 * @param {string} id
 **/
function dialogHide(id) {
  document.querySelector("#myModal").style.display = "none";
  document.querySelector(id).style.display = "none";
}