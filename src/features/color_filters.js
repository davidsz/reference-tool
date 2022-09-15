export function grayscaleEffect(canvas, context) {
    let image_data = context.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = image_data.data;
    for (let i = 0, n = pixels.length; i < n; i += 4) {
        let grayscale = pixels[i] * .3 + pixels[i + 1] * .59 + pixels[i + 2] * .11;
        pixels[i] = grayscale;        // red
        pixels[i + 1] = grayscale;    // green
        pixels[i + 2] = grayscale;    // blue
        // pixels[i+3]                // alpha
    }
    context.putImageData(image_data, 0, 0);
}
