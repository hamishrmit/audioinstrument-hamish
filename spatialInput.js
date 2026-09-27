/* inspired by: Patrick's XYController (https://github.com/rmit-idad-2650-wed/input-event-demos) */

const xyPad = document.getElementById("xyPad");
const marker = document.querySelector(".xyPosMarker");

let dragging = false;

function moveMarker(e) {
  const rect = xyPad.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  marker.setAttribute("cx", x);
  marker.setAttribute("cy", y);

  // X axis controls pitch, one octave down (left) to one octave up (right)
  synth.set({
    detune: (x / 100) * 2400 - 1200,
  });

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
