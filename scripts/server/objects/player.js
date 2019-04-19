// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a player.
//
// ------------------------------------------------------------------
'use strict';

let random = require ('../random');
let helper = require ('../helper/helperFunctions');

//------------------------------------------------------------------
//
// Public function used to initially create a newly connected player
// at some random location.
//
//------------------------------------------------------------------
function createPlayer(MissileHandler,clientID) {
    let that = {};

    let position = {
        x: random.nextRange(1, 8), // TODO: randomly generate a safe space for this.
        y: random.nextRange(1, 9)
    };

    let size = {
        width: 0.01,
        height: 0.01
    };
    let momentum = {
        x: 0,
        y: 0
    };
    let direction = random.nextDouble() * 2 * Math.PI;    // Angle in radians
    let rotateRate = Math.PI / 1000;    // radians per millisecond
    let thrustRate = 0.0000004;         // unit acceleration per millisecond
    let reportUpdate = false;           // Indicates if this model was updated during the last update
    let lastUpdateDiff = 0;
    let score = 0;
    let lastTimeFired = helper.getTime();
    let crashed = false;
    let missileSpeed = .001;
    let fireRate = 500;

    Object.defineProperty(that, 'momentum', {
        get: () => momentum
    });

    Object.defineProperty(that, 'direction', {
        get: () => direction
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    Object.defineProperty(that, 'thrustRate', {
        get: () => thrustRate
    });

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate
    });

    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });

    Object.defineProperty(that, 'crashed', {
        get: () => crashed,
        set: value => crashed = value
    });

    Object.defineProperty(that, 'score', {
        get: () => score
    });

    Object.defineProperty(that, 'clientID', {
        get: () => clientID
    });

    //------------------------------------------------------------------
    //
    // Moves the player forward based on how long it has been since the
    // last move took place.
    //
    //------------------------------------------------------------------
    that.thrust = function(elapsedTime, updateDiff) {
        lastUpdateDiff += updateDiff;
        that.update(updateDiff, true);
        reportUpdate = true;
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        momentum.x += (vectorX * thrustRate * elapsedTime);
        momentum.y += (vectorY * thrustRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Rotates the player right based on how long it has been since the
    // last rotate took place.
    //
    //------------------------------------------------------------------
    that.rotateRight = function(elapsedTime) {
        reportUpdate = true;
        direction += (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Rotates the player left based on how long it has been since the
    // last rotate took place.
    //
    //------------------------------------------------------------------
    that.rotateLeft = function(elapsedTime) {
        reportUpdate = true;
        direction -= (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Function used to update the player during the game loop.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime, intraUpdate) {
        if (intraUpdate === false) {
            elapsedTime -= lastUpdateDiff;
            lastUpdateDiff = 0;
        }

        position.x += (momentum.x * elapsedTime);
        if (position.x < 0) { position.x = 0; momentum.x = 0; } //lower left bound
        if (position.x > 10) { position.x = 10; momentum.x = 0; } //upper right bound
        position.y += (momentum.y * elapsedTime);
        if (position.y < 0) { position.y = 0; momentum.y = 0; } //lower up bound
        if (position.y > 10) { position.y = 10; momentum.y = 0; } //upper down bound
    };

    //------------------------------------------------------------------
    //
    // Function used to fire missiles.
    //
    //------------------------------------------------------------------
    that.fire = function(elapsedTime) {

        if(((helper.getTime() - lastTimeFired) > fireRate) && !crashed){
            lastTimeFired = helper.getTime();
            console.log('fire');
            let state = {
                momentum: {
                    x:momentum.x,
                    y:momentum.y
                },
                maxSpeed: .002,//???
                center:{
                    x: position.x,
                    y: position.y
                }
            }

            //Decide which type of fireing to call, for now just normalFire
            normalFire(state);


        }

    };

    function normalFire(state){
        MissileHandler.createPlayerMissile(direction,state,missileSpeed,clientID);
    }



    return that;
}

module.exports.create = (MissileHandler,clientID) => createPlayer(MissileHandler,clientID);
