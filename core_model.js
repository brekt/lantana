// constants

var NOTES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

var model = {};

var Meter = function() {
	this.numberOfNotesPerMeasure
	this.kindOfNotesPerMeasure
}







Meter.prototype = {
	getString: function () {
		return this.numberOfNotesPerMeasure + "/" + this.kindOfNotesPerMeasure;
	}
};









var Note = function() {
	this.letter // A, B, C, D, E, F, G
	this.symbol // b, #, bb, X
	this.octave // 
};









var Chord = function() {
	this.rootNote // Note
	this.notes = []; // [Note, ...]
};









Chord.prototype = {
	addNote : function (letter, symbol) {

		var note = new Note();
		note.letter = letter;
		note.symbol = symbol;

		this.notes.push(note);
	}
}








var Song = function() {
	this.chords // [Chord, ...]
	this.tempo
	this.meter
	this.key
};

var AppModel = function() {

}
AppModel.prototype = {}

// or

var appModel = {
	instanceId : 0,
	lastUsed : 0,
	songs : [];
}


// When page starts up it creates appModel. The appModel is a bunch of chunks from core model.

