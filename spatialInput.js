/* inspired by: Patrick's XYController (https://github.com/rmit-idad-2650-wed/input-event-demos) */

const xyPad = document.getElementById("xyPad");
const marker = document.querySelector(".xyPosMarker");

let dragging = false;

// the sound settings for each corner of the pad
const corners = {
  topLeft: { brightness: 0.1, pitch: -12, echo: 0.1 },
  topRight: { brightness: 0.6, pitch: 0, echo: 0 },
  bottomLeft: { brightness: 0.2, pitch: 0, echo: 0.6 },
  bottomRight: { brightness: 1, pitch: 12, echo: 0.6 },
};

// blended a setting between the four corners based on the marker position
function blendCorners(setting, x, y) {
  const u = x / 100;
  const v = y / 100;

  return (
    corners.topLeft[setting] * (1 - u) * (1 - v) +
    corners.topRight[setting] * u * (1 - v) +
    corners.bottomLeft[setting] * (1 - u) * v +
    corners.bottomRight[setting] * u * v
  );
}

// update the sound to match the marker position
function updateSound(x, y) {
  filter.frequency.value = 200 * Math.pow(25, blendCorners("brightness", x, y));

  synth.set({
    detune: blendCorners("pitch", x, y) * 100,
  });

  echo.wet.value = blendCorners("echo", x, y);
}

function moveMarker(e) {
  const rect = xyPad.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  marker.setAttribute("cx", x);
  marker.setAttribute("cy", y);

  updateSound(x, y);
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

// match the sound to the marker's starting position in the centre
updateSound(50, 50);
