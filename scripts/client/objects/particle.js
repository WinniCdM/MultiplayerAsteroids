MyGame.components.Particle = function(spec){
    let that = {};

    that.center = spec.center;
    that.size = spec.size;
    that.direction = spec.direction;
    that.rotation = spec.rotation;
    that.speed = spec.speed;
    that.lifetime = spec.lifetime;
    that.alive = spec.alive;

    that.update = function(elapsedTime){
        spec.alive += elapsedTime;
        spec.center.x += (elapsedTime * spec.speed * spec.direction.x);
        spec.center.y += (elapsedTime * spec.speed * spec.direction.y);

        spec.rotation += spec.speed / 5000;
    }
    return that;
}