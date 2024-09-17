const pointToLineSegment = (p, a, b) => {
    let ab = b.copy().sub(a);
    let ap = p.copy().sub(a);

    let projectedLength = ap.dot(ab);
    let distanceInAB = projectedLength / ab.magSq();

    if(distanceInAB < 0) return [a, p.dist(a)];

    if(distanceInAB > 1) return [b, p.dist(b)];

    let closestPoint = a.copy().add(ab.mult(distanceInAB));
    return [closestPoint, p.dist(closestPoint)];
}

class AABB {
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;
        
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.center = createVector(
            this.position.x + this.halfWidth,
            this.position.y + this.halfHeight
        );
    }

    contains(obj) {
        let inX = obj.position.x > this.position.x && obj.position.x < (this.position.x + this.width);
        let inY = obj.position.y > this.position.y && obj.position.y < (this.position.y + this.height);
        
        return inX && inY;
    }

    intersects(region) {
        if(region.constructor.name === "AABB") return this.intersectsAABB(region);
        if(region.constructor.name === "Circle") return this.intersectsCircle(region);

        return false;
    }

    intersectsAABB(otherAABB) {
        let xCenterDist = Math.abs(this.center.x - otherAABB.center.x);
        let inX = ((this.halfWidth + otherAABB.halfWidth) - xCenterDist) >= 0;

        let yCenterDist = Math.abs(this.center.y - otherAABB.center.y);
        let inY = ((this.halfHeight + otherAABB.halfHeight) - yCenterDist) >= 0;

        return inX && inY;
    }

    intersectsCircle(circle) {
        // Center is inside AABB
        if(this.contains(circle))
            return true;

        // Vertices of AABB
        let a = this.position;                                                      // Top left
        let b = this.position.copy().add(createVector(this.width, 0));              // Top right
        let c = this.position.copy().add(createVector(0, this.height));             // Bottom left
        let d = this.position.copy().add(createVector(this.width, this.height));    // Bottom right
        
        // Find the closest edge to the circle center
        let [closestTop, distanceTop] = pointToLineSegment(circle.position, a, b);
        let [closestLeft, distanceLeft] = pointToLineSegment(circle.position, a, c);
        let [closestBottom, distanceBottom] = pointToLineSegment(circle.position, c, d);
        let [closestRight, distanceRight] = pointToLineSegment(circle.position, d, b);

        let minDistance = min(distanceTop, distanceLeft, distanceBottom, distanceRight);

        // Check if min distance is smaller than the radius
        return minDistance < circle.r;
    }

    aintersectsCircle(circle) {
        console.log(1);
        if(this.contains(circle)) {
            push();
            stroke('green');
            strokeWeight(5);
            point(this.center.x, this.center.y);
            pop();
            return true;
        }

        let closestX = this.center.x;
        let closestY = this.center.y;
        
        if(circle.position.x < this.center.x) closestX = this.position.x; // circle is to the left
        else closestX = this.position.x + this.width;

        if(circle.position.y < this.center.y) closestY = this.position.y; // circle is to the top
        else closestY = this.position.y + this.height;

        let dx = circle.position.x - closestX;
        let dy = circle.position.y - closestY;

        line(circle.position.x, circle.position.y, closestX, closestY);

        push();
        stroke('red');
        strokeWeight(5);
        point(closestX, closestY);
        // console.log(closestX, closestY);
        pop();

        return (dx * dx + dy * dy) < circle.r * circle.r;
    }

    getAABB() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
        }
    }

    draw() {
        let {x, y, width, height} = this.getAABB();

        push();
            noFill();
            stroke('blue');
            rect(x, y, width, height);
        pop();
    }
}

class Circle {
    constructor(position, r) {
        this.position = position;
        this.r = r;
    }

    contains(obj) {
        return this.position.dist(obj.position) < this.r;
    }

    draw() {
        push();
            noFill();
            stroke(theme.a);
            strokeWeight(1);
            
            circle(this.position.x, this.position.y, this.r * 2);
        pop();
    }
}

