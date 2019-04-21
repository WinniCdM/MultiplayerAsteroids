// ------------------------------------------------------------------
//
// Nodejs module that represents the handler for highScores
//
// ------------------------------------------------------------------
'use strict';

function highScoreHandler(activeClients){
    let that = {};
    let highScores = [0,0,0,0,0];
    let currScores = [];//dictionary where username is key, score is value
    let updateHighScores = false;
    that.updatePlayers = false;

    Object.defineProperty(that, 'highScores', {
        get: () => highScores
    });

    that.update = function(elapsedTime){
        for(let id in activeClients){
            currScores.push(activeClients[id].model.score);
        }
        console.log('before sort currScores: ', currScores);

        currScores.sort();
        
        console.log('after sort currScores: ', currScores);


        //check if any scores were updated.
        console.log('before sort highScores: ', highScores);
        for(let j = 0; j < currScores.length;j++){
            let score = currScores[j];
            for (let i = 0; i < highScores.length; i++) {
                if (highScores[i] < score) {
                    let temp = highScores[i];
                    highScores[i] = score;
                    score = temp;
                    updateHighScores = true;
                }
            }
        }
        console.log('after sort highScores: ', highScores);

        if(updateHighScores){
            that.saveHighScores();
            updateHighScores = false;
            that.updatePlayers  = true;
        }
        
 

    }

   


    that.loadHighScores = function(){
        let myFile = fopen("../../../assets/highscores.txt", r);

        let previousScores = fgets(myFile);
        if(previousScores != null){
            highScores = JSON.parse(previousScores)
        }
        flcose(myFile);
    }

    that.saveHighScores = function(){
        let myFile = fopen("../../../assets/highscores.txt", w);

        let scoresToSave = JSON.stringify(highScores);

        fwrite(myFile,scoresToSave);
        flcose(myFile);
    }


    return that;
};

module.exports.create = (activeClients) => highScoreHandler(activeClients);