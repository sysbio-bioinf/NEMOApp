let Vocoder = class Vocoder {
    constructor() {
        this.config = require("../vocoder/vocoderConfig.json");
        this.audio = require('nativescript-audio');
        this.appSettings = require("tns-core-modules/application-settings");
        this.audioPlayer = new this.audio.TNSPlayer();
//this.audioPlayer.debug=true	

        this.playAudioFile = this.playAudioFileP.bind(this);
        this.playNextAudioFile = this.playNextAudioFileP.bind(this);
        this.speakQuestion = this.speakQuestionP.bind(this);


        this.audioPlayerOptions = {
            loop: false,
            completeCallback: this.playNextAudioFile,
            errorCallback: function (errorObject) {
                console.log(JSON.stringify(errorObject));
            },
            infoCallback: function (args) {
                console.log(JSON.stringify(args));
            }
        };
        this.fileNumber = 0;
        this.fileCount = 0;
        this.fileList = new Array();
    }

    playAudioFileP() {
        this.audioPlayer.dispose();
	this.audioPlayer = new this.audio.TNSPlayer();
//console.log(this.audioPlayerOptions.audioFile)	
        this.audioPlayer
            .playFromFile(this.audioPlayerOptions)
            .then(function (res) {
//                console.log(res);
            })
            .catch(function (err) {
                console.log('something went wrong...', err);
            });
    }

    playNextAudioFileP() {
        if (this.fileNumber < (this.fileCount - 1)) {
            this.fileNumber++;
            this.fileName = this.fileList[this.fileNumber];
            this.audioPlayerOptions.audioFile = this.config.mp3Path + this.fileName;
            this.playAudioFile();
            this.cb_spoken_answer(this.fileNumber)
        } else {
            //console.log("DEBUG: question finished - fileNumber=" + this.fileNumber + ", fileCount=" + this.fileCount);
            this.fileNumber = 0;
            this.fileName = "";
            this.fileList = new Array();
	    this.cb_spoken_answer(-1)	// signal we are done
        }
    }

    speakQuestionP(questionIndex) {
        const text2Speech = this.appSettings.getBoolean("Text2Speech");
        const maleVoice = this.appSettings.getBoolean("MaleVoice");
        if (text2Speech) {
            const questionId = this.config.indexToId[questionIndex];
            var configKey = "mp3FilesFemale";
            if (maleVoice) {
                configKey = "mp3FilesMale";
            }
            const mp3Config = this.config[configKey];
            
            if (typeof mp3Config[questionId] == "object") {
                this.fileList = mp3Config[questionId];
                this.fileCount = this.fileList.length;
                
                this.fileNumber = 0;
                this.fileName = this.fileList[this.fileNumber];
                this.audioPlayerOptions.audioFile = this.config.mp3Path + this.fileName;
		this.volume=1
                this.playAudioFile();
            } else {
                console.log("WARNING: unknown question ID '" + questionId + "' in call of method 'speakQuestion'");
            }
        }
    }
}

exports.Vocoder = Vocoder;
