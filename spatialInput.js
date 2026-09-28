/* inspired by: Patrick's XYController (https://github.com/rmit-idad-2650-wed/input-event-demos) */

const xyPad = document.getElementById("xyPad");
const marker = document.querySelector(".xyPosMarker");
const spatialInput = document.querySelector(".spatialInput");

let dragging = false;

// change the pad colour to match the marker position
// left is cool blue (muffled), right is warm yellow (bright), top is vivid (short attack), bottom is pastel (long attack)
function updatePadColour(x, y) {
  const hue = 220 - (x / 100) * 175;
  const saturation = 90 - (y / 100) * 50;

  spatialInput.style.backgroundColor = `hsl(${hue}, ${saturation}%, 70%)`;
}

function moveMarker(e) {
  const rect = xyPad.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  marker.setAttribute("cx", x);
  marker.setAttribute("cy", y);
  updatePadColour(x, y);

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

// set the starting colour for the marker's position in the centre
updatePadColour(50, 50);
