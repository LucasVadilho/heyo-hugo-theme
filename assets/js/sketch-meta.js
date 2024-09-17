const SKETCHES = {
    'Graph': Graph,
    'Digital Rain': DigitalRain,
    'Circles': CirclesBrushStrokes,
    'Boids': Boids,
    'Quadtree Visualization': VizQuadtree,
}

class Meta {
    constructor(name, showHover, sketchOptions) {
        this.name = name;
        this.showHover = showHover;
        this.sketchOptions = sketchOptions;

        this.sketchNames = Object.keys(SKETCHES);

        this.container = document.getElementById('sidebar-sketch');
        this.canvas = createCanvas();

        this.fullScreen = false;

        // FPS stuff
        this.fps = 0, this.fpsInterval = 300, this.fpsDisplay = false;

        setInterval(() => {
            this.fps = frameRate().toFixed(2);
        }, this.fpsInterval);

        this.setup();
    }

    setup() {
        if(this.container === null) {
            noLoop();
            return;
        }

        this.canvas.parent(this.container);
        this.windowResized();

        // drawingContext.reset();
        // we will pop on sketch change!
        push();

        this.sketch = new SKETCHES[this.name](this.sketchOptions);
        this.sketch.setup();

        if(this.showHover) {
            let container = document.getElementById('sidebar-sketch');

            this.createSettingsDiv();

            container.addEventListener('mouseover', () => {
                this.settingsDiv.style('display', 'flex');
            });

            container.addEventListener('mouseleave', (e) => {
                let { x, y, width, height } = container.getBoundingClientRect();
                
                if(e.pageX > width || e.pageX < x || e.pageY > height || e.pageY < y)
                    this.settingsDiv.style('display', 'none');
            });
        }
    }
    
    windowResized() {
        if (windowWidth <= 950) {
            noLoop();
            return;
        } else {
            loop();
        }
    
        let { width, height } = this.container.getBoundingClientRect();
    
        h = height
        w = width
    
        resizeCanvas(width, height);
        
        if(this.sketch && this.sketch.windowResized) this.sketch.windowResized();
    }
    
    toggleFullscreen() {
        if(this.fullScreen) {
            this.container.style.position = 'initial';

            this.windowResized();

            this.settingsDiv.position(0, this.container.getBoundingClientRect().y + 20);

            // Unhide top menu, it has z-index
            document.getElementsByClassName('page-top')[0].style.display = 'block';

            this.fullScreen = false;
        } else {
            let width = window.innerWidth || document.documentElement.clientWidth;
            let height = window.innerHeight || document.documentElement.clientHeight;

            resizeCanvas(width, height);

            w = width;
            h = height;

            this.container.style.position = 'fixed';
            this.container.style.left = '0';
            this.container.style.top = '0';
            
            this.settingsDiv.position(0, 20);

            // Hide top menu, it has z-index
            document.getElementsByClassName('page-top')[0].style.display = 'none';

            this.fullScreen = true;
        }
        
        this.sketch.setup();
    }

    draw() {
        this.sketch.draw();

        if(this.fpsDisplay) {
            let fpsWidth = textWidth(this.fps);
            
            push();
                noStroke();
                textAlign(LEFT);
                textSize(16);

                fill(theme.bg);
                rect(5, 0, fpsWidth, 16);

                fill(theme.body);
                text(this.fps, 5, 16);
            pop();
        }
    }

    saveState() {
        this.sketch.saveState();
        console.log(1);
    }

    updateTheme() {
        this.sketch.updateTheme();
    }

    mouseClicked(e) {
        this.sketch.mouseClicked(e);
    }

    mouseWheel(e) {
        this.sketch.mouseWheel(e);
    }

    createSettingsBox(title, element) {
        let box = createDiv();
        
        box.style('display', 'flex');
        box.style('flex-direction', 'column');
        box.style('align-items', 'center');
        box.style('background-color', 'var(--bg-color)');
        box.style('padding', '5px');
        box.style('border', '1px dashed var(--a-color)');
        // box.style('box-sizing', 'border-box');
        // box.style('box-shadow', 'var(--box-shadow)');

        createDiv(title).parent(box);
        element.parent(box);
        
        return box;
    }

    createSettingsDiv() {
        let container = document.getElementById('sidebar-sketch');
        let {x, y, width, height} = container.getBoundingClientRect()

        let settingsDiv = createDiv();
        settingsDiv.id('sketch-settings');
        settingsDiv.style('width', '100%');
        settingsDiv.style('display', 'none');
        settingsDiv.style('justify-content', 'space-evenly');
        settingsDiv.style('flex-wrap', 'wrap');
        settingsDiv.style('gap', '5px');

        settingsDiv.position(0, y + 20);
        settingsDiv.parent(container);

        this.settingsDiv = settingsDiv;

        // Choose sketch
        let sketchSelect = createSelect();
        
        this.sketchNames.map(k => sketchSelect.option(k));
        sketchSelect.selected(this.name);

        sketchSelect.changed(() => {
            this.settingsDiv.remove();
            this.name = sketchSelect.value();

            setCookie('sketch-name', this.name);
            
            pop();

            this.setup();
        });

        let sketchBox = this.createSettingsBox('Sketch', sketchSelect);
        sketchBox.parent(settingsDiv);

        // Sketch settings
        let sketchSettings = this.sketch.getSettings() || {};
        for(const [name, el] of Object.entries(sketchSettings)) {
            let temp = this.createSettingsBox(name, el);

            temp.parent(settingsDiv);
        }

        this.settingsDiv = settingsDiv;
        
        // FPS
        let fpsCheckbox = createCheckbox('', this.fpsDisplay);
        let fpsBox = this.createSettingsBox('FPS', fpsCheckbox);

        fpsCheckbox.changed(() => this.fpsDisplay = fpsCheckbox.checked());
        
        fpsBox.parent(settingsDiv);

        // Fullscreen
        let fsCheckbox = createCheckbox('', this.fullScreen);
        let fsBox = this.createSettingsBox('Full screen', fsCheckbox);

        fsBox.changed(this.toggleFullscreen.bind(this));

        fsBox.parent(settingsDiv);
    }
}