MyGame.handlers.ScoreHandler = (function(){
    'use strict';

    let that = {}

    let playerScore = 0;
    let remotePlayerScores = {};

    
    let Font = "10pt \'Press Start 2P\'";

    let othersStrokeStyle= 'rgba(255, 255, 255, .3)';
    let othersFillStyle = 'rgba(255, 255, 255, .3)';
    
    let playersStrokeStyle= 'rgba(255, 0, 255, .7)';
    let playersFillStyle = 'rgba(255, 0, 255, .7)';


    that.update = function(){
        playerScore = MyGame.main.playerSelf.model.score;
        let otherPlayers = MyGame.main.playerOthers;
        for(let id in otherPlayers){
            if(otherPlayers[id].model.username !== '')
                remotePlayerScores[otherPlayers[id].model.username] = otherPlayers[id].model.score;
        }
        remotePlayerScores = sort_object(remotePlayerScores);
    }


    that.render = function(){
        let center = {
            x:0.005,
            y:0.005
        }
        let i = 1;
        let renderedPlayer = false;
        

        if(Object.keys(remotePlayerScores).length){
            for(let key in remotePlayerScores){
                let currRemoteScore = remotePlayerScores[key];
                if(currRemoteScore <= playerScore && !renderedPlayer){
                    renderedPlayer = true;
                    //render Player and currRemoteScore
                    MyGame.graphics.drawText({
                        center: {
                            x: center.x,
                            y: center.y
                        },
                        font: Font,
                        fillStyle: playersFillStyle,
                        strokeStyle: playersStrokeStyle,
                        text: i + '. ' + MyGame.main.playerSelf.model.username + ': ' + playerScore,
                    });
                    i++;
                    center.y +=0.05
                    //render currRemoteScore
                    MyGame.graphics.drawText({
                        center: {
                            x: center.x,
                            y: center.y
                        },
                        font: Font,
                        fillStyle: othersFillStyle,
                        strokeStyle: othersStrokeStyle,
                        text: i + '. ' + key + ': ' + currRemoteScore,
                    });
                    i++;
                    center.y +=0.05
                }
                else{
                    //render currRemoteScore
                    MyGame.graphics.drawText({
                        center: {
                            x: center.x,
                            y: center.y
                        },
                        font: Font,
                        fillStyle: othersFillStyle,
                        strokeStyle: othersStrokeStyle,
                        text: i + '. ' + key + ': ' + currRemoteScore,
                    });
                    i++;
                    center.y +=0.05
                }
            }
        }
        else{
            //just render player
            MyGame.graphics.drawText({
                center: {
                    x: center.x,
                    y: center.y
                },
                font: Font,
                fillStyle: playersFillStyle,
                strokeStyle: playersStrokeStyle,
                text: i + '. ' + MyGame.main.playerSelf.model.username + ': ' + playerScore,
            });
        }

    }



//https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
    function sort_object(obj) {
        let items = Object.keys(obj).map(function(key) {
            return [key, obj[key]];
        });
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        let sorted_obj={}

        for(let i in items){
            let use_key = items[i][0];
            let use_value = items[i][1];
            sorted_obj[use_key] = use_value;
        }
        return(sorted_obj)
    } 
    
    return that;
}());