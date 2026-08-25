/* inspired by: Patrick's XYController (https://github.com/rmit-idad-2650-wed/input-event-demos) */

const xyPad = document.getElementById("xyPad");
const marker = document.querySelector(".xyPosMarker");

xyPad.addEventListener("mousemove", function (e) {
  const rect = xyPad.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  marker.setAttribute("cx", x);
  marker.setAttribute("cy", y);
});
