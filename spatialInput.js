/* inspired by: Patrick's XYController (https://github.com/rmit-idad-2650-wed/input-event-demos) */

const xyPad = document.getElementById("xyPad");
const marker = document.querySelector(".xyPosMarker");

let dragging = false;

// this changes the marker to match its position
// left is cool blue (muffled), right is warm yellow (bright)
function updateMarker(x, y) {
  const hue = 220 - (x / 100) * 175;
  marker.setAttribute("fill", `hsl(${hue}, 90%, 55%)`);
}

function moveMarker(e) {
  const rect = xyPad.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  marker.setAttribute("cx", x);
  marker.setAttribute("cy", y);
  updateMarker(x, y);

  // X axis controls filter frequency
  filter.frequency.value = 200 * Math.pow(25, x / 100);

  // Y axis controls envelope attack
  synth.set({
    envelope: {
      attack: 0.01 + (y / 100) * 0.99,
    },
  });
}

xyPad.addEventListener("mousedown", function (e) {
  dragging = true;
  moveMarker(e);
});

window.addEventListener("mouseup", function () {
  dragging = false;
});

xyPad.addEventListener("mousemove", function (e) {
  if (dragging) {
    moveMarker(e);
  }
});

// set the markers starting look for its position in the centre
updateMarker(50, 50);
