Math.clamp = (val, min, max) => Math.min(max, Math.max(min, val));

let browserWindow = $(window);
let browserDoc = $(document);

let viewport = $('#viewport');
let innerWindow = $('#window');
let toolbar = $('#toolbar');
let body = $('#body');
let content = $('#content');
let element = $('#element');
let banner = $('#banner');

moveElement()

let lastPosition = 0;
let holdPosition = 0;
viewport.on('mousedown', (event) => {
    event.preventDefault();
    $(toolbar).removeClass('_transition');
    $(viewport).removeClass('_transition');

    let startPosition = viewport.offset().top;
    holdPosition = event.clientY;
    browserWindow.on('mousemove', (event) => {
        let maxPosition = browserDoc.height() - viewport.outerHeight();
        let oldPosition = viewport.offset().top;
        let position = event.clientY - holdPosition + oldPosition;

        position = Math.clamp(position, 0, maxPosition);

        holdPosition = event.clientY;

        let dif = position - oldPosition;

        dif = toolbar.position().top - dif;
        dif = Math.clamp(dif, -toolbar.height(), 0)
        toolbar.css('top', dif + 'px');
        viewport.css('top', position + 'px');
    });

    browserWindow.on('mouseup', (event) => {
        browserWindow.off('mousemove');
        browserWindow.off('mouseup');
        let endPosition = viewport.offset().top;

        if (endPosition == startPosition) {
            return;
        }

        $(toolbar).addClass('_transition');
        $(viewport).addClass('_transition');

        if(endPosition > startPosition) {
            toolbar.css('top', -toolbar.height() + 'px');
            innerWindow.css('top', 0);
            viewport.css('top', Math.max(viewport.offset().top, toolbar.height()) + 'px');
        }
        else {
            toolbar.css('top', 0);
            innerWindow.css('top', toolbar.height() + 'px');
        }

        moveElement()
    })
})

function moveElement() {
    let windowHeight = innerWindow.outerHeight();
    let contentHeight = content.height();
    let pageOffsetY = viewport.offset().top;
    let bannerHeight = banner.height();

    // The answer - on scroll end
    if (pageOffsetY > contentHeight - windowHeight + bannerHeight) {
        element.css('top', contentHeight - element.height() + 'px')
    }
    else {
        element.css('top', windowHeight - element.height() - bannerHeight + 'px')
    }
}