class Quadtree {
    constructor(aabb, capacity) {
        this.aabb = aabb;
        this.capacity = capacity;
        this.subdivided = false;

        this.objs = [];

    }

    insert(obj) {
        if(!this.aabb.contains(obj))
            return false;

        if(this.objs.length < this.capacity) {
            this.objs.push(obj);

            return true;
        }

        if(!this.subdivided)
            this.subdivide();

        if(this.topLeft.insert(obj))
            return true;
        if(this.topRight.insert(obj))
            return true;
        if(this.bottomLeft.insert(obj))
            return true;
        if(this.bottomRight.insert(obj))
            return true;

        return false;
    }

    subdivide() {
        let {x, y, width, height} = this.aabb.getAABB();

        let newWidth = width / 2;
        let newHeight = height / 2;

        this.topLeft = new Quadtree(new AABB(createVector(x, y), newWidth, newHeight), this.capacity);
        this.bottomLeft = new Quadtree(new AABB(createVector(x, y + newHeight), newWidth, newHeight), this.capacity);
        this.topRight = new Quadtree(new AABB(createVector(x + newWidth, y), newWidth, newHeight), this.capacity);
        this.bottomRight = new Quadtree(new AABB(createVector(x + newWidth, y + newHeight), newWidth, newHeight), this.capacity);

        this.subdivided = true;
    }

    queryAABB(aabb) {
        let objsInAABB = [];

        if(!this.aabb.intersects(aabb)) return objsInAABB;

        for(let obj of this.objs) {
            if(aabb.contains(obj)) {
                objsInAABB.push(obj);
            }
        }

        if(this.subdivided) {
            objsInAABB.concat(this.topRight.queryAABB(aabb));
            objsInAABB.concat(this.topLeft.queryAABB(aabb));
            objsInAABB.concat(this.bottomRight.queryAABB(aabb));
            objsInAABB.concat(this.bottomLeft.queryAABB(aabb));
        }

        return objsInAABB;
    }

    queryCircle(circle) {
        let objsInCircle = [];

        if(!this.aabb.intersectsCircle(circle))
            return objsInCircle;

        for(let obj of this.objs)
            if(circle.contains(obj)) objsInCircle.push(obj);

        if(this.subdivided) {
            objsInCircle.push(...this.topLeft.queryCircle(circle));
            objsInCircle.push(...this.topRight.queryCircle(circle));
            objsInCircle.push(...this.bottomLeft.queryCircle(circle));
            objsInCircle.push(...this.bottomRight.queryCircle(circle));
        }

        return objsInCircle;
    }
    
    draw() {
        if(!Quadtree.QT_DRAW) {
            console.log('Set Quadtree.QT_DRAW');
            return;
        }

        let {x, y, width, height} = this.aabb.getAABB();
        let QT_DRAW = Quadtree.QT_DRAW;

        QT_DRAW.mask.draw();

        push();
            if(this.aabb.intersects(QT_DRAW.mask)) QT_DRAW.structureStroke.setAlpha(255);
            else QT_DRAW.structureStroke.setAlpha(30);
            
            stroke(QT_DRAW.structureStroke);
            strokeWeight(QT_DRAW.structureStrokeWeight);
            fill(QT_DRAW.structureFill);
            
            rect(x, y, width, height);
        pop();

        if(QT_DRAW.showObjs) {
            push();
                strokeWeight(QT_DRAW.objStrokeWeight);
                fill(QT_DRAW.objFill);

                for(let obj of this.objs) {
                    if(QT_DRAW.mask.contains(obj)) QT_DRAW.objStroke.setAlpha(255);
                    else QT_DRAW.objStroke.setAlpha(30);
                    
                    stroke(QT_DRAW.objStroke);
                    
                    point(obj.position.x, obj.position.y);
                }
            pop();
        }

        if(this.subdivided) {
            this.topLeft.draw();
            this.topRight.draw();
            this.bottomLeft.draw();
            this.bottomRight.draw();
        }
    }

