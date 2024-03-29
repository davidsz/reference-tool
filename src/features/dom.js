export function makeElementDraggable(element, positionUpdatedCallback, button_id = 0) {
    // The element assumed to have "position: absolute;"
    let posX = 0, posY = 0, prevPosX = 0, prevPosY = 0;
    element.addEventListener("mousedown", dragMouseDown);
    if (button_id === 2) {
        element.oncontextmenu = function (e) {
            e.preventDefault();
        };
    }

    function dragMouseDown(e) {
        if (e.button !== button_id)
            return;
        e = e || window.event;
        e.preventDefault();
        prevPosX = e.clientX;
        prevPosY = e.clientY;
        document.addEventListener("mousemove", dragMouseMove);
        document.addEventListener("mouseup", dragMouseUp);
    }

    function dragMouseMove(e) {
        e = e || window.event;
        e.preventDefault();
        posX = prevPosX - e.clientX;
        posY = prevPosY - e.clientY;
        prevPosX = e.clientX;
        prevPosY = e.clientY;
        let top = element.offsetTop - posY;
        let left = element.offsetLeft - posX;
        element.style.top = top + "px";
        element.style.left = left + "px";

        if (positionUpdatedCallback)
            positionUpdatedCallback(left, top, e.clientX, e.clientY);
    }

    function dragMouseUp() {
        document.removeEventListener("mousemove", dragMouseMove);
        document.removeEventListener("mouseup", dragMouseUp);
    }
}

export function attachRightClickHandler(element, callback) {
    element.oncontextmenu = function (e) {
        e.preventDefault();
    };
    element.addEventListener("mouseup", function (e) {
        if (e.button === 2) {
            e.preventDefault();
            callback();
        }
    });
}
