const { slide: slide1 } = require('./slideGeneral');
const { slide: slide2 } = require('./slideDiarrhoe');
const { slide: slide3 } = require('./slideVomit');
const { slide: slide4 } = require('./slidePain');
const { slide: slide5 } = require('./slideMuco');
const { slide: slide6 } = require('./slideNausea');
const { slide: slide7 } = require('./slidePNP');
const { slide: slide8 } = require('./slideMovement');
const { slide: slide9 } = require('./slideWeight');
const { slide: slide10 } = require('./slideComment');
const { slide: slide11 } = require('./slideMedication');
const { slide: slide12 } = require('./slideDone');
const { slide: slide13 } = require('./slideFatigue');
const { slide: slide14 } = require('./slideHypertension');
const { slide: slide15 } = require('./slideEczema');
const { slide: slide16 } = require('./slideLiver');
const { slide: slide17 } = require('./slideVision');
const { slide: slide18 } = require('./slideRaceHeart');
const { slide: slide19 } = require('./slideMuscle');
const { slide: slide20 } = require('./slideJoint');
const { slide: slide21 } = require('./slideBreath');
const { slide: slide22 } = require('./slideExercise');
const { slide: slide23 } = require('./slideDoneLong');
const slidesStd = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide13, slide8, slide9, slide10, slide11, slide12];
//short names
const namesStd = ["wellness", "diarrhoe", "vomit", "pain", "muco", "nausea", "pnp", "fatigue", "movement", "weight", "event", "medication"];
const orientationsStd = ["vertical", "horizontal", "horizontal", "horizontal", "vertical", "vertical", "vertical", "vertical", "horizontal", "vertical", "vertical"];



const slidesSpec = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide13, slide8, slide9, slide10, slide11,
					slide14, slide15, slide16, slide17, slide19, slide20, slide21, slide22, slide18, slide23];
//short names
const namesSpec = ["wellness", "diarrhoe", "vomit", "pain", "muco", "nausea", "pnp", "fatigue", "movement", "weight", "event", "medication","hypertension", "eczema", "liver", "vision", "muscle", "joint", "breath","exercise","raceheart"];
const orientationsSpec = ["vertical", "horizontal", "horizontal", "horizontal", "vertical", "vertical", "vertical", "vertical", "horizontal", "vertical", "vertical",
						  "vertical", "vertical", "vertical", "vertical", "vertical", "vertical"];
const nameToIndex = {
	"wellness": 0, 
	"diarrhoe": 1, 
	"vomit": 2, 
	"pain": 3, 
	"muco": 4, 
	"nausea": 5, 
	"pnp": 6, 
	"fatigue": 7, 
	"movement": 8, 
	"weight": 9, 
	"event": 10, 
	"medication": 11,
	"hypertension": 12, 
	"eczema": 13, 
	"liver": 14, 
	"vision": 15, 
	"muscle": 16, 
	"joint": 17, 
	"breath": 18,
	"exercise": 19,
	"raceheart": 20,
	"summarylong": 21,
	"summary": 12
};

module.exports = {
    slides: slidesStd,
    names: namesStd,
	orientations: orientationsStd,
	slidesSpec: slidesSpec,
	namesSpec: namesSpec,
	orientationsSpec: orientationsSpec,
	nameToIndex: nameToIndex
};
