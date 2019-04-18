// ------------------------------------------------------------------
//
// Rendering function for the ViewPort.
//
// ------------------------------------------------------------------
MyGame.renderer.ViewPort = (function(graphics, renderer) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders the ViewPort.
    //
    // ------------------------------------------------------------------

    that.render = function(model, texture) {
        graphics.saveContext();

        renderer.TiledBackground.render(model.position);

        // Local Self Player Setup
        let playerSelf = model.objectsWithinViewPort["playerSelf"]; // extract player

        let localPlayerSelf = { // translate to local viewport coordinates
            model: {
                position:{
                    x: model.playerLocalPosition.x,
                    y: model.playerLocalPosition.y
                },
                size: playerSelf.model.size,
                direction: playerSelf.model.direction
            },
            texture: playerSelf.texture
        }

        // Local Other Players Setup
        let localPlayerOthers = []
        
        let playerOthers = model.objectsWithinViewPort["playerOthers"]; // extracct other players

        for (let index in playerOthers){
            let currPlayerOther = playerOthers[index];
            let currLocalPlayerOther = { // translate each to local viewport coordinates
                model: {
                    state: {
                        position: {
                            x: currPlayerOther.model.state.position.x - model.position.x,
                            y: currPlayerOther.model.state.position.y - model.position.y
                        },
                        direction: currPlayerOther.model.state.direction
                    },
                    size: currPlayerOther.model.size
                },
                texture: currPlayerOther.texture
            }
            localPlayerOthers.push(currLocalPlayerOther);
        }

        // Local Asteroids Setup
        let localAsteroids = [];

        let asteroids = model.objectsWithinViewPort["asteroids"]; // extract asteroids

        for (let index in asteroids){
            let currAsteroid = asteroids[index];
            let currLocalAsteroid = {
                state: {
                    center: {
                        x: currAsteroid.state.center.x - model.position.x,
                        y: currAsteroid.state.center.y - model.position.y
                    },
                    size: currAsteroid.state.size,
                    rotation: currAsteroid.state.rotation
                }
            }
            localAsteroids.push(currLocalAsteroid);
        }

        // Local UFO setup

        let localUFOs = [];

        let UFOs = model.objectsWithinViewPort['ufos'];

        for (let index in UFOs){
            let currUFO = UFOs[index];
            let currLocalUFO = { // translate each to local viewport coordinates
                state: {
                    center: {
                        x:currUFO.state.center.x - model.position.x,
                        y:currUFO.state.center.y - model.position.y,
                    },
                    rotation: currUFO.state.rotation,
                    size: currUFO.state.size
                },
                texture: currUFO.texture,
                subImageIndex: currUFO.subImageIndex,
                subTextureWidth: currUFO.subTextureWidth,
            }
            localUFOs.push(currLocalUFO);
        }

        // render everything within view port
        // Render player 
        renderer.Player.render(localPlayerSelf.model, localPlayerSelf.texture);

        // Render other players
        for (let id in localPlayerOthers) {
            let player = localPlayerOthers[id];
            renderer.PlayerRemote.render(player.model, player.texture);
        }

        // Render asteroids
        for (let id in localAsteroids) {
            let asteroid = localAsteroids[id];
            renderer.Asteroid.render(asteroid, MyGame.assets['asteroid']);
        }

        //UFO Rendering
        for (let id in localUFOs){
            let ufo = localUFOs[id];
            renderer.UFO.render(ufo.state,ufo.texture, ufo.subImageIndex, ufo.subTextureWidth);
        }

        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics, MyGame.renderer));
