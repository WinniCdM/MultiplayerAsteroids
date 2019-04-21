MyGame.handlers.StatusHandler = (function(graphics){
    'use strict';
    let that = {};
    let updates = [];
    let reportedMessages = [];

    let UPDATE_TIMEOUT = 5000;

    let font = "10pt \'Press Start 2P\'";

    let strokeStyle = 'rgba(255, 255, 255, 1)';
    let fillStyle = 'rgba(255, 255, 255, .3)';


    that.createUpdate = function(message, multTimes){
        if ((!reportedMessages.includes(message)) || multTimes){
            let newStatusUpdate = {
                message: message,
                time: UPDATE_TIMEOUT
            }
            updates.push(newStatusUpdate);
            reportedMessages.push(message);
        }
    }

    that.update = function(elapsedTime){
        let updatesToDelete = []
        for (let i = 0; i < updates.length; i++){
            updates[i].time -= elapsedTime;
            if (updates[i].time <= 0){
                updatesToDelete.push(i);
            }
        }

        for (let i = 0; i < updatesToDelete.length; i++){
            let index = updatesToDelete[i];
            updates.splice(index, 1);
        }
    }

    that.render = function(){
        let center = {
            x: .005,
            y: .96
        }
        for (let i in updates){
            graphics.drawText({
                center:{
                    x: center.x,
                    y: center.y
                },
                font: font,
                fillStyle: fillStyle,
                strokeStyle: strokeStyle,
                text: updates[i].message
            });

            center.y -= 0.04
        }
    }

    return that;
}(MyGame.graphics));