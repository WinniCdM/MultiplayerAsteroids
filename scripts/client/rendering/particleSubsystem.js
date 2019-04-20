// ------------------------------------------------------------------
//
// Rendering function for a ParticleSubsystem object.
//
// ------------------------------------------------------------------
MyGame.renderer.ParticleSubSystem = function(graphics, particles, image) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a ParticleSubSystem model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture) {
        graphics.saveContext();
        for(let index in particles){
            let currParticle = particles[index];
            graphics.rotateCanvas(currParticle.center, currParticle.rotation);
            graphics.drawImage(image,currParticle.center,currParticle.size);
        }
    };

    return that;

};