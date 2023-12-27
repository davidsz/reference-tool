import { getAspectRatio, scaleWithAspectRatio, toFixedNumber } from "./math";
import { grayscaleEffect } from "./color_filters";
import { makeElementDraggable, attachRightClickHandler, attachLongRightClickHandler } from "./dom";
import { imageToDataURL } from "./helper";

let instance;

export const workspace_mode = {
    GRID: 0, // Lines, handles and distance labels
    RESIZE: 1, // Rectangular selection box on the image for resizing
    CONST: 2, // Show the lines and distances without interactivity
    IMAGE: 3, // Just the image
};
const HANDLE_CENTER = 4; // Half of default handle size
const LABEL_BAR_WIDTH = 30; // Size of label bars

class WorkspaceEngine {
    constructor() {
        if (instance) throw new Error("You can only create one instance of WorkspaceEngine.");
        instance = this;

        // The canvas element. UI bindings always try to keep it as large as possible.
        this.canvas = null;

        // The image, always unmodified.
        this.image = new Image();

        // Current mode
        this.mode = workspace_mode.CONST;

        // Don't let the computer sleep when working with this app
        this.wake_lock_sentinel = null;

        // Cached values for more effective rendering
        // Sources: cropped area from the original image
        this.source_x = 0;
        this.source_y = 0;
        this.source_width = 0;
        this.source_height = 0;
        // Destinations: positions on the canvas
        this.image_x = 0;
        this.image_y = 0;
        this.image_width = 0;
        this.image_height = 0;

        // Zooming parameter
        this.scale_ = 1;

        // Grid system: list of handles (DOM objects)
        // with percentage representation of x/y coordinates, relative to the scaled image
        this.grid_points = [];

        // UI for resize mode
        // Same as grid points, but just only two points
        this.resize_points = [];
        // A rectangle to provide interactive dragging and visual border in resize mode
        this.resize_div = null;

        // Keep ratio of resize rectangle when interacting with resize handles
        this.keep_aspect_ratio = false;
        // Aspect ratio of the resize box
        this.resize_aspect_ratio_ = { x: 1, y: 1 };

        // DOM container of grid and resize handler points
        this.handles_container = null;

        // Grid line and handle color, and its L component
        this.grid_color_ = "hsl(0, 0%, 50%)";
        this.grid_color_light_ = 50;

        // Grayscale filter
        this.grayscale_ = false;

        // Virtual dimensions for displaying marker distances
        this.virtual_width = 100;
        this.virtual_height = 100;

        // Displayed distances between two lines
        this.distance_labels_x = [];
        this.distance_labels_y = [];
    }

    // Updates drawing coordinates from viewport size, zooming scale and crop coordinates.
    updateImageDimensions() {
        let canvas_width = this.canvas.width,
            canvas_height = this.canvas.height,
            image_width = this.source_width,
            image_height = this.source_height,
            scale_to_viewport = Math.min(canvas_width / image_width, canvas_height / image_height);

        if (scale_to_viewport < 1) {
            image_width *= scale_to_viewport;
            image_height *= scale_to_viewport;
        }
        image_width *= this.scale;
        image_height *= this.scale;

        this.image_x = (canvas_width - image_width) / 2;
        this.image_y = (canvas_height - image_height) / 2;
        this.image_width = image_width;
        this.image_height = image_height;

        this.updateDistanceLabels();
    }

    get scale() {
        return this.scale_;
    }

    set scale(val) {
        this.scale_ = val;
        this.updateImageDimensions();
        this.updateHandles();
        this.redraw();
    }

    get grid_color_light() {
        return this.grid_color_light_;
    }

    set grid_color_light(val) {
        this.grid_color_light_ = val;
        this.grid_color_ = "hsl(0, 0%, " + val + "%)";
        [...this.grid_points, ...this.resize_points].forEach((point) => {
            point.style.backgroundColor = this.grid_color_;
        });
        this.resize_div.style.borderColor = this.grid_color_;
        this.redraw();
    }

    get grayscale() {
        return this.grayscale_;
    }

    set grayscale(val) {
        this.grayscale_ = val;
        this.redraw();
    }

