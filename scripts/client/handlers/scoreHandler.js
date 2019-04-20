MyGame.handlers.ScoreHandler = (function () {
    'use strict';

    let that = {}

    let playerScore = 0;
    let remotePlayerScores = {};


    let otherFont = "10pt \'Press Start 2P\'";
    
    let playerFont = "15pt \'Press Start 2P\'";

    let othersStrokeStyle = 'rgba(255, 255, 255, 1)';
    let othersFillStyle = 'rgba(255, 255, 255, .3)';

    let playersStrokeStyle = 'rgba(255, 255, 255, 1)';
    let playersFillStyle = 'rgba(255, 255, 255, .7)';


    that.update = function () {
        remotePlayerScores = {};
        playerScore = MyGame.main.playerSelf.model.score;
        let otherPlayers = MyGame.main.playerOthers;
        for (let id in otherPlayers) {
            if (otherPlayers[id].model.username !== '')
                remotePlayerScores[otherPlayers[id].model.username] = otherPlayers[id].model.score;
        }
        remotePlayerScores = sort_object(remotePlayerScores);
    }


    that.render = function () {
        let center = {
            x: 0.005,
            y: 0.005
        }

        // render Player and currRemoteScore
        MyGame.graphics.drawText({
            center: {
                x: center.x,
                y: center.y
            },
            font: playerFont,
            fillStyle: playersFillStyle,
            strokeStyle: playersStrokeStyle,
            text: MyGame.main.playerSelf.model.username + ': ' + playerScore,
        });

        center.y += 0.05

        // other scores
        for (let key in remotePlayerScores) {
            let currRemoteScore = remotePlayerScores[key];

            //render currRemoteScore
            MyGame.graphics.drawText({
                center: {
                    x: center.x,
                    y: center.y
                },
                font: otherFont,
                fillStyle: othersFillStyle,
                strokeStyle: othersStrokeStyle,
                text: key + ': ' + currRemoteScore,
            });
            center.y += 0.03
        }
    }



    //https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
    function sort_object(obj) {
        let items = Object.keys(obj).map(function (key) {
            return [key, obj[key]];
        });
        items.sort(function (first, second) {
            return second[1] - first[1];
        });
        let sorted_obj = {}

        for (let i in items) {
            let use_key = items[i][0];
            let use_value = items[i][1];
            sorted_obj[use_key] = use_value;
        }
        return (sorted_obj)
    }

    return that;
}());