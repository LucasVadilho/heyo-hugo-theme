// Adaptated from
// https://www.gorillasun.de/blog/simulating-brush-strokes-with-hookes-law-in-p5js-and-processing/

class mouseGenerator {
    constructor() {}

    getCoordinates() {
        if(mouseIsPressed) {
            return {'x': mouseX, 'y': mouseY};
        }
        else {
            return {'x': undefined, 'y': undefined};
        }
    }
}

class circleGenerator {
    constructor() {
        this.cx = w / 2;
        this.cy = h / 2;

        this.minDim = Math.min(w, h);
        this.r = this.minDim / 2 - 10;

        this.t = 0;
        this.toff = .3;
        this.nCircles = 0;
        this.maxCircles = Math.floor(4 * Math.random());

        this.noiseStart = 100000 * Math.random();

        this.tlimit = TWO_PI;
    }

    getLimit() {
        let sign = Math.random() > .5 ? 1 : -1;
        let offset = sign * .25 * Math.random();

        return (1 + offset) * TWO_PI;
    }

    getCoordinates() {
        if(this.t <= this.toff) {
            let x = this.cx + this.r * Math.cos(.1);
            let y = this.cy + this.r * Math.sin(.1);

            this.t += .1;
            return {'x': x, 'y': y}
        }
        if(this.t <= this.tlimit) {
            let x = this.cx + this.r * Math.cos(this.t);
            let y = this.cy + this.r * Math.sin(this.t);

            // this.t += .3 * Math.random();
            this.t += this.toff * noise(this.noiseStart + this.t);

            return {'x': x, 'y': y};

        } else if(this.nCircles < this.maxCircles) {
            this.cx = w * Math.random();
            this.cy = h * Math.random();

            this.r = 100 + this.minDim / 2 * Math.random();
            this.t = 0;
            
            this.toff = map(this.r, 100, 100 + this.minDim / 2, .5, .1);
            this.noiseStart = 100000 * Math.random();

            this.tlimit = this.getLimit();

            this.nCircles += 1;

            return this.getCoordinates();
        } else {
            return {'end': true, 'x': undefined, 'y': undefined};
        }
    }
}

class CirclesBrushStrokes {
    constructor() {
        this.setup();
    }

    setup() {
        // this.pointGenerator = pointGenerator || new mouseGenerator();
        this.circleGenerator = new circleGenerator();
        this.mouseGenerator = new mouseGenerator();

        this.pointGenerator = this.circleGenerator;

        this.k = .8;
        this.mu = .9;

        // defined experimentally
        this.nSegments = 100;
        this.maxSize = 30;

        this.updateTheme();

        let {x, y} = this.pointGenerator.getCoordinates();

        this.x = x;
        this.y = y;
    }

    update() {
        // Store old stuff
        this.oldX = this.x;
        this.oldY = this.y;
        this.oldSize = this.size;

        // Get new point
        let {x, y, end} = this.pointGenerator.getCoordinates();

        // If the main generator has ended
        /// we setup for the mouse
        if(end) this.toggleMouse();

        // If no new point we return false
        if(!x || !y) {
            this.x = mouseX;
            this.y = mouseY;

            return false;
        }

        // Hooke's law (ish) to calculate changes
        this.vx = (x - this.oldX) * this.k;
        this.vy = (y - this.oldY) * this.k;
        
        this.vx *= this.mu;
        this.vy *= this.mu;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // We will use the velocity to map the brush stroke size
        this.v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.size = this.logisticMap(this.v);

        return true;
    }

    logisticMap(x) {
        let k = .1;

        return 1 + (this.maxSize - 1) / (1 + Math.exp(k * (x - 20)));
    }

    draw() {
        if(this.update()) {
            stroke(this.color);
            
            let x0 = this.oldX;
            let y0 = this.oldY;

            push();

            noFill();
            stroke(theme.a);
            circle(x0 + Math.random() * 50, y0 + Math.random() * 50, 10 * Math.random());
            
            pop();
            
            for(let i = 0; i < this.nSegments; i++) {
                // from p0 to p create nSegments lines
                let x1 = map(i, 0, this.nSegments - 1, this.oldX, this.x);
                let y1 = map(i, 0, this.nSegments - 1, this.oldY, this.y);
                let s = map(i, 0, this.nSegments - 1, this.oldSize, this.size);

                strokeWeight(s);

                line(x0, y0, x1, y1);

                strokeWeight(s * .5 * Math.random());
                let d = 10;
                line(x0 + d, y0 + d, x1 + d, y1 + d);

                strokeWeight(s * .2 * Math.random());
                line(x0 - .5 * d, y0 - .5 * d, x1 -.5 * d, y1 - .5 * d);

                strokeWeight(s * .1 * Math.random());
                line(x0 - .25 * d, y0 - .25 * d, x1 -.25 * d, y1 - .25 * d);

                x0 = x1;
                y0 = y1;

            }

            // circle(this.x, this.y, this.size);
        }
    }

    setColor(color) {
        this.color = color;
    }

    updateTheme() {
        background(theme.bg);

        if(theme.name == 'dark') {
            this.setColor('rgb(0, 0, 0)');
        } else {
            this.setColor('rgb(34, 22, 22)');
        }

        this.pointGenerator = new circleGenerator();
        let {x, y} = this.pointGenerator.getCoordinates();

        this.x = x;
        this.y = y;
    }
    
    mouseClicked(e) {}

    mouseWheel(e) {}

    toggleMouse() {
        this.mouseMode.checked(!this.mouseMode.checked());

        if(this.pointGenerator !== this.mouseGenerator) {
            this.pointGenerator = this.mouseGenerator;
        } else {
            this.pointGenerator = this.circleGenerator;
        }
    }

    getSettings() {
        // Clear canvas
        let clearButton = createButton(`<i class="fa fa-fw fa-trash"></i>`);
        clearButton.mousePressed(() => {
            background(theme.bg);
        });

        // Springness
        let kSlider = createSlider(0.001, 1, this.k, .01);
        kSlider.input(() => {
            this.k = kSlider.value();
        });

        // Friction
        let muSlider = createSlider(0.001, 1, 1 - this.mu, .01);
        muSlider.input(() => {
            this.mu = 1 - muSlider.value();
        });

        // Color
        let colorPicker = createColorPicker(this.color);
        colorPicker.input(() => {
            this.setColor(color(colorPicker.value()));
        });

        // Mouse mode
        this.mouseMode = createCheckbox();
        this.mouseMode.changed(this.toggleMouse);

        return {
            'Brush': colorPicker,
            'Clear': clearButton,
            'Springness': kSlider,
            'Friction': muSlider,
            'Draw': this.mouseMode
        }
    }
}