    get resize_aspect_ratio() {
        return this.resize_aspect_ratio_;
    }

    set resize_aspect_ratio(val) {
        this.resize_aspect_ratio_ = val;

        let width = val.x;
        let height = val.y;
        // Convert AR to logical sizes
        if (this.image.width / width < this.image.height / height) {
            // Fit resize box to the horizontal side of the image
            let desired_px_height = this.image.width / width * height;
            height = desired_px_height / this.image_height * 100;
            width = 100;
        } else {
            // Fit resize box to the vertical side of the image
            let desired_px_width = this.image.height / height * width;
            width = desired_px_width / this.image.width * 100;
            height = 100;
        }
        // Update resize handles and rectangle
        let point = this.getResizeHandles();
        point.a.x = (100 - width) / 2;
        point.a.y = (100 - height) / 2;
        point.b.x = point.a.x + width;
        point.b.y = point.a.y + height;
        this.updateHandles();
        this.redraw();
    }

    updateDistanceLabels() {
        let x_axis = [0, 100];
        let y_axis = [0, 100];
        for (let i = 0, points_count = this.grid_points.length; i < points_count; i++) {
            let point = this.grid_points[i];

            // Horizontal points
            for (let j = 0, length = point.vertical ? x_axis.length - 1 : 0; j < length; j++) {
                if (x_axis[j] < point.x && x_axis[j + 1] > point.x) {
                    x_axis.splice(j + 1, 0, point.x);
                    break;
                }
            }

            // Vertical points
            for (let j = 0, length = point.horizontal ? y_axis.length - 1 : 0; j < length; j++) {
                if (y_axis[j] < point.y && y_axis[j + 1] > point.y) {
                    y_axis.splice(j + 1, 0, point.y);
                    break;
                }
            }
        }

        // Determine virtual size differences (labels) and text coordinates
        this.distance_labels_x = [];
        let previous_x = this.image_x;
        for (let i = 1, length = x_axis.length; i < length; i++) {
            let current_x = this.image_width * (x_axis[i] / 100) + this.image_x;
            this.distance_labels_x.push({
                text_center_x: previous_x + (current_x - previous_x) / 2,
                value: Math.round((x_axis[i] / 100) * this.virtual_width - (x_axis[i - 1] / 100) * this.virtual_width),
            });
            previous_x = current_x;
        }

        this.distance_labels_y = [];
        let previous_y = this.image_y;
        for (let i = 1, length = y_axis.length; i < length; i++) {
            let current_y = this.image_height * (y_axis[i] / 100) + this.image_y;
            this.distance_labels_y.push({
                text_center_y: previous_y + (current_y - previous_y) / 2,
                value: Math.round((y_axis[i] / 100) * this.virtual_height - (y_axis[i - 1] / 100) * this.virtual_height),
            });
            previous_y = current_y;
        }
    }

    init(canvas_element, handles_container_element) {
        this.canvas = canvas_element;
        this.handles_container = handles_container_element;

        canvas_element.oncontextmenu = (e) => e.preventDefault();

        if ("wakeLock" in navigator) {
            const requestWakeLock = async () => {
                try {
                    if (document.visibilityState === "visible")
                        this.wake_lock_sentinel = await navigator.wakeLock.request("screen");
                } catch (e) {}
            }
            requestWakeLock();
            document.addEventListener("visibilitychange", requestWakeLock);
        }
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.updateImageDimensions();
        this.updateHandles();
    }

    // May be called before any image has been loaded
    redrawSafe() {
        if (this.image.complete)
            this.redraw();
    }

