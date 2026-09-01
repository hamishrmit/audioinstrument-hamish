// browser loads html > browser loads js > open the dialog > user closes dialog > audio system loads > user clicks sound button

//find our dialog
const introDialog = document.getElementById("intro-dialog");

const introDialogCloseButton = document.getElementById("intro-dialog-close");

// init our synth
const synth = new Tone.PolySynth();

// find piano keys
const pianoKeys = document.querySelectorAll(".key");

// defined computer keys
const computerKeys = {
  a: "c4",
  s: "d4",
  d: "e4",
  f: "f4",
  g: "g4",
  h: "a4",
  j: "b4",
  k: "c5",
};

// is the user holding down mouse button
let mouseButtonHeld = false;

// if user holds down mouse, set to true, then if they let it up, set to false
window.addEventListener("mousedown", function () {
  mouseButtonHeld = true;
});
window.addEventListener("mouseup", function () {
  mouseButtonHeld = false;
});

//// dialog
// show dialog on page load
introDialog.showModal();
// close dialog when user clicks
introDialogCloseButton.addEventListener("click", function closeIntroDialog() {
  introDialog.close();
});
// we put the whole function inside the event listener instead as its only called here

// whenever dialog closes, initialise the audio system
introDialog.addEventListener("close", toneInit);

//// Tone
// run to setup our audio system
function toneInit() {
  synth.connect(Tone.Destination);
}

function startNote(e) {
  // find key that was pressed
  let keyPressed = e.target;
  // find the note associated with the key
  let note = keyPressed.dataset.note;
  synth.triggerAttack(note);
}

function endNote(e) {
  let keyPressed = e.target;
  let note = keyPressed.dataset.note;
  synth.triggerRelease(note);
}

// mouse piano interaction
pianoKeys.forEach(function (key) {
  key.addEventListener("mousedown", startNote);
  key.addEventListener("mouseup", endNote);
  key.addEventListener("mouseleave", endNote);
});

pianoKeys.forEach(function (key) {
  key.addEventListener("mouseenter", function (e) {
    if (mouseButtonHeld === true) {
      startNote(e);
    }
  });
});

// computer keyboard interaction
document.addEventListener("keydown", function (e) {
  const note = computerKeys[e.key.toLowerCase()];

  if (note) {
    synth.triggerAttack(note);

    const key = document.querySelector(`[data-note="${note}"]`);
    key.classList.add("active");
  }
});

document.addEventListener("keyup", function (e) {
  const note = computerKeys[e.key.toLowerCase()];

  if (note) {
    synth.triggerRelease(note);

    const key = document.querySelector(`[data-note="${note}"]`);
    key.classList.remove("active");
  }
});
