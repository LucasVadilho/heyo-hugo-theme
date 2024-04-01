const pointToLineSegment = (p, a, b) => {
    let ab = b.copy().sub(a);
    let ap = p.copy().sub(a);

    let projectedLength = ap.dot(ab);
    let distanceInAB = projectedLength / ab.magSq();

    if(distanceInAB < 0) return [a, p.dist(a)];

    if(distanceInAB > 1) return [b, p.dist(b)];

    let closestPoint = a.copy().add(ab.mult(distanceInAB));
    let distance = p.dist(closestPoint);

    return [closestPoint, distance];
}

class Test {
    constructor() {
        
    }

    setup() {
        this.p = createVector(random(width), random(height));
        this.a = createVector(random(width), random(height));
        this.b = createVector(random(width), random(height));
    }

    draw() {
        if(frameCount % (60 * 10) == 0) {
            this.p = createVector(random(width), random(height));
            this.a = createVector(random(width), random(height));
            this.b = createVector(random(width), random(height));
        }

        this.p = createVector(mouseX, mouseY);

        background(theme.bg);
        stroke(theme.a);

        strokeWeight(5);
        point(this.p.x, this.p.y);

        strokeWeight(1);
        line(this.a.x, this.a.y, this.b.x, this.b.y);

        let [closestPoint, distance] = pointToLineSegment(this.p, this.a, this.b);
        line(this.p.x, this.p.y, closestPoint.x, closestPoint.y);

        noStroke();
        fill('white');
        text(distance, 100, 100);
        text('P', this.p.x, this.p.y);
        text('A', this.a.x, this.a.y);
        text('B', this.b.x, this.b.y);
    }

    updateTheme() {}
    
    mouseClicked(e) {
    }

    mouseWheel(e) {
    }

    getSettings() {}
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
        if(this.contains(circle)) {
            // push();
            //     stroke('green');
            //     strokeWeight(5);
            //     point(this.center.x, this.center.y);
            // pop();
            return true;
        }

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

        // push();
        //     stroke('green');
        //     strokeWeight(1);
            
        //     line(circle.position.x, circle.position.y, closestTop.x, closestTop.y);
        //     line(circle.position.x, circle.position.y, closestLeft.x, closestLeft.y);
        //     line(circle.position.x, circle.position.y, closestBottom.x, closestBottom.y);
        //     line(circle.position.x, circle.position.y, closestRight.x, closestRight.y);

        //     strokeWeight(10);
        //     point(closestTop.x, closestTop.y);
        //     point(closestLeft.x, closestLeft.y);
        //     point(closestBottom.x, closestBottom.y);
        //     point(closestRight.x, closestRight.y);
        // pop();

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

class QuadTree {
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

        this.topLeft = new QuadTree(new AABB(createVector(x, y), newWidth, newHeight), this.capacity);
        this.bottomLeft = new QuadTree(new AABB(createVector(x, y + newHeight), newWidth, newHeight), this.capacity);
        this.topRight = new QuadTree(new AABB(createVector(x + newWidth, y), newWidth, newHeight), this.capacity);
        this.bottomRight = new QuadTree(new AABB(createVector(x + newWidth, y + newHeight), newWidth, newHeight), this.capacity);

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
        let {x, y, width, height} = this.aabb.getAABB();

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

    adraw(circle) {
        let {x, y, width, height} = this.aabb.getAABB();
        // text(`${this.aabb.center.x}, ${this.aabb.center.y}`, this.aabb.center.x, this.aabb.center.y)

        if(this.aabb.intersectsCircle(circle)) {
            // push();
            // stroke(255);
            // strokeWeight(5);
            // point(this.aabb.center.x, this.aabb.center.y);
            // pop();

            stroke(theme.a);
            rect(x, y, width, height);
        } else { 
            // stroke(theme.a._getRed(), theme.a._getGreen(), theme.a._getBlue(), 50);
            // rect(x, y, width, height);
        }

        noFill();
        // fill(33, 255);


        // push();
        //     strokeWeight(5);
        //     point(x, y);
        //     point(x, y + height);
        //     point(x + width, y);
        //     point(x + width, y + height);
        // pop();

        for(let obj of this.objs) {
            push();
            strokeWeight(5);
            if(circle.contains(obj)){
                stroke(theme.a);
            } else {
                stroke(255);
            }
            point(obj.position.x, obj.position.y);
            pop();
        }

        if(this.subdivided) {
            this.topLeft.adraw(circle);
            this.topRight.adraw(circle);
            this.bottomLeft.adraw(circle);
            this.bottomRight.adraw(circle);
        }
    }

