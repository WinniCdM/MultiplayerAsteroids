MyGame.handlers.AudioHandler = (function(){
    'use strict';

    let that = {}


    that.playLaserShot = function(){
        let laserShot = MyGame.assets['laser'];
        laserShot.volume = .7;
        laserShot.play();
    }

    that.playEnemyLaserShot = function(){
        let enemyLaserShot = MyGame.assets['enemy-laser'];
        enemyLaserShot.volume = .7;
        enemyLaserShot.play();
    }
    that.playExplosion = function(){
        let explosion = MyGame.assets['explosion'];
        explosion.volume = 1;
        explosion.play();
    }

    that.playAsteroidExplosion = function(){
        let explosion = MyGame.assets['asteroid-explosion'];
        explosion.volume = 1;
        explosion.play();
    }

    that.playRespawn = function(){
        let respawn = MyGame.assets['respawn'];
        respawn.volume = 1;
        respawn.play();
    }

    that.playHyperspace = function(){
        let hyperspace = MyGame.assets['hyperspace'];
        hyperspace.volume = 1;
        hyperspace.play();
    }
    
    return that;
}());