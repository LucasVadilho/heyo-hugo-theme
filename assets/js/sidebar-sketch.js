let theme, sketch, h, w, showHoverOptions;

let canvas;

function setup() {
    let container = document.getElementById('sidebar-sketch');

    updateTheme();

    let sketchName = getCookie('sketch-name') || container.getAttribute('data-sketch') || 'Graph';
    let showHoverOptions = container.getAttribute('data-sketch-show-hover') === 'true';
    let sketchOptions = JSON.parse(container.getAttribute('data-sketch-starting') || "{}");

    if(!(sketchName in SKETCHES)) sketchName = 'Graph';

    sketch = new Meta(sketchName, showHoverOptions, sketchOptions);
}

function draw() {
    sketch.draw();
}

function mouseClicked(e) {
    sketch.mouseClicked(e);
}

function mouseWheel(e) {
    sketch.mouseWheel(e);
}

function updateTheme() {
    let styles = getComputedStyle(document.body);

    theme = {
        bg: color(styles.getPropertyValue('--bg-color')),
        bgSecondary: color(styles.getPropertyValue('--secondary-bg-color')),
        a: color(styles.getPropertyValue('--a-color')),
        body: color(styles.getPropertyValue('--body-color')),
        blockquote: color(styles.getPropertyValue('--blockquote-text-color')),
        name: document.getElementsByTagName('html')[0].getAttribute('data-theme')
    }

    if (sketch) {
        sketch.updateTheme();
    }
}

function windowResized() {
    if (windowWidth <= 950) {
        noLoop();
        return;
    } else {
        loop();
    }

    let container = document.getElementById('sidebar-sketch');
    let { width, height } = container.getBoundingClientRect();

    h = height
    w = width

    resizeCanvas(width, height);
}

document.addEventListener('DOMContentLoaded', () => {
    let themeSwitcher = document.querySelector('.theme-switch')
    themeSwitcher.addEventListener('click', updateTheme, false)
}, false)

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}