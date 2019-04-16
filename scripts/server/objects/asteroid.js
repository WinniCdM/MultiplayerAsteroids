// ------------------------------------------------------------------
//
// Nodejs module that represents the model for an asteroid.
//
// ------------------------------------------------------------------
'use strict';

let random = require("../random");

//------------------------------------------------------------------
//
// Public function used to initially create a new asteroid 
// at the designated location and size.
//
//------------------------------------------------------------------
function createAsteroid(position, size) {
    let that = {};

    Object.defineProperty(that, 'asteroidSize', {
        get: () => size
    })
    
    that.getSize = function(sizeString){ // set size in world coordinates
        let size = { width: 0, height: 0 }
        switch (sizeString){
            case "large":
                size.width = .1;
                size.height = .1;
                break;
            case "medium":
                size.width = .05;
                size.height = .05;
                break;
            case "small":
                size.width = .025;
                size.height = .025;
        }
        return size;
    }

    let newSize = getSize(size);
    let newMomentum = random.nextCircleVector();

    that.state = {
        center: {
            x: position.x, 
            y: position.y
        },
    
        size: {
            width: newSize.width,
            height: newSize.height
        },
        momentum: {
            x: newMomentum.x,
            y: newMomentum.y
        },
        rotation: random.nextDouble() * 2 * Math.PI,    // Angle in radians
        rotateRate: random.nextDouble() * Math.PI / 1000    // radians per millisecond
    }

    that.update = function(elapsedTime){
        that.state.rotation += that.state.rotateRate * elapsedTime
        that.state.center.x += that.state.momentum.deltaX * elapsedTime;
        that.state.center.y += that.state.momentum.deltaY * elapsedTime;
        if (that.state.center.x < -.1){
            that.state.center.x = 10.1;
        }
        if (that.state.center.x > 10.1){
            that.state.center.x = -.1;
        }
        
        if (that.state.center.y < -.1){
            that.state.center.y = 10.1;
        }
        if (that.state.center.y > 10.1){
            that.state.center.y = -.1;
        }
    }

    return that;
}

module.exports.create = (center, size) => createAsteroid(center, size);