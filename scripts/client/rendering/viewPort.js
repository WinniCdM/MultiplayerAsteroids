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

        let localPlayerOthers = [];

        let playerOthers = model.objectsWithinViewPort["playerOthers"]; // extract other players

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

        // render everything within view port
        renderer.Player.render(localPlayerSelf.model, localPlayerSelf.texture);
        for (let id in localPlayerOthers) {
            let player = localPlayerOthers[id];
            renderer.PlayerRemote.render(player.model, player.texture);
        }

        //UFO Rendering

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


        for (let id in localUFOs){
            let ufo = localUFOs[id];
            renderer.UFO.render(ufo.state,ufo.texture,ufo.subImageIndex,ufo.subTextureWidth);
        }





        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics, MyGame.renderer));
