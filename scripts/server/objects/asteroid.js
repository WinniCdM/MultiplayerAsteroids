// ------------------------------------------------------------------
//
// Nodejs module that represents the model for an asteroid.
//
// ------------------------------------------------------------------
'use strict';

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
    
    that.setSize = function(sizeString){ // set size in world coordinates
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

    let newSize = setSize(size);

    that.state = {
        position: {
            x: position.x, 
            y: position.y
        },
    
        size: {
            width: newSize.width,
            height: newSize.height
        },
        momentum: {
            x: 0,
            y: 0
        },
        direction: random.nextDouble() * 2 * Math.PI,    // Angle in radians
        rotateRate: Math.PI / 1000    // radians per millisecond
    }

    return that;
}

module.exports.create = () => createAsteroid();