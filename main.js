// browser loads html > browser loads js > open the dialog > user closes dialog > audio system loads > user clicks sound button

//find our dialog
const introDialog = document.getElementById("intro-dialog");
// show the found element in our browser console
// console.log(introDialog);

const introDialogCloseButton = document.getElementById("intro-dialog-close");

// find our test button
const testButton = document.getElementById("test-button");
// find my key button for testing
const key = document.getElementById("key-test");

// init our synth
// changed this to poly synth
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

// is the user currently holding down the key
let mouseButtonHeld = false;
// if user holds down key, set to true, then if they let it up, set to false
window.addEventListener("mousedown", function () {
  mouseButtonHeld = true;
});
window.addEventListener("mouseup", function () {
  mouseButtonHeld = false;
});

//// Dialog
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

// do something when this button is clicked
// testButton.addEventListener("click", playNote);

// function that runs when button is clicked
function playNote() {
  // play a note for a duration
  synth.triggerAttackRelease("c4", "8n");
}

function playDataNote(e) {
  console.log(e);
  let buttonClicked = e.target;
  // console.log(buttonClicked);
  let note = buttonClicked.dataset.note;
  // console.log(e.target);
  synth.triggerAttackRelease(note, "8n");
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

key.addEventListener("mousedown", startNote);
key.addEventListener("mouseup", endNote);
key.addEventListener("mouseleave", endNote);
// if user is holding mouse button down when entering the key play note
key.addEventListener("mouseenter", function (e) {
  if (mouseButtonHeld === true) {
    startNote(e);
  }
});

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

// key.addEventListener("click", playDataNote);
// testButton.addEventListener("click", playDataNote);

// when i click the button i want to play audio file
const playButton = document.getElementById("play-button");
const randomButton = document.getElementById("random-time");
const audioTrack = document.getElementById("audio-track");

function playPauseAudio() {
  if (audio.paused) {
    audioTrack.play();
  } else {
    audioTrack.pause();
  }
}

function randomTime() {
  let trackLength = audioTrack.duration;
  audioTrack.currentTime = trackLength * Math.random();
}
randomButton.addEventListener("click", randomTime);

playButton.addEventListener("click", playPauseAudio);

// set slider to change oscillator
const oscSlider = document.getElementById("osc-range");

function changeOsc(e) {
  console.log(e.target.value);
  if (e.target.value > 50) {
    synth.set({
      oscillator: {
        type: "square",
      },
    });
  } else {
    synth.set({
      oscillator: {
        type: "sine",
      },
    });
  }
}

oscSlider.addEventListener("change", changeOsc);

// spatial control section
const flowerPainting = document.getElementById("flower-painting");

flowerPainting.addEventListener("mouseenter", startNote);
flowerPainting.addEventListener("mouseleave", endNote);

function pitchBend(e) {
  console.log(e.layerX);
  synth.set({
    detune: e.layerX,
  });
}

flowerPainting.addEventListener("mousemove", pitchBend);

// event listeners for computer keys
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

/////// TEMPORAL

// let currentInstant = Temporal.Now.instant();
// console.log(currentInstant);
// //find our local time zone
// let timeZone = Temporal.Now.timeZoneId();
// // convert to local time
// let currentTime = currentInstant.toZonedDateTimeISO(timeZone);
// console.log(currentTime);
// // convert to plain time
// let plainTime = Temporal.PlainTime.from(currentTime);
// console.log(plainTime.minute);

// if (plainTime.minute > 54) {
//   audioTrack.playbackRate = 0.5;
// }
