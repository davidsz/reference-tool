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
    let gcd = parseInt(greatestCommonDivisor(w, h));
    if (gcd === 0)
        gcd = 1;
    w = parseInt(w / gcd);
    h = parseInt(h / gcd);
    if (w === h) {
        w = 1;
        h = 1;
    }
    return { width: w, height: h };
}

export function scaleWithAspectRatio(width, height, target_width, target_height, fit_into) {
    let new_width = target_height * width / height;
    let new_height = target_width * height / width;
    if (fit_into ^ (new_width >= target_width))
        return { width: new_width || 1, height: target_height };
    else
        return { width: target_width, height: new_height || 1 };
}
