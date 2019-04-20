MyGame.components.HyperspaceBar = function(spec){
    function update(newVal){
        spec.value = newVal;
    }

    let api = {
        get maxVal(){ return spec.maxVal; },
        get size(){ return spec.size; },
        get value(){ return spec.value; },
        get barColor(){ return spec.barColor; },
        get barOutlineColor(){ return spec.barOutlineColor; },
        get position(){ return spec.position; },
        get text() { return spec.text;},
        get font() { return spec.font;},
        update: update
    }

    return api;
}