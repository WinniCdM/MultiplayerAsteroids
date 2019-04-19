// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a Powerup.
//
// ------------------------------------------------------------------
'use strict';

let random = require ('../random');


//------------------------------------------------------------------
//
// Public function used to initially create a new Powerup
//
//------------------------------------------------------------------
function createPowerup(type) {
    let that = {};

    let state = {
        center: {
            x: random.nextRange(1, 9),
            y: random.nextRange(1, 9)
        },
        size: {
            width: .1,
            height: .1
        },
        rotation: 0
    }

    Object.defineProperty(that, 'state', {
        get: () => state
    });

    Object.defineProperty(that, 'type', {
        get: () => type
    });

    return that;
}

module.exports.create = (type) => createPowerup(type);