    reset() {
        this.objs = [];
        this.subdivided = false;

        this.topLeft = undefined;
        this.topRight = undefined;
        this.bottomLeft = undefined;
        this.bottomRight = undefined;
    }

    traverse() {
        console.log(this.objs);

        if(this.subdivided) {
            console.log('Top right');
            this.topRight.traverse();
           
            console.log('Top left');
            this.topLeft.traverse();
           
            console.log('Bottom right');
            this.bottomRight.traverse();
           
            console.log('Bottom Left');
            this.bottomLeft.traverse();
        }
    }
}

var aabb;
var qt;
var objs = [];

let region;
let QT_DRAW;

class Boid {
    static SIZE_MULTIPLIER = 30;

    constructor(position, velocity, acceleration, range) {
        this.position = position || createVector(random(width), random(height));
        this.velocity = velocity || createVector(random(5), random(5));
        this.acceleration = acceleration || createVector(5, -3);

        this.range = range || 100;
    }

    separation() {

    }

    alignment() {

    }

    cohesion () {

    }

    flee() {

    }

    update(neighborhood) {
        this.acceleration = createVector(width/2, height/2).sub(this.position);
        
        // push();
        // strokeWeight(5);
        // stroke('red');
        // point(this.acceleration.x, this.acceleration.y);
        // console.log(this.acceleration);
        // pop();
        // let a = this.position.copy().sub(this.acceleration);
        // line(this.position.x, this.position.y, a.x, a.y);
        // noLoop();

        // line(this.position.x, this.position.y, this.acceleration.x, this.acceleration.y);
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration.normalize());
        // console.log(this.velocity.x, this.velocity.y);

        this.checkBounds();
    }

    checkBounds() {
        if(this.position.x > width) this.position.x = 0;
        if(this.position.x < 0) this.position.x = width;
        if(this.position.y > height) this.position.y = 0;
        if(this.position.y < 0) this.position.y = height;
    }

    getTrianglePoints() {
        let normalizedVelocity = this.velocity.copy().normalize();

        let tip = this.position.copy().add(normalizedVelocity.copy().mult(Boid.SIZE_MULTIPLIER));

        // https://mackiemathew.wordpress.com/2014/03/01/finding-a-normal-perpendicular-vector-on-a-2d-plane/
        // (u, v) -> (-v, u) and (v, -u)
        let up = this.position.copy().add(createVector(-normalizedVelocity.y, normalizedVelocity.x).mult(Boid.SIZE_MULTIPLIER / 2));
        let down = this.position.copy().add(createVector(normalizedVelocity.y, -normalizedVelocity.x).mult(Boid.SIZE_MULTIPLIER / 2));
        
        return [tip, up, down];
    }

    draw(debug = true) {
        push();
            stroke(theme.a);
            fill(255);

            if(debug) {

            }
            let [tip, left, right] = this.getTrianglePoints();

            triangle(tip.x, tip.y, left.x, left.y, right.x, right.y);
        pop();
    }
}

class Boids {
    constructor() {
        this.boids = [];
    }

    setup() {
        for(let i = 0; i < 1; i++) {
            this.boids.push(new Boid());
        }
    }

    draw() {
        background(theme.bg);
        stroke(theme.a);
        fill('white');

        strokeWeight(1);

        for(let boid of this.boids) {
            boid.update();
            boid.draw();
        }

        // // let rect = sketch.container.getBoundingClientRect();
        // let velocity = createVector(mouseX, mouseY);
        // let position = createVector(width / 2, height / 2);
        
        // line(position.x, position.y, position.x + velocity.x, position.y + velocity.y);

        // strokeWeight(5);
        // point(position.x, -position.y);

        // let normalizedVelocity = velocity.normalize();

        // let tip = position.copy().add(normalizedVelocity.copy().mult(Boid.SIZE_MULTIPLIER));

        // // https://mackiemathew.wordpress.com/2014/03/01/finding-a-normal-perpendicular-vector-on-a-2d-plane/
        // // (u, v) -> (-v, u) and (v, -u)
        // let up = position.copy().add(createVector(-normalizedVelocity.y, normalizedVelocity.x).mult(Boid.SIZE_MULTIPLIER / 2));
        // let down = position.copy().add(createVector(normalizedVelocity.y, -normalizedVelocity.x).mult(Boid.SIZE_MULTIPLIER / 2));

        // // console.log(normalizedVelocity);
        // // console.log(createVector(-normalizedVelocity.y, normalizedVelocity.x), createVector(-normalizedVelocity.y, normalizedVelocity.x).normalize());
    
        // // point(tip.x, tip.y);
        // // point(up.x, up.y);
        // // point(down.x, down.y);

        // triangle(tip.x, tip.y, up.x, up.y, down.x, down.y);

        // // console.log('point:', position)
        // // console.log('tip:', tip);
        // // console.log('up:', up);
        // // console.log('down:', down);
        
        // // triangle(0, 0, 0, height, width, height);
        // // for(let boid of this.boids) {
        // //     boid.draw();
        // // }
    }

