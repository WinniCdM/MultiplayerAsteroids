// ------------------------------------------------------------------
//
// Rendering function for the minimap.
//
// ------------------------------------------------------------------
MyGame.renderer.Minimap = (function(graphics) {
    'use strict';
    let that = {};

    let minimapLocationX = 1.6;

    let worldSpec = {
        size:{
            width:.4,
            height:.4
        },
        fillStyle:'rgba(255, 255, 255, .2)',
        strokeStyle:'rgba(255, 255, 255, 1)'
    }

    let miniViewportSpec = {
        size:{
            width:.08,
            height:.04
        },
        fillStyle:'rgba(255, 255, 255, 0)',
        strokeStyle:'rgba(255, 255, 255, 1)'
    }

    let radius = .002;
    let playerSpec = {
        radius: radius,
        fillStyle: 'rgba(0, 100, 100, .7)'
    };
    let otherPlayersSpec = {
        radius: radius,
        fillStyle: 'rgba(0, 255, 0, .7)'
    }
    let asteroidSpec = {
        radius: radius,
        fillStyle: 'rgba(0, 0, 0, .7)'
    }
    let ufoSpec = {
        radius: radius,
        fillStyle: 'rgba(255, 0, 255, .7)'
    }
    let powerupSpec = {
        radius: radius,
        fillStyle: 'rgba(255, 255, 0, .7)'
    }

    that.render = function(minimapObject) {
        
        //render the minimap square
        let position = {
            x:minimapLocationX,
            y:0
        }
        graphics.drawSquare(position, worldSpec);

        
        //render the viewport square
        position = {
            x: minimapObject.miniViewport.x + minimapLocationX,
            y: minimapObject.miniViewport.y
        }
        
        graphics.drawSquare(position,miniViewportSpec);

        //render the player
        let center = {
            x: minimapObject.playerCenter.x + minimapLocationX,
            y: minimapObject.playerCenter.y
        }
        graphics.drawCircle(center,playerSpec);

        //render asteroids
        let asteroids = minimapObject.asteroidCenters;
        for(let id in asteroids){
            center = {
                x: asteroids[id].x + minimapLocationX,
                y: asteroids[id].y
            }
            graphics.drawCircle(center,asteroidSpec);
        }
        minimapObject.clearAsteroids();

        //render ufos
        let ufos = minimapObject.ufoCenters;
        for(let id in ufos){
            center = {
                x: ufos[id].x + minimapLocationX,
                y: ufos[id].y
            }
            graphics.drawCircle(center,ufoSpec);
        }
        minimapObject.clearUFOs();

        //render powerups
        let powerups = minimapObject.powerupCenters;
        for(let id in powerups){
            center = {
                x: powerups[id].x + minimapLocationX,
                y: powerups[id].y
            }
            graphics.drawCircle(center,powerupSpec);
        }
        minimapObject.clearPowerups();

        //render powerups
        let otherPlayers = minimapObject.otherPlayersCenters;
        for(let id in otherPlayers){
            center = {
                x: otherPlayers[id].x + minimapLocationX,
                y: otherPlayers[id].y
            }
            graphics.drawCircle(center,otherPlayersSpec);
        }
        minimapObject.clearOtherPlayers();


    };

    return that;

}(MyGame.graphics));
