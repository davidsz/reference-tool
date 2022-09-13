// Number.prototype.toFixed() returns with a string when rounding a number.
// This produces a number. Base is optional.
export function toFixedNumber(num, digits, base) {
    var pow = Math.pow(base || 10, digits);
    return Math.round(num * pow) / pow;
}
