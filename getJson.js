import dataJson from "./ar-watch.json" assert { type: "json" };
const watch = dataJson[0];
console.log(watch);
// global vars : canvas, scroll & scale
let info = document.getElementById("info");
const canvas = document.getElementById("frame");
// const idZoom = document.querySelector("#frame");
canvas.width = 310;
canvas.height = 310;
let scale = 1;
let defaultValue = 0;
let otherValue = 0;
let imageElementScale = 1;
let start = {};

handleJson(watch);

// Calculate distance between two fingers
const distance = (event) => {
  return Math.hypot(event.touches[0].pageX, event.touches[0].pageY);
};

canvas.addEventListener("touchstart", (event) => {
  if (event.touches.length === 1) {
    event.preventDefault(); // Prevent page scroll

    // Calculate where the fingers have started on the X and Y axis
    start.x = event.touches[0].pageX;
    start.y = event.touches[0].pageY;
    start.distance = distance(event);
  }
});

canvas.addEventListener("touchmove", (event) => {
  if (event.touches.length === 1) {
    event.preventDefault(); // Prevent page scroll
    // Safari provides event.scale as two fingers move on the screen
    // For other browsers just calculate the scale manually
    if (event.scale) {
      scale = event.scale;
    } else {
      const deltaDistance = distance(event);
      scale = deltaDistance / start.distance;
    }
    // Calculate how much the fingers have moved on the X and Y axis
    const deltaX = event.touches[0].pageX * 1; 
    const deltaY = event.touches[0].pageY * 1;
    getDefaultDetailtY(deltaY);
    // Transform the image to make it grow and move with fingers
    // const scale
    if (deltaY < defaultValue) {
      // Zoom in
      scale = scale - 0.2;
    } else {
      // Zoom out
      scale = scale + 0.2;
    }

    imageElementScale = Math.min(Math.max(0.5, scale), 4);
    // Restrict scale
    // scale = Math.min(Math.max(0.5, scale), 2);
    const el = document.querySelector("#frame");
    el.style.transform = `scale(${imageElementScale})`;
    el.style.WebkitTransform = `scale(${imageElementScale})`;
    el.style.zIndex = "9999";
  }
});

function getDefaultDetailtY(deltaXValue) {
  if (deltaXValue > 0 && defaultValue <= 0) {
    return (defaultValue = deltaXValue);
  }

  return (otherValue = deltaXValue);
}

function handleJson(args) {
    const visit_reservation = document.getElementById("visit_reservation");
    // canvas.innerHTML = args.image1;
    document.getElementById("ref").innerHTML = args.ref;
    document.getElementById("product-overview").innerHTML = args.brandname + args.seriesname + args.itemname;
    document.getElementById("case_size").innerHTML = `Case size: ${args.case_size}`;
    document.getElementById("price").innerHTML = `Y${(args.price * (args.tax + 100)) / 100} (tax inc.)`;

    args.visit_reservation ? visit_reservation.style.display = 'block' : visit_reservation.style.display = 'none';
}
