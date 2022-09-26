export function imageToDataURL(image) {
    let canvas = document.createElement("canvas");
    canvas.height = image.height;
    canvas.width = image.width;
    canvas.getContext("2d").drawImage(image, 0, 0);
    let dataURL = canvas.toDataURL("image/png");
    canvas = null;
    return dataURL;
}

export function saveJSONFile(name, data) {
    let url = window.URL.createObjectURL(new Blob([data], { type: "application/json" }));
    let a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}
