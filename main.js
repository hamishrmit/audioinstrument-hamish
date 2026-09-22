// browser loads html > browser loads js > open the dialog > user closes dialog > audio system loads > user clicks sound button

//find our dialog
const introDialog = document.getElementById("intro-dialog");

const introDialogCloseButton = document.getElementById("intro-dialog-close");

// init our synth
const synth = new Tone.PolySynth({
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.7,
    release: 0.5,
  },
});

const filter = new Tone.Filter(1000, "lowpass");

synth.connect(filter);
filter.toDestination();

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

const blackComputerKeys = {
  w: "c#4",
  e: "d#4",
  t: "f#4",
  y: "g#4",
  u: "a#4",
};

const heldNotes = new Set();
const keyboardHeld = {};

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
  Tone.start();
}

function startNote(e) {
  let keyPressed = e.target;
  let note = keyPressed.dataset.note;

  if (!heldNotes.has(note)) {
    synth.triggerAttack(note);
    heldNotes.add(note);
  }

  keyPressed.classList.add("active");
}

function endNote(e) {
  let keyPressed = e.target;

  // find the note associated with the key
  let note = keyPressed.dataset.note;

  // stop the note
  synth.triggerRelease(note);
  heldNotes.delete(note);

  // remove visual feedback
  keyPressed.classList.remove("active");
}

// mouse piano interaction
pianoKeys.forEach(function (key) {
  key.addEventListener("mousedown", function (e) {
    key.mouseHeld = true;
    startNote(e);
  });

  key.addEventListener("mouseup", function (e) {
    key.mouseHeld = false;

    if (!keyboardHeld[key.dataset.note]) {
      endNote(e);
    }
  });

  key.addEventListener("mouseleave", function (e) {
    if (key.mouseHeld) {
      key.mouseHeld = false;

      if (!keyboardHeld[key.dataset.note]) {
        endNote(e);
      }
    }
  });
});

pianoKeys.forEach(function (key) {
  key.addEventListener("mouseenter", function (e) {
    if (mouseButtonHeld === true) {
      key.mouseHeld = true;
      startNote(e);
    }
  });
});

// computer keyboard interaction
document.addEventListener("keydown", function (e) {
  const keyPressed = e.key.toLowerCase();
  const note = computerKeys[keyPressed] || blackComputerKeys[keyPressed];

  if (note && !e.repeat) {
    const key = document.querySelector(`.keyboard [data-note="${note}"]`);

    keyboardHeld[keyPressed] = true;
    key.keyboardHeld = true;
    startNote({ target: key });
  }
});

document.addEventListener("keyup", function (e) {
  const keyPressed = e.key.toLowerCase();
  const note = computerKeys[keyPressed] || blackComputerKeys[keyPressed];

  if (note) {
    const key = document.querySelector(`.keyboard [data-note="${note}"]`);

    keyboardHeld[keyPressed] = false;
    key.keyboardHeld = false;

    if (!key.mouseHeld) {
      endNote({ target: key });
    }
  }
});
