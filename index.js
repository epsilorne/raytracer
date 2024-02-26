import { Vector } from './vector.js';
import { Sphere } from './objects.js';

/* DISPLAY PARAMETERS */
let canvasWidth = 512;
let canvasHeight = 512;

/* OBJECTS AND LIGHTING TO BE RENDERED */
let scene = {
    objects: [ 
        // x, y, z, radius, r, g, b, shiny
        // new Sphere(-0.8, 0, -1, 1, 201, 26, 70, false), // red
        new Sphere(-0.8, 1, -1, 1, 255, 255, 255, true), // mirror
        new Sphere(1.2, 0, 0, 1, 85, 199, 50, true), // green
        new Sphere(-1, -0.5, 2, 0.5, 68, 73, 201, false), // blue
        new Sphere(0, -995.9, -100, 1000, 255, 255, 255, false) // ground
    ],
    lights: [ 
        new Vector(50, 100, 50),
    ]
}

/* INITIAL SETUP */
const canvas = document.getElementById("display");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
let context = canvas.getContext('2d');
let data = context.getImageData(0, 0, canvasWidth, canvasHeight);

/**
 * Renders each pixel on the canvas using our ray-tracing algorithm.
 */
function render() {
    for(let y = 0; y < canvasHeight; y++) {
        for(let x = 0; x < canvasWidth; x++) {
            let dir = new Vector(x - canvasWidth / 2, canvasHeight / 2 - y, -canvasHeight).unit();
            let val = trace(new Vector(0, 0, 5), dir, 0);
            drawPixel(x, y, val.x, val.y, val.z);  
        }
    }

    context.putImageData(data, 0, 0);
}

/**
 * Helper function to draw an individual pixel by manipulating ImageData.data.
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 * @param {Number} r red
 * @param {Number} g green
 * @param {Number} b blue
 */
function drawPixel(x, y, r, g, b){
    // ImageData.data is an array where every 4 elements represents RGBA of a single pixel
    let index = x * 4 + y * canvasWidth * 4
    data.data[index + 0] = r;
    data.data[index + 1] = g;
    data.data[index + 2] = b;
    data.data[index + 3] = 255;
}

/**
 * Casts a ray from the camera for the purposes of ray tracing.
 * @param {Vector} origin The origin of the ray.
 * @param {Vector} direction The direction of the ray (a unit vector).
 * @returns The colour of where the ray has landed, otherwise the background colour.
 */
function trace(origin, direction, depth) {
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
        // sky blue
        return new Vector(158, 211, 222);
        // white
        // return new Vector(255, 255, 255);
    }

    // Calculate any shadows

    // P is a coordinate representing the surface of a sphere
    let p = origin.add(direction.scalar(distance));
    let norm = (p.subtract(scene.objects[index].centre)).unit();

    let c = scene.objects[index].colour.scalar(0.1);

    for(let i = 0; i < scene.lights.length; i++) {
        let light = scene.lights[i];
        // This direction is from the contact-point to the light
        let dir = (light.subtract(p)).unit();
        let shadow = false;

        scene.objects.forEach((obj) => {
            /* If there is some kind of intersection between the point and the light,
            cast a shadow. */
            if(!isNaN(obj.intersection(p, dir))){
                shadow = true;
            }
        });

        if(!shadow){
            let diff = Math.max(0, (dir.dotProduct(norm)) * 0.8);
            let spec = Math.pow(Math.max(0, dir.dotProduct(norm)), 70) * 0.4;

            c = c.add(scene.objects[index].colour.scalar(diff).add(new Vector(spec, spec, spec)));
        }

        if(depth < 3){
            // For shiny objects, we recursively trace with a reflected ray
            if(scene.objects[index].shiny){;
                // Uses the formula: r = -2 (p.n)n + p
                // TODO: making -2 positive kinda fixes refleciton but also doesnt
                let reflectDir = norm.scalar(-2 * p.dotProduct(norm)).add(p);

                // p.subtract(norm.scalar(p.dotProduct(norm) * 2))
                
                // norm.scalar(p.dotProduct(norm) * -2).add(p);
                
                // console.log(`At depth: ${depth}, \n
                // Original: (${p.x}, ${p.y}, ${p.z})\n
                // Reflected: (${reflectDir.x}, ${reflectDir.y}, ${reflectDir.z})\n
                // Normal: (${norm.x}, ${norm.y}, ${norm.z})
                // `)

                c = c.add(trace(p, reflectDir, depth + 1).scalar(0.2));
            }
        }
       
    }

    return c;
}

render();