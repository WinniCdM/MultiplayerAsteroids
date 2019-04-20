MyGame.handlers.ParticleHandler = (function(){
    'use strict';
    let that = {}
    that.localParticleSubsystems = [];
    that.globalParticleSubsystems = [];

    that.update = function(elapsedTime){
        let subsystemsToDelete = [];
        for (let index in localParticleSubsystems){
            let currSubSys = localParticleSubsystems[index];
            currSubSys.update(elapsedTime);

            if (currSubSys.duration <= -10000){ // wait 10 seconds for particle effect to finish, then delete
                subsystemsToDelete.push(index);
            }

        }
        
        for (let i = 0; i < subsystemsToDelete.length; i++){
            localParticleSubsystems.splice(i, 1);
        }
    }

    that.render = function(){
        for(let index in localParticleSubsystems){
            localParticleSubsystems[index].render();
        }
    }

    that.resetLocal = function(elapsedTime){
        localParticleSubsystems = [];
    }
    that.resetGlobal = function(elapsedTime){
        globalParticlSubsystems = [];
    }

    //Spec contains
    //center in Global World Units 0->10
    //type
    that.handleNewGlobalParticleSubsytem = function(spec){
        globalParticleSubsystems.push(spec);
    }

    //Spec contains:
    //center in  ViewPort Units x:0->2, y:0->1
    //type
    that.handlNewLocalParticleSubsystem = function(spec){
        switch (spec.type){
            case 'thrust':
                createThrust(spec.center)
                break;
            case 'asteroid-breakup':
                break;
            case 'asteroid-destroyed':
                break;
            case 'player-explosion':
                break;
            case 'ufo-explosion':
                break;
            case 'hyperspace':
                break;
        }
    }

    function createThrust(center){
        localParticleSubsystems.push(MyGame.components.ParticleSubsystem({
            texture: MyGame.assets['fire'],
            numPerUpdate: 2,
            duration: 100,
            center: { x: center.x, y: center.y },
            size: { mean: .1, stdev: .022 },
            speed: { mean: .000165, stdev: .000035 },
            lifetime: { mean: 500, stdev: 100 },
            direction: MyGame.main.playerSelf.getThrustDirection(),
            type: "cone"
        }));
    }
    return that;
}());