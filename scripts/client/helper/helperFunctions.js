let HelperFunctions = (function(){
    function numberPad(numDigits, padding){
        padding -= numDigits.length;
        if (padding > 0){
            return new Array( padding + (/\./.test( numDigits ) ? 2 : 1) ).join( '0' ) + numDigits;
        }
        return numDigits + "";
    }

    return {
        numberPad: numberPad
    }
}())