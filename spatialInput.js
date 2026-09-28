/* inspired by: Patrick's XYController (https://github.com/rmit-idad-2650-wed/input-event-demos) */

const xyPad = document.getElementById("xyPad");
const marker = document.querySelector(".xyPosMarker");
const feedbackShape = document.querySelector(".feedbackShape");

let dragging = false;

// change the shape to match the marker position
// left is small (muffled), right is big (bright) top is square (short attack), bottom is round (long attack)
function updateShape(x, y) {
  const size = 30 + (x / 100) * 60;
  const roundness = (y / 100) * (size / 2);

  feedbackShape.setAttribute("x", 50 - size / 2);
  feedbackShape.setAttribute("y", 50 - size / 2);
  feedbackShape.setAttribute("width", size);
  feedbackShape.setAttribute("height", size);
  feedbackShape.setAttribute("rx", roundness);
}

function moveMarker(e) {
  const rect = xyPad.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  marker.setAttribute("cx", x);
  marker.setAttribute("cy", y);
  updateShape(x, y);

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

// set the starting shape for the marker's position in the centre
updateShape(50, 50);