    reset(capacity) {
        this.objs = [];
        this.subdivided = false;
        this.capacity = capacity || this.capacity;

        this.topLeft = undefined;
        this.topRight = undefined;
        this.bottomLeft = undefined;
        this.bottomRight = undefined;
    }

    setDrawOptions(drawOptions) {
        this.drawOptions = {...this.drawOptions, ...drawOptions};

        if(this.subdivided) {
            this.topLeft.setDrawOptions(drawOptions);
            this.topRight.setDrawOptions(drawOptions);
            this.bottomLeft.setDrawOptions(drawOptions);
            this.bottomRight.setDrawOptions(drawOptions);
        }
    }
}

class Boid {
    // Simulation parameters
    static PERCEPTION_RANGE = 20;
    static SEPARATION_COEF = 0.0018;
    static ALIGNMENT_COEF = 0.1136;
    static COHESION_COEF = 0.0022;
    static MIN_SPEED = 1.5;
    static MAX_SPEED = 4;

    static AVOID_EDGES = true;
    static EDGE_MARGIN = 90;
    static EDGE_SPEED = 0.1;

    // Visual parameters
    static SIZE_MULTIPLIER = 7;
    static STROKE = 'black';
    static FILL = 'white';
    static DEBUG_LINES = false;

    constructor({
        position, velocity, acceleration, 
        separation, alignment, cohesion,
        margin} = {}) {
        this.position = position || createVector(random(width), random(height));
        this.velocity = velocity || createVector(random(-5, 5), random(-5, 5));
        this.acceleration = acceleration || createVector(0, 0);

        this.separation = separation || createVector(0, 0);
        this.alignment = alignment || createVector(0, 0);
        this.cohesion = cohesion || createVector(0, 0);

        this.margin = margin || createVector(0, 0);
    }

    update(neighbors) {
        this.separation.set(0, 0);
        this.alignment.set(0, 0);
        this.cohesion.set(0, 0);
        this.margin.set(0, 0);

        for(let neighbor of neighbors) {
            this.separation.add(this.position.copy().sub(neighbor.position));
            this.alignment.add(neighbor.velocity);
            this.cohesion.add(neighbor.position);
        }

        this.separation.mult(Boid.SEPARATION_COEF);
        if(neighbors.length > 0) {
            this.alignment.div(neighbors.length).sub(this.velocity).mult(Boid.ALIGNMENT_COEF);
            this.cohesion.div(neighbors.length).sub(this.position).mult(Boid.COHESION_COEF);
        }
        
        if(Boid.AVOID_EDGES) {
            if(this.position.x > width - Boid.EDGE_MARGIN) this.margin.set(-Boid.EDGE_SPEED, 0);
            else if(this.position.x < Boid.EDGE_MARGIN) this.margin.set(Boid.EDGE_SPEED, 0);
            
            if(this.position.y > height - Boid.EDGE_MARGIN) this.margin.set(0, -Boid.EDGE_SPEED);
            else if(this.position.y < Boid.EDGE_MARGIN) this.margin.set(0, Boid.EDGE_SPEED);
        } else {
            if(this.position.x > width) this.position.x = 0;
            else if(this.position.x < 0) this.position.x = width;
            
            if(this.position.y > height) this.position.y = 0;
            else if(this.position.y < 0) this.position.y = height;
        }

        this.velocity
            .add(this.separation)
            .add(this.alignment)
            .add(this.cohesion)
            .add(this.margin);
        
        let speed = this.velocity.mag();
        if(speed > Boid.MAX_SPEED)
            this.velocity.normalize().mult(Boid.MAX_SPEED);
        else if(speed < Boid.MIN_SPEED)
            this.velocity.normalize().mult(Boid.MIN_SPEED);

        this.position.add(this.velocity);
    }

