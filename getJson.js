// // import dataJson from "./ar-watch.json" assert { type: "json" };
// // const watch = dataJson[0];
// // console.log(watch);
// // global vars : canvas, scroll & scale
// let info = document.getElementById("info");
const imageElement = document.getElementById("frame");
// // const idZoom = document.querySelector("#frame");
// canvas.width = 310;
// canvas.height = 310;
// let scale = 1;
// let defaultValue = 0;
// let otherValue = 0;
// let imageElementScale = 1;
// let start = {};

// handleJson(watch);

// Calculate distance between two fingers
// const distance = (event) => {
//   return Math.hypot(event.touches[0].pageX, event.touches[0].pageY);
// };

// canvas.addEventListener(
//   "touchstart",
//   (event) => {
//     event.preventDefault(); // Prevent page scroll

//     // Calculate where the fingers have started on the X and Y axis
//     start.x = event.touches[0].pageX;
//     start.y = event.touches[0].pageY;
//     start.distance = distance(event);
//   },
//   false
// );

// canvas.addEventListener(
//   "touchmove",
//   (event) => {
//     event.preventDefault(); // Prevent page scroll
//     // Safari provides event.scale as two fingers move on the screen
//     // For other browsers just calculate the scale manually
//     if (event.scale) {
//       scale = event.scale;
//     } else {
//       const deltaDistance = distance(event);
//       scale = deltaDistance / start.distance;
//     }
//     // Calculate how much the fingers have moved on the X and Y axis
//     const deltaX = event.touches[0].pageX * 1;
//     const deltaY = event.touches[0].pageY * 1;
//     getDefaultDetailtY(deltaY);
//     // Transform the image to make it grow and move with fingers
//     // const scale
//     if (deltaY < defaultValue) {
//       // Zoom in
//       scale = scale - 0.2;
//     } else {
//       // Zoom out
//       scale = scale + 0.2;
//     }

//     imageElementScale = Math.min(Math.max(0.5, scale), 4);
//     console.log(imageElementScale, "imageElementScale");
//     // Restrict scale
//     // scale = Math.min(Math.max(0.5, scale), 2);
//     const el = document.querySelector("#frame");
//     console.log(el, "el");
//     el.style.transform = `scale(${imageElementScale})`;
//     el.style.WebkitTransform = `scale(${imageElementScale})`;
//     el.style.zIndex = "9999";
//   },
//   false
// );

// function getDefaultDetailtY(deltaXValue) {
//   if (deltaXValue > 0 && defaultValue <= 0) {
//     return (defaultValue = deltaXValue);
//   }

//   return (otherValue = deltaXValue);
// }

// function handleJson(args) {
//   const visit_reservation = document.getElementById("visit_reservation");
//   // canvas.innerHTML = args.image1;
//   document.getElementById("ref").innerHTML = args.ref;
//   document.getElementById("product-overview").innerHTML =
//     args.brandname + args.seriesname + args.itemname;
//   document.getElementById(
//     "case_size"
//   ).innerHTML = `Case size: ${args.case_size}`;
//   document.getElementById("price").innerHTML = `Y${
//     (args.price * (args.tax + 100)) / 100
//   } (tax inc.)`;

//   args.visit_reservation
//     ? (visit_reservation.style.display = "block")
//     : (visit_reservation.style.display = "none");
// }
let imageElementScale = 1;

let start = {};

// Calculate distance between two fingers
const distance = (event) => {
  return Math.hypot(
    event.touches[0].pageX - event.touches[1].pageX,
    event.touches[0].pageY - event.touches[1].pageY
  );
};

imageElement.addEventListener("touchstart", (event) => {
  // console.log('touchstart', event);
  if (event.touches.length === 2) {
    event.preventDefault(); // Prevent page scroll

    // Calculate where the fingers have started on the X and Y axis
    start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
    start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
    start.distance = distance(event);
  }
});

imageElement.addEventListener("touchmove", (event) => {
  console.log(event);
  // console.log('touchmove', event);
  if (event.touches.length === 2) {
    event.preventDefault(); // Prevent page scroll

    // Safari provides event.scale as two fingers move on the screen
    // For other browsers just calculate the scale manually
    let scale;
    if (event.scale) {
      scale = event.scale;
    } else {
      const deltaDistance = distance(event);
      scale = deltaDistance / start.distance;
    }
    imageElementScale = Math.min(Math.max(0.6, scale), 2);

    // Calculate how much the fingers have moved on the X and Y axis
    const deltaX =
      ((event.touches[0].pageX + event.touches[1].pageX) / 2 - start.x) * 2; // x2 for accelarated movement
    const deltaY =
      ((event.touches[0].pageY + event.touches[1].pageY) / 2 - start.y) * 2; // x2 for accelarated movement

    // Transform the image to make it grow and move with fingers
    // const transform = `scale(${imageElementScale})`;
    // imageElement.style.transform = transform;
    // imageElement.style.WebkitTransform = transform;
    // imageElement.style.zIndex = "9999";
    const el = document.querySelector("#frame");
    el.style.transform = `scale(${imageElementScale})`;
    el.style.WebkitTransform = `scale(${imageElementScale})`;
    el.style.zIndex = "9999";
  }
});
