import { Vector } from './vector.js';
import { Sphere } from './objects.js';

// DISPLAY PARAMETERS
let canvasWidth = 512;
let canvasHeight = 512;

// OBJECTS AND LIGHTING TO BE RENDERED
let scene = {
    objects: [ 
        new Sphere(-0.8, 0, -1, 1, 201, 26, 70),
        new Sphere(0.8, 0, 0, 1, 85, 199, 50),
        new Sphere(0, -0.5, 1, 0.5, 68, 73, 201),
        new Sphere(0, -995.9, -100, 1000, 255, 255, 255)
    ],
    lights: [ 
        new Vector(50, 100, 50),
    ]
}

// Initial setup
const canvas = document.getElementById("display");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
let context = canvas.getContext('2d');
let data = context.getImageData(0, 0, canvasWidth, canvasHeight);

function render() {
    for(let y = 0; y < canvasHeight; y++) {
        for(let x = 0; x < canvasWidth; x++) {
            let dir = new Vector(x - canvasWidth / 2, canvasHeight / 2 - y, -canvasHeight).unit();
            let val = trace(new Vector(0, 0, 5), dir);
            drawPixel(x, y, val.x, val.y, val.z);  
        }
    }

    context.putImageData(data, 0, 0);
}

function drawPixel(x, y, r, g, b){
    // ImageData.data is an array where every 4 elements represents RGBA of a single pixel
    let index = x * 4 + y * canvasWidth * 4
    data.data[index + 0] = r;
    data.data[index + 1] = g;
    data.data[index + 2] = b;
    data.data[index + 3] = 255;
}

function trace(origin, direction) {
    let index = -1;
    let distance = NaN;

    // Loop through all objects to find the nearest non-NaN intersection (i.e. object)
    for(let i = 0; i < scene.objects.length; i++) {
        let d = scene.objects[i].intersection(origin, direction);

        if(!isNaN(d) && (index < 0 || d < distance)) {
            distance = d;
            index = i;
        }
    }

    // If there are no intersections, then render the background
    if(index < 0){
        return new Vector(255, 255, 255);
    }

    // Calculate any shadows

    // P is a coordinate representing the surface of a sphere
    let p = origin.add(direction.scalar(distance));
    let norm = (p.subtract(scene.objects[index].centre)).unit();

    let c = scene.objects[index].colour.scalar(0.1);

    for(let i = 0; i < scene.lights.length; i++) {
        let light = scene.lights[i];
        let dir = (light.subtract(p)).unit();

        let shadow = false;

        scene.objects.forEach((obj) => {
            if(!isNaN(obj.intersection(p, dir))){
                shadow = true;
            }
        });

        if(!shadow){
            let diff = Math.max(0, (dir.dotProduct(norm)) * 0.8);
            let spec = Math.pow(Math.max(0, dir.dotProduct(norm)), 70) * 0.4;

            c = c.add(scene.objects[index].colour.scalar(diff).add(new Vector(spec, spec, spec)));
        }
    }

    return c;
}

render();