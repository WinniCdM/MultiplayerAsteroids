MyGame.handlers.AudioHandler = (function(){
    'use strict';
    let mainTheme = MyGame.assets['main-music'];
    mainTheme.loop = true;
    mainTheme.volume = .6;
    mainTheme.play();

    let that = {}
    that.localAudio = [];//list of types
    that.globalAudio = [];//list of {center,type}

    that.play = function(){
        for(let i in that.localAudio){
            switch (that.localAudio[i]){
                case 'laser':
                    that.playLaserShot();
                    break;
                case 'enemy-laser':
                    that.playEnemyLaserShot();
                    break;
                case 'explosion':
                    that.playExplosion();
                    break;
                case 'asteroid-explosion':
                    that.playAsteroidExplosion();
                    break;
                case 'respawn':
                    that.playRespawn();
                    break;
                case 'hyperspace':
                    that.playHyperspace();
                    break;
            }
        }
        that.resetLocal();
    }

    //spec contains:
    //center in Global World Units 0->10
    //type
    that.handleNewGlobalAudio = function(spec){
        that.globalAudio.push(spec);
    }

    that.handleNewLocalAudio = function(type){
        that.localAudio.push(type)
    }

    that.resetLocal = function(elapsedTime){
        that.localAudio = [];
    }

    that.resetGlobal = function(elapsedTime){
        that.globalAudio = [];
    }

    that.playLaserShot = function(){
        let laserShot = MyGame.assets['laser'];
        laserShot.load();
        laserShot.volume = .7;
        laserShot.play();
    }
    that.playEnemyLaserShot = function(){
        let enemyLaserShot = MyGame.assets['enemy-laser'];
        enemyLaserShot.load();
        enemyLaserShot.volume = .7;
        enemyLaserShot.play();
    }
    that.playExplosion = function(){
        let explosion = MyGame.assets['explosion'];
        explosion.load();
        explosion.volume = 1;
        explosion.play();
    }

    that.playAsteroidExplosion = function(){
        let explosion = MyGame.assets['asteroid-explosion'];
        explosion.load();
        explosion.volume = 1;
        explosion.play();
    }

    that.playRespawn = function(){
        let respawn = MyGame.assets['respawn'];
        playRespawn.load();
        respawn.volume = 1;
        respawn.play();
    }

    that.playHyperspace = function(){
        let hyperspace = MyGame.assets['hyperspace'];
        hyperspace.load();
        hyperspace.volume = 1;
        hyperspace.play();
    }
    
    return that;
}());