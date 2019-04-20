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
    let fireRate = 350;
    that.username = '';

    let rapidFire = false;
    let splitShot = false;
    let spreadShot = false;
    let noShot = false;

    let powerupTime = 0;

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
        get: () => score,
        set: (value) => score = value 
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
        if (powerupTime > 0){
            powerupTime -= elapsedTime;
        } else {
            resetPowerups();
        }

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
            if (rapidFire) { lastTimeFired -= fireRate / 2}
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
            if (splitShot){
                splitFire(state);
            } else if (spreadShot){
                spreadFire(state);
            } else if (noShot){
                //do nothing, because we're cruel
            } else{
                normalFire(state);
            }
        }

    };

    function normalFire(state){
        MissileHandler.createPlayerMissile(direction,state,missileSpeed,clientID);
    }

    function splitFire(state){
        MissileHandler.createPlayerMissile(direction,state,missileSpeed,clientID);
        MissileHandler.createPlayerMissile(direction - Math.PI, state, missileSpeed, clientID);
    }

    function spreadFire(state){
        MissileHandler.createPlayerMissile(direction,state,missileSpeed,clientID);
        MissileHandler.createPlayerMissile(direction - .15,state,missileSpeed,clientID);
        MissileHandler.createPlayerMissile(direction - .3,state,missileSpeed,clientID);
        MissileHandler.createPlayerMissile(direction + .15, state,missileSpeed,clientID);
        MissileHandler.createPlayerMissile(direction + .3, state,missileSpeed,clientID);
    }

    that.pickupPowerup = function(powerupType){
        resetPowerups();
        switch (powerupType){
            case "no-shot":
                noShot = true;
                powerupTime = 30000;
                break;
            case "rapid-fire":
                rapidFire = true;
                powerupTime = 60000;
                break;
            case "spread-shot":
                spreadShot = true;
                powerupTime = 30000;
                break;
            case "split-shot":
                splitShot = true;
                powerupTime = 60000;
                break;
        }
    }

    function resetPowerups(){
        rapidFire = false;
        spreadShot = false;
        splitShot = false;
        noShot = false;
        powerupTime = 0;
    }

    return that;
}

module.exports.create = (MissileHandler,clientID) => createPlayer(MissileHandler,clientID);
