import { toFixedNumber } from "./math"
import { grayscaleEffect } from "./color_filters"
import { makeElementDraggable, attachRightClickHandler, attachLongRightClickHandler } from "./dom"

let instance;

export const workspace_mode = {
    GRID: 0,    // Lines, handles and distance labels
    RESIZE: 1,  // Rectangular selection box on the image for resizing
    CONST: 2,   // Show the lines and distances without interactivity
    IMAGE: 3,   // Just the image
};
const HANDLE_CENTER = 4;    // Half of default handle size
const LABEL_BAR_WIDTH = 30; // Size of label bars

class WorkspaceEngine {
    constructor() {
        if (instance)
            throw new Error("You can only create one instance of WorkspaceEngine.");
        instance = this;

        // The canvas element. UI bindings always try to keep it as large as possible.
        this.canvas = null;

        // The image, always unmodified.
        this.image = new Image();

        // Current mode
        this.mode = workspace_mode.CONST;

        // Don't let the computer sleep when working with this app
        this.wakeLockSentinel = null;

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

        // Handles for resize mode
        // Same as grid points, but just only two points
        this.resize_points = [];

        // DOM container of grid and resize handler points
        this.handles_container = null;

        // Grid line and handle color
        this.grid_color_ = "hsl(0, 0%, 50%)";

        // Grayscale filter
        this.grayscale_ = false;

        // Virtual dimensions for displaying marker distances
        this.virtual_width = 100;
        this.virtual_height = 100;

        // Displayed distances between two lines
        this.distance_labels_x = [];
        this.distance_labels_y = [];
    }

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

    get gridColor() {
        return this.grid_color_;
    }

    set gridColor(val) {
        this.grid_color_ = val;
        [...this.grid_points, ...this.resize_points].forEach((point) => {
            point.style.backgroundColor = val;
        });
        this.redraw();
    }

    get grayscale() {
        return this.grayscale_;
    }