    redraw() {
        let canvas_width = this.canvas.width,
            canvas_height = this.canvas.height,
            context = this.canvas.getContext("2d");

        context.clearRect(0, 0, canvas_width, canvas_height);
        context.drawImage(
            this.image,
            this.source_x,
            this.source_y,
            this.source_width,
            this.source_height,
            this.image_x,
            this.image_y,
            this.image_width,
            this.image_height
        );

        if (this.grayscale_) grayscaleEffect(this.canvas, context);

        if (this.mode === workspace_mode.IMAGE || this.mode === workspace_mode.RESIZE) return;

        // Lines on the top of the image
        context.strokeStyle = this.grid_color_;
        for (let i = 0, length = this.grid_points.length; i < length; i++) {
            let point = this.grid_points[i];
            let x = this.image_width * (point.x / 100) + this.image_x;
            let y = this.image_height * (point.y / 100) + this.image_y;

            if (point.horizontal) {
                context.beginPath();
                context.moveTo(0, y);
                context.lineTo(canvas_width, y);
                context.stroke();
            }
            if (point.vertical) {
                context.beginPath();
                context.moveTo(x, 0);
                context.lineTo(x, canvas_height);
                context.stroke();
            }
        }

        // Distance labels
        // INVESTIGATE: Can the above lines logic merged into this more effectively?
        context.fillStyle = "rgba(0, 0, 0, 0.3)";
        context.fillRect(0, 0, canvas_width, LABEL_BAR_WIDTH);
        context.fillRect(canvas_width - LABEL_BAR_WIDTH, LABEL_BAR_WIDTH, canvas_width, canvas_height);

        context.fillRect(this.image_x, 0, this.image_width, LABEL_BAR_WIDTH);
        context.fillRect(canvas_width - LABEL_BAR_WIDTH, this.image_y, canvas_width, this.image_height);

        context.font = "18px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        for (let i = 0, length = this.distance_labels_x.length; i < length; i++) {
            let label = this.distance_labels_x[i];
            context.fillText(label.value, label.text_center_x, LABEL_BAR_WIDTH / 2);
        }
        for (let i = 0, length = this.distance_labels_y.length; i < length; i++) {
            let label = this.distance_labels_y[i];
            context.fillText(label.value, canvas_width - LABEL_BAR_WIDTH / 2, label.text_center_y);
        }
    }

    setMode(mode) {
        // Previous mode
        switch (this.mode) {
            case workspace_mode.GRID:
                this.showGridHandles(false);
                break;
            case workspace_mode.RESIZE:
                this.showResizeHandles(false);
                break;
            default:
                break;
        }

        // Current mode
        this.mode = mode;
        switch (mode) {
            case workspace_mode.GRID:
                this.showGridHandles(true);
                break;
            case workspace_mode.RESIZE:
                this.showResizeHandles(true);
                break;
            default:
                break;
        }
        this.redrawSafe();
    }

    addGridPoint(local_x, local_y) {
        // Do not add new points in other modes
        if (this.mode !== workspace_mode.GRID) return;

        // Interactive handle for the point
        let point = this.constructGridPoint(
            toFixedNumber(((local_x - this.image_x) / this.image_width) * 100, 5),
            toFixedNumber(((local_y - this.image_y) / this.image_height) * 100, 5)
        );

        // Visual position of the interactive handle
        point.setLocalPosition(local_x, local_y);

        this.updateDistanceLabels();
        this.redraw();
    }

    constructGridPoint(x, y) {
        // Interactive handle for the point
        let point = document.createElement("div");
        point.classList.add("grid-handle");
        point.style.backgroundColor = this.grid_color_;

        // Position in percentage, relative to the image on canvas
        point.x = x;
        point.y = y;

        // Enable both horizontal and vertical lines initially
        point.horizontal = true;
        point.vertical = true;

        // A function to update visual position
        point.setLocalPosition = (local_x, local_y) => {
            point.style.top = local_y - HANDLE_CENTER + "px";
            point.style.left = local_x - HANDLE_CENTER + "px";
        };

        // Update and redraw the corresponding point when moving the handle
        makeElementDraggable(point, (global_x, global_y) => {
            point.x = toFixedNumber(((global_x + HANDLE_CENTER - this.image_x) / this.image_width) * 100, 5);
            point.y = toFixedNumber(((global_y + HANDLE_CENTER - this.image_y) / this.image_height) * 100, 5);
            this.updateDistanceLabels();
            this.redraw();
        });

        // Change horizontal and vertical lines on right click
        attachRightClickHandler(point, () => {
            if (point.horizontal && point.vertical) {
                point.vertical = false;
            } else if (point.horizontal && !point.vertical) {
                point.horizontal = false;
                point.vertical = true;
            } else if (!point.horizontal && point.vertical) {
                point.horizontal = true;
                point.vertical = true;
            }
            this.updateDistanceLabels();
            this.redraw();
        });

        // Remove point by holding right mouse button
        attachLongRightClickHandler(point, 750, () => {
            for (let i = 0; i < this.grid_points.length; i++) {
                if (this.grid_points[i] === point) {
                    this.grid_points.splice(i, 1);
                    point.remove();
                    this.updateDistanceLabels();
                    this.redraw();
                    break;
                }
            }
        });

        this.handles_container.appendChild(point);
        this.grid_points.push(point);
        return point;
    }

    generateGrid(n, m) {
        this.clearGridPoints();

        let u = Math.min(n, m),
            v = Math.max(n, m),
            horizontal_part = 100 / n,
            vertical_part = 100 / m;

        for (let i = 1; i < u; i++) this.constructGridPoint(i * horizontal_part, i * vertical_part);

        for (let i = u; i < v; i++) {
            let point =
                n > m ? this.constructGridPoint(i * horizontal_part, 100) : this.constructGridPoint(100, i * vertical_part);
            point.horizontal = m > n;
            point.vertical = n > m;
        }

        this.updateHandles();
        this.updateDistanceLabels();
        this.redraw();
    }

    clearGridPoints() {
        while (this.grid_points.length > 0) this.grid_points.pop().remove();
    }

    logicalToLocalPos(x, y) {
        return {
            x: this.image_width * (x / 100) + this.image_x,
            y: this.image_height * (y / 100) + this.image_y
        };
    }

    // Update grid/resize handles visually after a logical change
    updateHandles(update_rect) {
        if (update_rect === undefined)
            update_rect = true;
        [...this.grid_points, ...this.resize_points].forEach((point) => {
            let local = this.logicalToLocalPos(point.x, point.y);
            point.setLocalPosition(local.x, local.y, update_rect);
        });
    }

    // Update resize rectangle to fit with the resize handles
    updateResizeRectangle() {
        let resize_point = this.getResizeHandles();

        // Top left point
        let top_left = this.logicalToLocalPos(resize_point.a.x, resize_point.a.y);
        this.resize_div.style.top = top_left.y + "px";
        this.resize_div.style.left = top_left.x + "px";

        // Bottom right point
        let bottom_right = this.logicalToLocalPos(resize_point.b.x, resize_point.b.y);
        this.resize_div.style.width = bottom_right.x - top_left.x + "px";
        this.resize_div.style.height = bottom_right.y - top_left.y + "px";
    }

    showGridHandles(show) {
        let css_visibility = show ? "visible" : "hidden";
        for (let i = 0, length = this.grid_points.length; i < length; i++) this.grid_points[i].style.visibility = css_visibility;
    }

    constructResizePoint(x, y, n) {
        // Interactive handle for the point
        let point = document.createElement("div");
        point.classList.add("grid-handle");
        point.style.backgroundColor = this.grid_color_;

        point.x = x;
        point.y = y;

        // A function to update visual position
        point.setLocalPosition = (local_x, local_y, update_rect) => {
            point.style.top = local_y - HANDLE_CENTER + "px";
            point.style.left = local_x - HANDLE_CENTER + "px";
            if (update_rect)
                this.updateResizeRectangle();
        };

        // Resize selection rectangle when moving the handle
        makeElementDraggable(point, (global_x, global_y, mouse_global_x, mouse_global_y) => {
            let x = toFixedNumber(((global_x + HANDLE_CENTER - this.image_x) / this.image_width) * 100, 5),
                y = toFixedNumber(((global_y + HANDLE_CENTER - this.image_y) / this.image_height) * 100, 5);

            if (this.keep_aspect_ratio) {
                // Determine the original selection rectangle to resize
                let other_point = this.resize_points[n === 0 ? 1 : 0];
                let original_width = Math.abs(point.x - other_point.x),
                    original_height = Math.abs(point.y - other_point.y);

                // Get minimum sides from the mouse coordinates
                let bc = this.canvas.getBoundingClientRect();
                let mouse_x = toFixedNumber(((mouse_global_x - bc.left + HANDLE_CENTER - this.image_x) / this.image_width) * 100, 5),
                    mouse_y = toFixedNumber(((mouse_global_y - bc.top + HANDLE_CENTER - this.image_y) / this.image_height) * 100, 5);
                let target_width = mouse_x - other_point.x,
                    target_height = mouse_y - other_point.y;

                // Scale the original rectangle to contain the new one
                let new_rect = scaleWithAspectRatio(original_width, original_height, target_width, target_height, false);
                const min_rect_size = 0.5;
                if (new_rect.width < min_rect_size || new_rect.height < min_rect_size)
                    new_rect = scaleWithAspectRatio(original_width, original_height, min_rect_size, min_rect_size, false);

                // Adjust point coordinates to the corner of the calculated rectangle
                x = other_point.x + new_rect.width;
                y = other_point.y + new_rect.height;
            }

            point.x = x;
            point.y = y;
            this.updateHandles();
            this.redraw();
        });

        // Insert the newly created point and its handle
        this.handles_container.appendChild(point);
        this.resize_points.push(point);
        return point;
    }

    constructResizeDiv() {
        let div = document.createElement("div");
        div.classList.add("resize-rect");
        div.style.borderColor = this.grid_color_;

        makeElementDraggable(div, (global_x, global_y) => {
            let point = this.getResizeHandles();
            let prev_x = point.a.x,
                prev_y = point.a.y;
            point.a.x = toFixedNumber(((global_x - this.image_x) / this.image_width) * 100, 5);
            point.a.y = toFixedNumber(((global_y - this.image_y) / this.image_height) * 100, 5);
            point.b.x += point.a.x - prev_x;
            point.b.y += point.a.y - prev_y;
            this.updateHandles(false);
        });

        this.handles_container.appendChild(div);
        this.resize_div = div;
        return div;
    }

    showResizeHandles(show) {
        let css_visibility = show ? "visible" : "hidden";

        // Initialize resize UI for the first time
        if (!this.resize_points.length) {
            // Resize handle points
            for (let i = 0; i < 2; i++) {
                let local_x = this.image_x,
                    local_y = this.image_y;

                // Interactive handle for the point
                let point;
                if (i === 0) point = this.constructResizePoint(0, 0, i);
                else {
                    point = this.constructResizePoint(100, 100, i);
                    local_x += this.image_width;
                    local_y += this.image_height;
                }

                // Visual position of the interactive handle
                point.setLocalPosition(local_x, local_y, false);
                point.style.visibility = css_visibility;
            }
            // Draggable rectangle
            let div = this.constructResizeDiv();
            div.style.visibility = css_visibility;
            this.updateResizeRectangle();
            return;
        }

        for (let i = 0; i < 2; i++) this.resize_points[i].style.visibility = css_visibility;
        this.resize_div.style.visibility = css_visibility;
    }

    getResizeHandles() {
        // Top/left first, then the other.
        let point_a = this.resize_points[0],
            point_b = this.resize_points[1],
            top_left_index = point_a.x <= point_b.x ? 0 : 1;
        return {
            a: this.resize_points[top_left_index],
            b: this.resize_points[top_left_index === 0 ? 1 : 0],
        };
    }

    resetResizeHandles() {
        if (!this.resize_points.length) return;

        let point_a = this.resize_points[0],
            point_b = this.resize_points[1];
        point_a.x = 0;
        point_a.y = 0;
        point_b.x = 100;
        point_b.y = 100;
    }

    cropImage() {
        let point = this.getResizeHandles();

        // Store crop coordinates and keep the image object untouched
        this.source_x = this.source_width * (point.a.x / 100) + this.source_x;
        this.source_y = this.source_height * (point.a.y / 100) + this.source_y;
        this.source_width = this.source_width * ((point.b.x - point.a.x) / 100);
        this.source_height = this.source_height * ((point.b.y - point.a.y) / 100);

        this.updateImageDimensions();
        this.resetResizeHandles();
        this.updateHandles();
        this.redraw();
    }

    resetCrop() {
        this.source_x = 0;
        this.source_y = 0;
        this.source_width = this.image.width;
        this.source_height = this.image.height;

        this.updateImageDimensions();
        this.resetResizeHandles();
        this.updateHandles();
        this.redraw();
    }

    setVirtualSizes(width, height) {
        this.virtual_width = width;
        this.virtual_height = height;
        this.updateDistanceLabels();
    }

    loadLocalImage(file) {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            window.alert("File API is not supported.");
            return;
        }

        let fileReader = new FileReader();
        fileReader.onload = () => {
            this.image.addEventListener(
                "load",
                () => {
                    this.clearGridPoints();
                    this.source_width = this.image.width;
                    this.source_height = this.image.height;
                    let ar = getAspectRatio(this.image.width, this.image.height);
                    this.setVirtualSizes(ar.width, ar.height);
                    this.grayscale_ = false;
                    this.updateImageDimensions();
                    this.resetResizeHandles();
                    this.updateHandles();
                    this.redraw();
                },
                { once: true }
            );
            this.image.src = fileReader.result;
        };
        fileReader.readAsDataURL(file);
    }

    loadImageURL(url) {
        this.image.addEventListener(
            "load",
            () => {
                this.clearGridPoints();
                this.source_width = this.image.width;
                this.source_height = this.image.height;
                let ar = getAspectRatio(this.image.width, this.image.height);
                this.setVirtualSizes(ar.width, ar.height);
                this.grayscale_ = false;
                this.updateImageDimensions();
                this.resetResizeHandles();
                this.updateHandles();
                this.redraw();
            },
            { once: true }
        );
        this.image.src = url;
    }

    exportAsJSON() {
        let json = {
            imageURI: imageToDataURL(this.image),
            mode: this.mode,
            source_x: this.source_x,
            source_y: this.source_y,
            source_width: this.source_width,
            source_height: this.source_height,
            image_x: this.image_x,
            image_y: this.image_y,
            image_width: this.image_width,
            image_height: this.image_height,
            grid_points: [],
            resize_points: [],
            keep_aspect_ratio: this.keep_aspect_ratio,
            resize_aspect_ratio_: this.resize_aspect_ratio_,
            grid_color_: this.grid_color_,
            grid_color_light_: this.grid_color_light_,
            grayscale_: this.grayscale_,
            virtual_width: this.virtual_width,
            virtual_height: this.virtual_height,
        };
        this.grid_points.forEach((point) => {
            json.grid_points.push({
                x: point.x,
                y: point.y,
                horizontal: point.horizontal,
                vertical: point.vertical,
            });
        });
        this.resize_points.forEach((point) => {
            json.resize_points.push({
                x: point.x,
                y: point.y,
            });
        });

        return json;
    }

    importFromJSON(json) {
        this.image.addEventListener(
            "load",
            () => {
                this.updateImageDimensions();
                this.updateHandles();
                this.redraw();
            },
            { once: true }
        );
        this.image.src = json.imageURI;
        this.mode = json.mode;
        this.source_x = json.source_x;
        this.source_y = json.source_y;
        this.source_width = json.source_width;
        this.source_height = json.source_height;
        this.image_x = json.image_x;
        this.image_y = json.image_y;
        this.image_width = json.image_width;
        this.image_height = json.image_height;
        this.scale_ = 1;
        this.grid_points = [];
        this.resize_points = [];
        this.resize_div = null;
        this.keep_aspect_ratio = json.keep_aspect_ratio;
        this.resize_aspect_ratio_ = json.resize_aspect_ratio_;
        this.grid_color_ = json.grid_color_;
        this.grid_color_light_ = json.grid_color_light_;
        this.grayscale_ = json.grayscale_;
        this.virtual_width = json.virtual_width;
        this.virtual_height = json.virtual_height;

        json.grid_points.forEach((point) => {
            let grid_point = this.constructGridPoint(point.x, point.y);
            grid_point.horizontal = point.horizontal;
            grid_point.vertical = point.vertical;
            grid_point.style.visibility = "hidden";
        });
        json.resize_points.forEach((point, i) => {
            let resize_point = this.constructResizePoint(point.x, point.y, i);
            resize_point.style.visibility = "hidden";
        });
        let div = this.constructResizeDiv();
        div.style.visibility = "hidden";
    }
}

const singletonWorkspaceEngine = new WorkspaceEngine();
export default singletonWorkspaceEngine;