    getTrianglePoints() {
        let normalizedVelocity = this.velocity.copy().normalize();

        let tip = this.position.copy().add(normalizedVelocity.copy().mult(Boid.SIZE_MULTIPLIER));

        // https://mackiemathew.wordpress.com/2014/03/01/finding-a-normal-perpendicular-vector-on-a-2d-plane/
        // (u, v) -> (-v, u) and (v, -u)
        let up = this.position.copy()
            .add(createVector(-normalizedVelocity.y, normalizedVelocity.x)
            .mult(Boid.SIZE_MULTIPLIER / 4));
        let down = this.position.copy()
            .add(createVector(normalizedVelocity.y, -normalizedVelocity.x)
            .mult(Boid.SIZE_MULTIPLIER / 4));
        
        return [tip, up, down];
    }

    draw() {
        push();
            if(Boid.DEBUG_LINES || this.showDebugLines) {
                noFill();
                
                stroke(theme.a);
                circle(this.position.x, this.position.y, 2 * Boid.PERCEPTION_RANGE);

                push();
                    translate(this.position.x, this.position.y)

                    stroke(theme.a);
                    let velocityFactor = map(this.velocity.mag(), 0, Boid.MAX_SPEED, 0, Boid.PERCEPTION_RANGE);
                    let velocity = this.velocity.copy().normalize().mult(velocityFactor);
                    line(0, 0, velocity.x, velocity.y);

                    stroke('red');
                    let separationFactor = map(this.velocity.mag(), 0, Boid.MAX_SPEED, 0, Boid.PERCEPTION_RANGE);
                    let separation = this.separation.copy().normalize().mult(separationFactor);
                    line(0, 0, separation.x, separation.y);

                    stroke('green');
                    let alignment = this.alignment.copy().normalize().mult(Boid.PERCEPTION_RANGE);
                    line(0, 0, alignment.x, alignment.y);

                    stroke('pink');
                    let cohesion = this.cohesion.copy().normalize().mult(Boid.PERCEPTION_RANGE);
                    line(0, 0, cohesion.x, cohesion.y);
                pop();
            }

            fill(this.fillColor || Boid.FILL);
            stroke(this.strokeColor || Boid.STROKE);
            
            let [tip, left, right] = this.getTrianglePoints();

            triangle(tip.x, tip.y, left.x, left.y, right.x, right.y);
            // quad(tip.x, tip.y, left.x, left.y, this.position.x, this.position.y-10, right.x, right.y);
        pop();
    }

    exportBoid() {
        return {
            'position': [this.position.x, this.position.y],
            'velocity': [this.velocity.x, this.velocity.y],
            'acceleration': [this.acceleration.x, this.acceleration.y],
            'separation': [this.separation.x, this.separation.y],
            'alignment': [this.alignment.x, this.alignment.y],
            'cohesion': [this.cohesion.x, this.cohesion.y],
            'margin': [this.margin.x, this.margin.y]
        }
    }

    static loadBoid(boid) {
        return new Boid({
            'position': createVector(boid.position[0], boid.position[1]),
            'velocity': createVector(boid.velocity[0], boid.velocity[1]),
            'acceleration': createVector(boid.acceleration[0], boid.acceleration[1]),
            'separation': createVector(boid.separation[0], boid.separation[1]),
            'alignment': createVector(boid.alignment[0], boid.alignment[1]),
            'cohesion': createVector(boid.cohesion[0], boid.cohesion[1]),
            'margin': createVector(boid.margin[0], boid.margin[1])
        });
    }
}

class Boids {
    static SHOW_QUADTREE = false;
    static SHOW_EDGE = false;

    constructor() {}

    setup() {
        this.boids = this.loadBoids();
        
        if(this.boids.length > 0) {
            this.nBoids = this.boids.length;
        }
        else{
            this.nBoids = 200;
            this.boids = this.clusterStart();
        }

        this.aabb = new AABB(createVector(0, 0), width, height);
        this.qt = new Quadtree(this.aabb, this.getQtCapacity(this.nBoids));
        
        // // random start
        // for(let i = 0; i < this.nBoids; i++)
        //     this.boids.push(new Boid());

        // interval start
        // let i = 0;
        // let intervalId = setInterval(() => {
        //     this.boids.push(new Boid());
        //     if(++i == this.nBoids) {
        //         window.clearInterval(intervalId);
        //         console.log('done')
        //     }
        // }, 100);

        // cluster start
        // this.boids = this.clusterStart();

        Quadtree.QT_DRAW = {
            'structureStroke': theme.a,
            'structureStrokeWeight': 1,
            'structureFill': color(0, 0),
            'showObjs': false,
            'objStroke': color('white'),
            'objStrokeWeight': 2,
            'objFill': color(0, 0),
            'mask': new AABB(createVector(-10, -10), width + 20, height + 20)
        }

        this.updateTheme();
        this.lastSave = frameCount;
    }

