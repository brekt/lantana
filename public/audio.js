var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var osc1 = audioContext.createOscillator();
var osc2 = audioContext.createOscillator();
var osc3 = audioContext.createOscillator();
var osc4 = audioContext.createOscillator();
var osc5 = audioContext.createOscillator();
var osc6 = audioContext.createOscillator();

osc1.type = 'sine';
osc2.type = 'sine';
osc3.type = 'sine';
osc4.type = 'sine';
osc5.type = 'sine';
osc6.type = 'sine';

function soundChord(note1, note2, note3, note4, note5, note6, duration) {
    osc1.frequency.value = note1;
    osc2.frequency.value = note1;
    osc3.frequency.value = note1;
    osc4.frequency.value = note1;
    osc5.frequency.value = note1;
    osc6.frequency.value = note1;
    osc1.start();
    osc1.stop(audioContext.currentTime + 2);
    osc2.start();
    osc2.stop(audioContext.currentTime + 2);
    osc3.start();
    osc3.stop(audioContext.currentTime + 2);
    osc4.start();
    osc4.stop(audioContext.currentTime + 2);
    osc5.start();
    osc5.stop(audioContext.currentTime + 2);
    osc6.start();
    osc6.stop(audioContext.currentTime + 2);
}

soundChord(440, 600, 750);
