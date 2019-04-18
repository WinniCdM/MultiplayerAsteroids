MyGame.components.Asteroid = function(spec){
    let that = {};

    that.state = {
        center: {
            x: spec.center.x, 
            y: spec.center.y
        },
    
        size: {
            width: spec.size.width,
            height: spec.size.height
        },
        momentum: {
            x: spec.momentum.x,
            y: spec.momentum.y
        },
        rotation: spec.rotation,
        rotateRate: spec.rotateRate
    }

    that.update = function(elapsedTime){
        that.state.rotation += that.state.rotateRate * elapsedTime
        that.state.center.x += that.state.momentum.x * elapsedTime;
        that.state.center.y += that.state.momentum.x * elapsedTime;
        if (that.state.center.x < -.1){
            that.state.center.x = 10.1;
        }
        if (that.state.center.x > 10.1){
            that.state.center.x = -.1;
        }
        
        if (that.state.center.y < -.1){
            that.state.center.y = 10.1;
        }
        if (that.state.center.y > 10.1){
            that.state.center.y = -.1;
        }
    }

    return that;
}