    set grayscale(val) {
        this.grayscale_ = val;
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
                value: Math.round((x_axis[i] / 100 * this.virtual_width) - (x_axis[i - 1] / 100 * this.virtual_width))
            });
            previous_x = current_x;
        }

        this.distance_labels_y = [];
        let previous_y = this.image_y;
        for (let i = 1, length = y_axis.length; i < length; i++) {
            let current_y = this.image_height * (y_axis[i] / 100) + this.image_y;
            this.distance_labels_y.push({
                text_center_y: previous_y + (current_y - previous_y) / 2,
                value: Math.round((y_axis[i] / 100 * this.virtual_height) - (y_axis[i - 1] / 100 * this.virtual_height))
            });
            previous_y = current_y;
        }
    }

    init(canvas_element, handles_container_element) {
        this.canvas = canvas_element;
        this.handles_container = handles_container_element;

        canvas_element.oncontextmenu = (e) => e.preventDefault();

        if ('wakeLock' in navigator) {
            this.wakeLockSentinel = navigator.wakeLock.request('screen');
            document.addEventListener('visibilitychange', async () => {
                if (this.wakeLockSentinel !== null && document.visibilityState === 'visible')
                    this.wakeLockSentinel = await navigator.wakeLock.request('screen');
            });
        }
    }

    resize(container_element) {
        this.canvas.width = container_element.offsetWidth;
        this.canvas.height = container_element.offsetHeight;
        this.updateImageDimensions();
        this.updateHandles();
    }

    redraw() {
        let canvas_width = this.canvas.width,
            canvas_height = this.canvas.height,
            context = this.canvas.getContext("2d");

        context.clearRect(0, 0, canvas_width, canvas_height);
        context.drawImage(this.image,
            this.source_x, this.source_y,
            this.source_width, this.source_height,
            this.image_x, this.image_y,
            this.image_width, this.image_height);

        // TODO: Untested
        if (this.grayscale_)
            grayscaleEffect(this.canvas, context);

        if (this.mode === workspace_mode.RESIZE) {
            // Rectangle for resize dimensions
            let p1 = this.resize_points[0],
                p2 = this.resize_points[1],
                p1_x = this.image_width * (p1.x / 100) + this.image_x,
                p1_y = this.image_height * (p1.y / 100) + this.image_y,
                p2_x = this.image_width * (p2.x / 100) + this.image_x,
                p2_y = this.image_height * (p2.y / 100) + this.image_y;
            context.strokeStyle = this.grid_color_;
            context.beginPath();
            context.rect(p1_x, p1_y, p2_x - p1_x, p2_y - p1_y);
            context.stroke();
            return;
        } else if (this.mode === workspace_mode.IMAGE)
            return;

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
        context.fillRect(0, 0, canvas_width - LABEL_BAR_WIDTH, LABEL_BAR_WIDTH);
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
        this.redraw();
    }

    addGridPoint(local_x, local_y) {
        // Do not add new points in other modes
        if (this.mode !== workspace_mode.GRID)
            return;

        // Interactive handle for the point
        let point = this.constructGridPoint(
            toFixedNumber(((local_x - this.image_x) / this.image_width) * 100, 5),
            toFixedNumber(((local_y - this.image_y) / this.image_height) * 100, 5)
        );

        // Visual position of the interactive handle
        point.style.top = (local_y - HANDLE_CENTER) + "px";
        point.style.left = (local_x - HANDLE_CENTER) + "px";

        // Insert the newly created point and its handle
        this.handles_container.appendChild(point);
        this.grid_points.push(point);

        this.updateDistanceLabels();
        this.redraw();
    }

    constructGridPoint(x, y) {
        // Interactive handle for the point
        let point = document.createElement("div");
        point.classList.add("grid-handle");

        // Position in percentage, relative to the image on canvas
        point.x = x;
        point.y = y;

        // Enable both horizontal and vertical lines initially
        point.horizontal = true;
        point.vertical = true;

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

        return point;
    }

    generateGrid(n, m) {
        this.clearGridPoints();

        let u = Math.min(n, m),
            v = Math.max(n, m),
            horizontal_part = 100 / n,
            vertical_part = 100 / m;

        for (let i = 1; i < u; i++) {
            let point = this.constructGridPoint(i * horizontal_part, i * vertical_part);
            this.handles_container.appendChild(point);
            this.grid_points.push(point);
        }

        for (let i = u; i < v; i++) {
            let point = n > m
                ? this.constructGridPoint(i * horizontal_part, 100)
                : this.constructGridPoint(100, i * vertical_part);
            point.horizontal = m > n;
            point.vertical = n > m;
            this.handles_container.appendChild(point);
            this.grid_points.push(point);
        }

        this.updateHandles();
        this.updateDistanceLabels();
        this.redraw();
    }

    clearGridPoints() {
        while (this.grid_points.length > 0)
            this.grid_points.pop().remove();
    }

    updateHandles() {
        [...this.grid_points, ...this.resize_points].forEach((point) => {
            let local_x = this.image_width * (point.x / 100) + this.image_x;
            let local_y = this.image_height * (point.y / 100) + this.image_y;
            point.style.top = (local_y - HANDLE_CENTER) + "px";
            point.style.left = (local_x - HANDLE_CENTER) + "px";
        });
    }

    showGridHandles(show) {
        let css_visibility = show ? "visible" : "hidden";
        for (let i = 0, length = this.grid_points.length; i < length; i++)
            this.grid_points[i].style.visibility = css_visibility;
    }

    showResizeHandles(show) {
        let css_visibility = show ? "visible" : "hidden";

        // Initialize resize handles for the first time
        if (!this.resize_points.length) {
            for (let i = 0; i < 2; i++) {
                // Interactive handle for the point
                let point = document.createElement("div");
                point.classList.add("grid-handle");
                point.style.visibility = css_visibility;

                // Visual position of the interactive handle
                let local_x = this.image_x,
                    local_y = this.image_y;
                if (i === 1) {
                    local_x += this.image_width;
                    local_y += this.image_height;
                }
                point.style.top = (local_y - HANDLE_CENTER) + "px";
                point.style.left = (local_x - HANDLE_CENTER) + "px";

                // Position in percentage, relative to the image on canvas
                if (i === 0) {
                    point.x = 0;
                    point.y = 0;
                } else {
                    point.x = 100;
                    point.y = 100;
                }

                // Resize selection rectangle when moving the handle
                makeElementDraggable(point, (global_x, global_y) => {
                    point.x = toFixedNumber(((global_x + HANDLE_CENTER - this.image_x) / this.image_width) * 100, 5);
                    point.y = toFixedNumber(((global_y + HANDLE_CENTER - this.image_y) / this.image_height) * 100, 5);
                    this.redraw();
                });

                // Move selection rectangle on right click dragging
                makeElementDraggable(point, (global_x, global_y) => {
                    let other_point = this.resize_points[i === 0 ? 1 : 0];
                    let prev_x = point.x,
                        prev_y = point.y;
                    point.x = toFixedNumber(((global_x + HANDLE_CENTER - this.image_x) / this.image_width) * 100, 5);
                    point.y = toFixedNumber(((global_y + HANDLE_CENTER - this.image_y) / this.image_height) * 100, 5);

                    other_point.x += point.x - prev_x;
                    other_point.y += point.y - prev_y;
                    other_point.style.top = ((this.image_height * (other_point.y / 100) + this.image_y) - HANDLE_CENTER) + "px";
                    other_point.style.left = ((this.image_width * (other_point.x / 100) + this.image_x) - HANDLE_CENTER) + "px";

                    this.redraw();
                }, 2);

                // Insert the newly created point and its handle
                this.handles_container.appendChild(point);
                this.resize_points.push(point);
            }
            return;
        }

        for (let i = 0; i < 2; i++)
            this.resize_points[i].style.visibility = css_visibility;
    }

    resetResizeHandles() {
        if (!this.resize_points.length)
            return;

        let point_a = this.resize_points[0],
            point_b = this.resize_points[1];
        point_a.x = 0;
        point_a.y = 0;
        point_b.x = 100;
        point_b.y = 100;
    }

    cropImage() {
        // Determine top left point of the rectangle
        let point_a = this.resize_points[0],
            point_b = this.resize_points[1];
        let top_left_index = 0;
        if (point_a.x < point_b.x) top_left_index = 0;
        else if (point_a.x > point_b.x) top_left_index = 1;
        else return;
        point_a = this.resize_points[top_left_index];
        point_b = this.resize_points[top_left_index === 0 ? 1 : 0];

        // Store crop coordinates and keep the image object untouched
        this.source_x = this.source_width * (point_a.x / 100) + this.source_x;
        this.source_y = this.source_height * (point_a.y / 100) + this.source_y;
        this.source_width = this.source_width * ((point_b.x - point_a.x) / 100);
        this.source_height = this.source_height * ((point_b.y - point_a.y) / 100);

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

    setResizeDimensions(virtual_width, virtual_height) {
        let point_a = this.resize_points[0],
            point_b = this.resize_points[1],
            top_left_index = point_a.x <= point_b.x ? 0 : 1;
        point_a = this.resize_points[top_left_index];
        point_b = this.resize_points[top_left_index === 0 ? 1 : 0];

        point_b.x = point_a.x + virtual_width;
        point_b.y = point_a.y + virtual_height;
        this.updateHandles();
        this.redraw();
    }

    loadLocalImage(file) {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            window.alert("File API is not supported.");
            return;
        }

        let fileReader = new FileReader();
        fileReader.onload = () => {
            this.image.onload = () => {
                this.clearGridPoints();
                this.resetResizeHandles();
                this.source_width = this.image.width;
                this.source_height = this.image.height;
                this.updateImageDimensions();
                this.redraw();
            };
            this.image.src = fileReader.result;
        };
        fileReader.readAsDataURL(file);
    }

    loadImageURL(url) {
        this.image.onload = () => {
            this.clearGridPoints();
            this.resetResizeHandles();
            this.source_width = this.image.width;
            this.source_height = this.image.height;
            this.updateImageDimensions();
            this.redraw();
        };
        this.image.src = url;
    }
}

const singletonWorkspaceEngine = new WorkspaceEngine();
export default singletonWorkspaceEngine;
