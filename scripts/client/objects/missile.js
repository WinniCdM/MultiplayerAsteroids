//------------------------------------------------------------------
//
// Model for each missile in the game.
//
//------------------------------------------------------------------
MyGame.components.Missile = function(message,texture) {
    let that = {};

    let state = message.state;
    Object.defineProperty(that, 'state', {
        get: () => state
    });
    Object.defineProperty(that, 'owner', {
        get: () => message.owner
    });
    Object.defineProperty(that, 'clientID', {
        get: () => message.clientID
    });

    Object.defineProperty(that, 'texture', {
        get: () => texture
    });

    that.update = function(elapsedTime){
        updateCenter(elapsedTime);
    }
    function updateCenter(elapsedTime){
        state.center.x += state.momentum.x * elapsedTime;
        state.center.y += state.momentum.y * elapsedTime;
        if (state.center.x < -.1){
            state.center.x = 10.1;
        }
        if (state.center.x > 10.1){
            state.center.x = -.1;
        }
        
        if (state.center.y < -.1){
            state.center.y = 10.1;
        }
        if (state.center.y > 10.1){
            state.center.y = -.1;
        }
    }



    return that;

};