    clusterStart() {
        let nClusters = 3;
        let sizeFactor = 2;

        // let clusters = [
        //     {
        //         'minX': 0, 'maxX': this.nBoids / nClusters * sizeFactor,
        //         'minY': 100, 'maxY': 100 + this.nBoids / nClusters * sizeFactor,
        //         'avgVelocity': createVector(1, 0),
        //         'color': color('red')
        //     }, {
        //         'minX': 50, 'maxX': 50 + this.nBoids / nClusters * sizeFactor,
        //         'minY': 400, 'maxY': 400 + this.nBoids / nClusters * sizeFactor,
        //         'avgVelocity': createVector(-1, 1),
        //         'color': color('green')
        //     }, {
        //         'minX': -300, 'maxX': -300 + this.nBoids / nClusters * sizeFactor,
        //         'minY': height / 2, 'maxY': height / 2 + this.nBoids / nClusters * sizeFactor,
        //         'avgVelocity': createVector(2, 0),
        //         'color': color('blue')
        //     }
        // ];

        // Corners
        let clusters = [
            {
                'minX': width + 100, 'maxX': width + 100 ,//+ this.nBoids / nClusters * sizeFactor,
                'minY': -100, 'maxY': -100 + this.nBoids / nClusters * sizeFactor,
                'avgVelocity': createVector(1, 0).rotate(PI + Math.atan(width / height)),
                'color': color('red')
            }, 
            {
                'minX': width + 100, 'maxX': width + 100 ,//+ this.nBoids / nClusters * sizeFactor,
                'minY': height + 100, 'maxY': height + 100 + this.nBoids / nClusters * sizeFactor,
                'avgVelocity': createVector(1, 0).rotate(PI + Math.atan(height / width)),
                'color': color('green')
            }, 

            //     'minX': 50, 'maxX': 50 + this.nBoids / nClusters * sizeFactor,
            //     'minY': 400, 'maxY': 400 + this.nBoids / nClusters * sizeFactor,
            //     'avgVelocity': createVector(-1, 1),
            //     'color': color('green')
            // }, {
            //     'minX': -300, 'maxX': -300 + this.nBoids / nClusters * sizeFactor,
            //     'minY': height / 2, 'maxY': height / 2 + this.nBoids / nClusters * sizeFactor,
            //     'avgVelocity': createVector(2, 0),
            //     'color': color('blue')
            // }
        ];
        // Boid.AVOID_EDGES = false;
        let boids = [];

        for(let i = 0; i < this.nBoids; i++) {
            let cluster = clusters[floor(random(clusters.length))];
            
            let position = createVector(
                random(cluster.minX, cluster.maxX),
                random(cluster.minY, cluster.maxY))

            let velocity = cluster.avgVelocity.copy()
                .rotate(random(-PI / 5, PI / 5))
                .mult(random(10))
                
            boids.push(new Boid({
                position: position,
                velocity: velocity
            }));

            // boids[i].fillColor = cluster.color;
            // boids[i].strokeColor = cluster.color;
        }

        return boids;
    }

    draw() {
        background(theme.bg);

        this.qt.reset(this.getQtCapacity(this.boids.length));
        for(let boid of this.boids)
            this.qt.insert(boid);

        for(let boid of this.boids) {
            let neighborhood = new Circle(boid.position, Boid.PERCEPTION_RANGE);
            let neighbors = this.qt.queryCircle(neighborhood);

            boid.update(neighbors);
            boid.draw();
        }

        if(Boids.SHOW_QUADTREE)
            this.qt.draw();

        if(Boids.SHOW_EDGE) {
            push();
                drawingContext.setLineDash([7, 4, 3]);
                noFill();
                stroke(120, 180);
                rect(Boid.EDGE_MARGIN, Boid.EDGE_MARGIN, width - 2 * Boid.EDGE_MARGIN, height - 2 * Boid.EDGE_MARGIN);
                drawingContext.setLineDash([]);
            pop();
        }
        
        this.saveState();
    }

