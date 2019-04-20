MyGame.handlers.AudioHandler = (function(){
    'use strict';
    let mainTheme = MyGame.assets['main-music'];
    mainTheme.addEventListener('canplay', function(){ this.play(); });
    mainTheme.loop = true;
    mainTheme.volume = .6;

    let that = {}

    

    
    return that;
}());