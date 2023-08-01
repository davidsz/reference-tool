export function imageToDataURL(image) {
    let canvas = document.createElement("canvas");
    canvas.height = image.height;
    canvas.width = image.width;
    canvas.getContext("2d").drawImage(image, 0, 0);
    let dataURL = canvas.toDataURL("image/png");
    canvas = null;
    return dataURL;
}

export async function saveJSONFile(name, data) {
    let blob = new Blob([data]);
    if ('showSaveFilePicker' in window) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: name,
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch (err) {
            if (err.name !== 'AbortError')
                console.error(err.name, err.message);
          }
    } else {
        let url = window.URL.createObjectURL(blob, { type: "application/json" });
        let a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}