    getQtCapacity(n) {
        return n < 200 ? 3 : Math.floor(25 / (1 + (25 * Math.pow(Math.E, -.009 * n))));
    }

    saveState() {
        if(frameCount < this.lastSave + 10) {
            return;
        }

        let boids = Array.from(this.boids, boid => boid.exportBoid());
        window.localStorage.setItem('sketch-boids', JSON.stringify(boids));

        this.lastSave = frameCount;
    }

    loadBoids() {
        let rawBoids = JSON.parse(window.localStorage.getItem('sketch-boids'));

        if(rawBoids) return Array.from(rawBoids, raw => Boid.loadBoid(raw));
        else return [];
    }

    windowResized() {
        this.aabb = new AABB(createVector(0, 0), width, height);
        this.qt = new Quadtree(this.aabb, this.getQtCapacity(this.nBoids));

        Quadtree.QT_DRAW.mask = new AABB(createVector(-10, -10), width + 20, height + 20);
    }

    mouseWheel(e) {
        if(e.deltaY > 0) this.boids.push(new Boid());
    }

    mouseClicked(e) {
        let region = new Circle(createVector(mouseX, mouseY), 20);
        
        for(let boid of this.boids) {
            if(region.contains(boid)) boid.showDebugLines = true;    
            else boid.showDebugLines = false;
        }
    }

    updateTheme() {
        if(theme.name == 'light') {
            Boid.FILL = color('black');
            Boid.STROKE = color('white');
        } else {
            Boid.FILL = color('white');
            Boid.STROKE = theme.a;
        }
    }

    getSettings() {
        // Simulation parameters
        let separationCoefficient = createSlider(0, 0.01, Boid.SEPARATION_COEF, .0001);
        separationCoefficient.input(() => Boid.SEPARATION_COEF = separationCoefficient.value());

        let alignmentCoefficient = createSlider(0, 0.5, Boid.ALIGNMENT_COEF, .0001);
        alignmentCoefficient.input(() => Boid.ALIGNMENT_COEF = alignmentCoefficient.value());

        let cohesionCoefficient = createSlider(0, 0.01, Boid.COHESION_COEF, .0001);
        cohesionCoefficient.input(() => Boid.COHESION_COEF = cohesionCoefficient.value());

        let boidSize = createSlider(1, 40, Boid.SIZE_MULTIPLIER, 1);
        boidSize.input(() => Boid.SIZE_MULTIPLIER = boidSize.value());

        let percepitionRange = createSlider(0, 200, Boid.PERCEPTION_RANGE, 1);
        percepitionRange.input(() => Boid.PERCEPTION_RANGE = percepitionRange.value());

        let minSpeed = createSlider(0, 10, Boid.MIN_SPEED, 0.1);
        minSpeed.input(() => Boid.MIN_SPEED = minSpeed.value());

        let maxSpeed = createSlider(0, 10, Boid.MAX_SPEED, 0.1);
        maxSpeed.input(() => Boid.MAX_SPEED = maxSpeed.value());

        let edgeSpeed = createSlider(0, 3, Boid.EDGE_SPEED, 0.01);
        edgeSpeed.input(() => Boid.EDGE_SPEED = edgeSpeed.value());

        let edgeMargin = createSlider(-200, 500, Boid.EDGE_MARGIN, 1);
        edgeMargin.input(() => Boid.EDGE_MARGIN = edgeMargin.value());

        let boids = createSlider(0, 1500, Boids.nBoids, 1);
        boids.input(() => {
            if(boids.value() < this.nBoids)
                this.boids.splice(0, this.nBoids - boids.value());
            else if(boids.value() > this.nBoids)
                for(let i = this.nBoids; i < boids.value(); i++) 
                    this.boids.push(new Boid());

            this.nBoids = this.boids.length;
        });

        // Draw
        let showQuadtree = createCheckbox('', false);
        showQuadtree.changed(() => Boids.SHOW_QUADTREE = showQuadtree.checked());

        let boidDebugLines = createCheckbox('', Boid.DEBUG_LINES);
        boidDebugLines.changed(() => Boid.DEBUG_LINES = boidDebugLines.checked());

        let showEdge = createCheckbox('', Boids.SHOW_EDGE);
        showEdge.changed(() => Boids.SHOW_EDGE = showEdge.checked());

        return {
            'Separation': separationCoefficient,
            'Alignment': alignmentCoefficient,
            'Cohesion': cohesionCoefficient,
            'Perception Range': percepitionRange,
            'Boid Size': boidSize,
            'Min Speed': minSpeed,
            'Max Speed': maxSpeed,
            'Edge Speed': edgeSpeed,
            'Edge Margin': edgeMargin,
            '# Boids': boids,
            'Show Boid Debug': boidDebugLines,
            'Show Edge': showEdge,
            'Show Quadtree': showQuadtree
        }
    }
}

