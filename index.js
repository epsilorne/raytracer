import { Vector } from './vector.js';
import { Sphere } from './objects.js';

/* DISPLAY & RENDERING PARAMETERS */
let CANVAS_WIDTH = 512;
let CANVAS_HEIGHT = 512;

let MAX_REFLECTION_ITERATIONS = 3;
let REFLECTION_INTENSITY = 0.4;

/* OBJECTS AND LIGHTING TO BE RENDERED */
let scene = {
    objects: [ 
        // x, y, z, radius, r, g, b, shiny

        new Sphere(0.6, -1, 2, 0.25, 201, 26, 70, false), // red
        new Sphere(-0.8, 1, -1, 2, 255, 255, 255, true), // mirror
        new Sphere(1.5, 0, 1, 1, 85, 199, 50, false), // green
        new Sphere(-1, -0.5, 2, 0.5, 68, 73, 201, false), // blue
        new Sphere(0, -996, -100, 1000, 255, 255, 255, false) // ground
    ],
    lights: [ 
        new Vector(0, 50, 50),
    ]
}

/* INITIAL SETUP */
const canvas = document.getElementById("display");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let context = canvas.getContext('2d');
let data = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

/**
 * Renders each pixel on the canvas using our ray-tracing algorithm.
 */
function render() {
    for(let y = 0; y < CANVAS_HEIGHT; y++) {
        for(let x = 0; x < CANVAS_WIDTH; x++) {
            let dir = new Vector(x - CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - y, -CANVAS_HEIGHT).unit();
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
    let index = x * 4 + y * CANVAS_WIDTH * 4
    data.data[index + 0] = r;
    data.data[index + 1] = g;
    data.data[index + 2] = b;
    data.data[index + 3] = 255;
}

/**
 * Casts a ray from the camera for the purposes of ray tracing.
 * @param {Vector} origin The origin of the ray.
 * @param {Vector} direction The direction of the ray (a unit vector).
 * @param {Number} depth The depth for recursion purposes.
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

    /* CALCULATE REFLECTIONS AND SHADOWS */

    // P is a coordinate representing the surface of a sphere
    let p = origin.add(direction.scalar(distance));
    let norm = (p.subtract(scene.objects[index].centre)).unit();

    let colour = scene.objects[index].colour.scalar(0.1);

    for(let i = 0; i < scene.lights.length; i++) {
        let light = scene.lights[i];
        // This direction is from the contact-point to the light
        let dir = (light.subtract(p)).unit();
        let shadow = false;

        // Generate cast shadows for each object
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
            colour = colour.add(scene.objects[index].colour.scalar(diff).add(new Vector(spec, spec, spec)));
        }

        if(depth < MAX_REFLECTION_ITERATIONS){
            // For shiny objects, we recursively trace with a reflected ray
            if(scene.objects[index].shiny){;
                /* Uses the formula: r = -2 (d.n)n + d
                where d = original direciton vector, n = normal vector */
                let reflectDir = norm.scalar(-2 * direction.dotProduct(norm)).add(direction);
                colour = colour.add(trace(p, reflectDir, depth + 1).scalar(REFLECTION_INTENSITY));
            }
        }
    }

    return colour;
}

render();