    getSettings() {}
}

class VizQuadtree {
    constructor() {
        aabb = new AABB(createVector(0, 0), width, height);
        qt = new QuadTree(aabb, 5);
        // region = new AABB(createVector(random(width), random(height)), random(width), random(height));
        region = new Circle(createVector(1, 100), 200);

        for(let i = 0; i < 1000; i++) {
            objs[i] = {
                'position': createVector(0, 0),
                'noiseOffset': random(100000)
            }
        }

        // for(let obj of objs) {
        //     obj.x = width * noise(.001 * frameCount + obj.noiseOffset);
        //     obj.y = height * noise(.001 * frameCount + obj.noiseOffset + 3104134);
        // }

        stroke(255);
    }

    setup() {
        QT_DRAW = {
            'structureStroke': theme.a,
            'structureStrokeWeight': 1,
            'structureFill': color(0, 0),
            'showObjs': true,
            'objStroke': color('white'),
            'objStrokeWeight': 2,
            'objFill': color(0, 0),
            'mask': region
        }

        // for(let i = 0; i < 10; i++) {
        //     objs[i] = new Boid(
        //         createVector(100 + 10 * i, 100),
        //         createVector(0, 0),
        //         createVector(0, 0),
        //         200
        //     );
        // }
    }

    draw() {
        qt.reset();
        region.position = createVector(mouseX, mouseY);

        background(theme.bg);

        // console.log('in region:', qt.queryCircle(region));

        // for(let boid of objs) {
        //     let neighborhood = new Circle(boid.position, boid.range);
        //     let neighbors = qt.queryCircle(neighborhood);

        //     boid.update(neighbors);
        //     boid.draw();
        // }
    
        for(let obj of objs) {
            obj.position.x = width * noise(.001 * frameCount + obj.noiseOffset);
            obj.position.y = height * noise(.001 * frameCount + obj.noiseOffset + 3104134);

            qt.insert(obj);
        }

        // qt.adraw(region);
        qt.draw();
        region.draw();

        // if(frameCount > 1) noLoop();
    }

    // draw() {
    //     background(theme.bg);

    //     qt.reset(); //= new QuadTree(aabb, 1);

    //     region.position = createVector(mouseX, mouseY);


    //     for(let obj of objs) {
    //         obj.x = width * noise(.001 * frameCount + obj.noiseOffset);
    //         obj.y = height * noise(.001 * frameCount + obj.noiseOffset + 3104134);

    //         // push();
    //         // strokeWeight(5);
    //         // let a = region.contains(obj);
    //         // // console.log(obj, a);
    //         // if(a) {
    //         //     stroke('blue');
    //         // } else {
    //         //     stroke('red');
    //         // }

    //         // circle(obj.x, obj.y, 5);
    //         // pop();

    //         qt.insert(obj);
    //     }

    //     qt.draw();
    //     // region.draw();

    //     // let ey = qt.queryAABB(region);
    //     // let ey = qt.queryCircle(region);
    //     // console.log(ey);
    //     // for(let obj of ey) {
    //     //     push();
    //     //     strokeWeight(5);
    //     //     stroke('blue');
    //     //     point(obj.x, obj.y);
    //     //     pop();
    //     // }
    // }

    updateTheme() {}
    
    mouseClicked(e) {
        // let rect = sketch.container.getBoundingClientRect();

        // let inX = e.clientX > rect.left && e.clientX < rect.right;
        // let inY = e.clientY > rect.top && e.clientY < rect.bottom;

        // let obj = createVector(e.clientX - rect.left, e.clientY - rect.top);
        // objs.push(obj);
        // if(inX && inY) qt.insert(obj);
    }

    mouseWheel(e) {
        e.preventDefault();
        region.r += e.deltaY / 10;
    }

    getSettings() {}
}