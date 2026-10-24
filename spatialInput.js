/* inspired by: Patrick's XYController (https://github.com/rmit-idad-2650-wed/input-event-demos) */

const xyPad = document.getElementById("xyPad");
const marker = document.querySelector(".xyPosMarker");
const feedbackShape = document.querySelector(".feedbackShape");

let dragging = false;

// change the shape colour to match the marker position
// left is cool blue (muffled), right is warm yellow (bright), top is vivid (short attack), bottom is pastel (long attack)
function updateShapeColour(x, y) {
  const hue = 220 - (x / 100) * 175;
  const saturation = 90 - (y / 100) * 50;

  feedbackShape.style.fill = `hsl(${hue}, ${saturation}%, 70%)`;
}

// change the shape to match the marker position
// left is small (muffled), right is big (bright), top is square (short attack), bottom is round (long attack)
function updateShape(x, y) {
  const size = 30 + (x / 100) * 60;
  const roundness = (y / 100) * (size / 2);

  feedbackShape.setAttribute("x", 50 - size / 2);
  feedbackShape.setAttribute("y", 50 - size / 2);
  feedbackShape.setAttribute("width", size);
  feedbackShape.setAttribute("height", size);
  feedbackShape.setAttribute("rx", roundness);
}

// pulse the shape when a note starts, quick pop if marker is set to short, slow swell if set to long
function pulseShape() {
  const attack = synth.get().envelope.attack;
  feedbackShape.style.animationDuration = `${0.3 + attack}s`;

  // remove and re-add the class so the animation restarts every time
  feedbackShape.classList.remove("pulse");
  void feedbackShape.getBoundingClientRect();
  feedbackShape.classList.add("pulse");
}

function moveMarker(e) {
  const rect = xyPad.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  marker.setAttribute("cx", x);
  marker.setAttribute("cy", y);
  updateShapeColour(x, y);
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

// set the starting colour + shape for the marker's position in the centre
updateShapeColour(50, 50);
updateShape(50, 50);
