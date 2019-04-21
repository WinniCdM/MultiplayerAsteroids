MyGame.handlers.ParticleHandler = (function(){
    'use strict';
    let that = {}
    that.localParticleSubsystems = [];
    that.globalParticleSubsystems = [];

    that.update = function(elapsedTime){
        let subsystemsToDelete = [];
        for (let index in that.localParticleSubsystems){
            let currSubSys = that.localParticleSubsystems[index];
            currSubSys.update(elapsedTime);

            if (currSubSys.duration <= -10000){ // wait 10 seconds for particle effect to finish, then delete
                subsystemsToDelete.push(index);
            }

        }
        
        for (let i = 0; i < subsystemsToDelete.length; i++){
            that.localParticleSubsystems.splice(i, 1);
        }
    }

    that.render = function(){
        for(let index in that.localParticleSubsystems){
            that.localParticleSubsystems[index].render();
        }
    }

    that.resetLocal = function(elapsedTime){
        that.localParticleSubsystems = [];
    }

    that.resetGlobal = function(elapsedTime){
        that.globalParticleSubsystems = [];
    }

    that.moveParticleSubsystems = function(deltaX,deltaY){
        // console.log("moveX: ", deltaX, "   moveY: ", deltaY);
        for(let index in that.localParticleSubsystems){
            if(that.localParticleSubsystems[index].type == 'explosion'){
                that.localParticleSubsystems[index].center.x += deltaX;
                that.localParticleSubsystems[index].center.y += deltaY;
            }
        }
    }

    //Spec contains
    //center in Global World Units 0->10
    //type
    that.handleNewGlobalParticleSubsytem = function(spec){
        that.globalParticleSubsystems.push(spec);
    }

    //Spec contains:
    //center in  ViewPort Units x:0->2, y:0->1
    //type
    that.handlNewLocalParticleSubsystem = function(spec){
        switch (spec.type){
            case 'thrust':
                createThrust(spec.center);
                break;
            case 'other-thrust':
                createOtherThrust(spec);
                break;
            case 'asteroid-breakup':
                createAsteroidBreakup(spec.center);
                break;
            case 'asteroid-destroyed':
                createAsteroidDestroyed(spec.center);
                break;
            case 'player-explosion':
                createPlayerDestroyed(spec.center);
                break;
            case 'ufo-explosion':
                createUFODestroyed(spec.center);
                break;
            case 'hyperspace':
                createHyperspaceWarp(spec.center);
                break;
            case 'powerup-pickup':
                createPowerupPickup(spec.center);
                break;
        }
    }

    function createThrust(center){
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['fire'],
            numPerUpdate: 2,
            duration: 50,
            center: { x: center.x, y: center.y },
            size: { mean: .025, stdev: .01},
            speed: { mean: .00165, stdev: .00035 },
            lifetime: { mean: 500, stdev: 100 },
            direction: MyGame.main.playerSelf.model.getThrustDirection(),
            type: "cone"
        }));
    }
    //This one is special, it needs the clientID as well as the center
    function createOtherThrust(spec){
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['fire'],
            numPerUpdate: 2,
            duration: 50,
            center: { x: spec.center.x, y: spec.center.y },
            size: { mean: .025, stdev: .01},
            speed: { mean: .00165, stdev: .00035 },
            lifetime: { mean: 500, stdev: 100 },
            direction: MyGame.main.playerOthers[spec.clientId].model.getThrustDirection(),
            type: "cone"
        }));
    }
    function createAsteroidBreakup(center){
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['asteroid'],
            numPerUpdate: 2,
            duration: 200,
            center: { x: center.x, y: center.y },
            size: { mean: .01, stdev: .01},
            speed: { mean: .00625, stdev: .0035 },
            lifetime: { mean: 6000, stdev: 250 },
            type: "explosion"
        }));
    }
    function createAsteroidDestroyed(center){
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['asteroid'],
            numPerUpdate: 2,
            duration: 200,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['fire'],
            numPerUpdate: 2,
            duration: 300,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
    }
    function createPlayerDestroyed(center){
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['smoke'],
            numPerUpdate: 2,
            duration: 300,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['fire'],
            numPerUpdate: 2,
            duration: 300,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
    }
    function createUFODestroyed(center){
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['smoke'],
            numPerUpdate: 2,
            duration: 300,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['fire'],
            numPerUpdate: 2,
            duration: 300,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
    }
    function createHyperspaceWarp(center){
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['blue'],
            numPerUpdate: 2,
            duration: 300,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['white'],
            numPerUpdate: 2,
            duration: 300,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
    }
    function createPowerupPickup(center){
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['blue'],
            numPerUpdate: 2,
            duration: 300,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
        that.localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['white'],
            numPerUpdate: 2,
            duration: 300,
            center: { x: center.x, y: center.y },
            size: { mean: .002, stdev: .01},
            speed: { mean: .00065, stdev: .0035 },
            lifetime: { mean: 2000, stdev: 250 },
            type: "explosion"
        }));
    }
    
    return that;
}());