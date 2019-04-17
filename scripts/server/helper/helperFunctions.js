let toggleTop = true;

//------------------------------------------------------------------
//
// Helper function to generate a new random center along the edges
// of the world.
//
// Use for new asteroids and ufos
//
//------------------------------------------------------------------
function generateNewRandomCenter(){
    let x = (toggleTop) ? Math.floor(Math.random() * 10) : -.1;
    let y = (toggleTop) ? -.1 : Math.floor(Math.random() * 10);
    toggleTop = !toggleTop;
    return { x: x, y: y }
}

//------------------------------------------------------------------
//
// Helper function to pad a number with 0s
//
//------------------------------------------------------------------
function numberPad(number, padding){
    number += '';
    return number.padStart(padding, '0');
}
module.exports.generateNewRandomCenter = generateNewRandomCenter;
module.exports.numberPad = numberPad;