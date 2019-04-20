MyGame.handlers.AudioHandler = (function(){
    'use strict';
    let mainTheme = MyGame.assets['main-music'];
    console.log('mainTheme: ', mainTheme);
    mainTheme.addEventListener('canplay', function(){ this.play(); });
    mainTheme.loop = true;
    mainTheme.volume = .6;

    let that = {}

    that.playLaserShot = function(){
        let laserShot = MyGame.assets['laser'];
        laserShot.volume = .7;
        laserShot.play();
    }

    
    return that;
}());