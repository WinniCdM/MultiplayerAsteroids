MyGame.components.ParticleSubsystem = function(spec){
    let that = {};
    that.duration = spec.duration;
    let particles = [];

    let renderer = MyGame.renderer.ParticleSubSystem(MyGame.graphics,particles,spec.texture)

    that.update = function(elapsedTime){
        that.duration -= elapsedTime;

        //create new particles
        if(that.duration > 0){
            for(let particle = 0; particle < spec.numPerUpdate; particle++){
                particles.push(create());
            }
        }

        //update particles
        let particlesToDelete = [];
        for(let index in particles){
            let currParticle = particles[index];
            currParticle.update(elapsedTime);

            if(currParticle.alive > currParticle.lifetime){
                particlesToDelete.push(index);
            }
        }

        //delete all dead particles
        for(let i = particlesToDelete.length; i>= 0; i--){
            particles.splice(particlesToDelete[i], 1);
        }
    }
    
    that.render = function(){
        renderer.render();
    }


//Center and size need to be in ViewPort Units {x:0->2, y:0->1}
    function create(){//need random working
        let size = MyGame.utilities.Random.nextGaussian(spec.size.mean, spec.size.stdev);
        if (spec.type === "cone"){
            return MyGame.components.Particle({
                center: { x: spec.center.x, y: spec.center.y },
                size: { width: size, height: size },
                direction: spec.direction, 
                speed: MyGame.utilities.Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                rotation: 0,
                lifetime: MyGame.utilities.Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),
                alive: 0,
                type: spec.type
            });
        }
        return MyGame.components.Particle({
            center: { x: spec.center.x, y: spec.center.y },
            size: { width: size, height: size },
            direction: MyGame.utilities.Random.nextCircleVector(.1), 
            speed: MyGame.utilities.Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
            rotation: 0,
            lifetime: MyGame.utilities.Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),
            alive: 0,
            type: spec.type
        });
    }

    return that;
}