// Number.prototype.toFixed() returns with a string when rounding a number.
// This produces a number. Base is optional.
export function toFixedNumber(num, digits, base) {
    var pow = Math.pow(base || 10, digits);
    return Math.round(num * pow) / pow;
}

export function greatestCommonDivisor(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

export function getAspectRatio(w, h) {
    let gcd = toFixedNumber(greatestCommonDivisor(w, h), 5);
    return { width: parseInt(w / gcd), height: parseInt(h / gcd) };
}