class VizQuadtree {
    constructor() {}

    setup() {
        this.aabb = new AABB(createVector(0, 0), width, height);
        this.qt = new Quadtree(this.aabb, 3);
        this.region = new Circle(createVector(1, 100), 200);
        this.objs = [];

        this.clusters = [
            {
                'minX': width/5, 'maxX': width/2,
                'minY': 100, 'maxY': height/3,
            },
            {
                'minX': 3/4*width, 'maxX': width,
                'minY': height/5, 'maxY': 1/2*height,
            },
            {
                'minX': (width-100)/2, 'maxX': (width+100)/2,
                'minY': 3/4*height, 'maxY': height,
            },
            {
                'minX': (width-150)/2, 'maxX': (width+150)/2,
                'minY': (height-150)/2, 'maxY': (height+150)/2,
            },
        ]

        for(let i = 0; i < 1500; i++) {
            this.objs[i] = {
                'position': createVector(0, 0),
                'noiseOffset': random(100000),
                'cluster': floor(random(this.clusters.length))
            }
        }

        this.updateTheme();
    }

    draw() {
        background(theme.bg);

        this.qt.reset();
        this.region.position = createVector(mouseX, mouseY);

        for(let obj of this.objs) {
            // obj.position.x = width * noise(.001 * frameCount + obj.noiseOffset);
            // obj.position.y = height * noise(.001 * frameCount + obj.noiseOffset + 3104134);

            let noiseX = noise(.002 * frameCount + obj.noiseOffset);
            let noiseY = noise(.002 * frameCount + obj.noiseOffset + 3104134);

            let cluster = this.clusters[obj.cluster];

            obj.position = createVector(
                map(noiseX, 0, 1, cluster.minX - 65, cluster.maxX + 65),
                map(noiseY, 0, 1, cluster.minY - 65, cluster.maxY + 65)
            );
            
            this.qt.insert(obj);
        }

        this.qt.draw();
        this.region.draw();
    }

    updateTheme() {
        if(theme.name == 'light') {
            Quadtree.QT_DRAW = {
                'structureStroke': theme.a,
                'structureStrokeWeight': 1,
                'structureFill': color(0, 0),
                'showObjs': true,
                'objStroke': color('black'),
                'objStrokeWeight': 2,
                'objFill': color(0, 0),
                'mask': this.region
            }
        } else {
            Quadtree.QT_DRAW = {
                'structureStroke': theme.a,
                'structureStrokeWeight': 1,
                'structureFill': color(0, 0),
                'showObjs': true,
                'objStroke': color('white'),
                'objStrokeWeight': 2,
                'objFill': color(0, 0),
                'mask': this.region
            }
        }
    }
    
    mouseClicked(e) {}

    mouseWheel(e) {
        e.preventDefault();
        this.region.r += e.deltaY / 10;
    }

    getSettings() {}
}