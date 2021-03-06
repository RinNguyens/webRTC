// import dataJson from "./ar-watch.json" assert { type: "json" };
let watch = [];
const imageElement = document.getElementById("frame");
let imageElementScale = 1;
let start = {};

async function fetchJson() {
  const response = await fetch("./ar-watch.json");
  const json = await response.json();
  return json;
}

fetchJson().then((arr) => {
  let data_id = localStorage.getItem("data-id");
  if (data_id) {
    watch = getItemFromId(data_id, arr);
    handleJson(watch[0]);
  }
});

function getItemFromId(id, arr) {
  return arr.filter((item) => item.ID === +id);
}

function handleJson(args) {
  const visit_reservation = document.getElementById("visit_reservation");
  // canvas.innerHTML = args.image1;
  document.getElementById("title").href = args.url;
  document.getElementById("ref").innerHTML = args.ref;
  document.getElementById("product-overview").innerHTML =
    args.brandname + args.seriesname + args.itemname;
  document.getElementById(
    "case_size"
  ).innerHTML = `Case size: ${args.case_size}`;
  document.getElementById("price").innerHTML = `Y${
    (args.price * (args.tax + 100)) / 100
  } (tax inc.)`;

  // modal
  // document.getElementById("ref-modal").innerHTML = args.ref;
  // document.getElementById("product-overview-modal").innerHTML =
  //   args.brandname + args.seriesname + args.itemname;
  // document.getElementById(
  //   "case_size-modal"
  // ).innerHTML = `Case size: ${args.case_size}`;
  // document.getElementById("price-modal").innerHTML = `Y${
  //   (args.price * (args.tax + 100)) / 100
  // } (tax inc.)`;

  document.getElementById("phone-tell").href = `tel:${args.direct_phonenumber}`;
  document.getElementById("visit_reservation_book").href = args.url;


  args.visit_reservation
    ? (visit_reservation.style.display = "block")
    : (visit_reservation.style.display = "none");
}

// Calculate distance between two fingers
const distance = (event) => {
  return Math.hypot(
    event.touches[0].pageX - event.touches[1].pageX,
    event.touches[0].pageY - event.touches[1].pageY
  );
};

// Calculate distanceScale between two fingers
const distanceScale = (event) => {
  const dx = event.touches[0].pageX - event.touches[1].pageX;
  const dy = event.touches[0].pageY - event.touches[1].pageY;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
};

imageElement.addEventListener("touchstart", (event) => {
  if (event.touches.length === 2) {
    event.preventDefault(); // Prevent page scroll

    // Calculate where the fingers have started on the X and Y axis
    start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
    start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
    start.distance = distanceScale(event);
  }
});

imageElement.addEventListener("touchmove", (event) => {
  if (event.touches.length === 2) {
    event.preventDefault(); // Prevent page scroll
    // Safari provides event.scale as two fingers move on the screen
    // For other browsers just calculate the scale manually
    let scale = 1;

    if (event.scale) {
      scale = event.scale;
    } else {
      const deltaDistance = distanceScale(event);
      scale = deltaDistance / start.distance;
    }

    scale = Number.isNaN(scale) ? 1.0 : scale;
    scale = Math.max(scale, 1.1);
    scale = Math.min(scale, 2.3);

    // Transform the image to make it grow and move with fingers
    const el = document.querySelector("#frame");
    el.style.transform = `scale(${scale})`;
    el.style.WebkitTransform = `scale(${scale})`;
    el.style.zIndex = "9999";
  }
});
