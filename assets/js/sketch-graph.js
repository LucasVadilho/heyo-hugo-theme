class Node {
    constructor({x, y, xoff, yoff}={}) {
        this.x = x;
        this.y = y;
        this.xoff = xoff;
        this.yoff = yoff;
    }
}

class Graph {
    constructor() {}

    setup() {
        this.nNodes = random(10, 25);
        this.nodes = [];
        this.rSq = 5000;
        this.sf = 1;
       
        this.t = 0;
        this.toff = 0.001;
    
        this.n_distinct = Math.floor(Math.pow(2, 12 - Math.log2(this.toff)));
    
        for (let i = 0; i < this.nNodes; i++) {
            let node = new Node({
                xoff: this.n_distinct * random(),
                yoff: this.n_distinct * random()
            });

            this.nodes.push(node);
        }
        
        strokeWeight(1);
        colorMode(RGB);
        updateTheme();
    }

    draw() {
        background(theme.bg);

        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            
            node.x = width * noise(this.sf * this.t + node.xoff);
            node.y = height * noise(this.sf * this.t + node.yoff);

            for (let j = i + 1; j < this.nodes.length; j++) {
                let dSq = (node.x - this.nodes[j].x) ** 2 + (node.y - this.nodes[j].y) ** 2;
            
                if (dSq < this.rSq) this.drawEdge(node, this.nodes[j], dSq);
            }
            
            this.drawNode(node);
        }
        
        this.t = this.t + this.toff;
    }

    updateTheme() {}
    
    mouseClicked(e) {}

    mouseWheel(e) {
        if (e.delta > 0 && this.nodes.length < 100){;
            let node = new Node({
                xoff: this.n_distinct * random(),
                yoff: this.n_distinct * random()
            });

            this.nodes.push(node);
        } else {
            this.nodes.pop();
        }
    }
    
    drawNode(node) {
        stroke(theme.body);
        fill(theme.body);
        circle(node.x, node.y, 2);
    }
    
    drawEdge(p, q, dSq) {
        let c = theme.a;
        c.setAlpha(255 * (1 - dSq / this.rSq));

        stroke(c);
        line(p.x, p.y, q.x, q.y);
    }

    getSettings() {
        
    }
}