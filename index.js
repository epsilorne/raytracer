import { Vector } from './Vector.js';
import { Sphere } from './Objects.js';

/* DISPLAY & RENDERING PARAMETERS */
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

const BACKGROUND_COLOUR = new Vector(158, 211, 222);

const MAX_REFLECTION_ITERATIONS = 3;
const REFLECTION_INTENSITY = 0.55;
const DIFFUSE = 1.0;
const SPECULAR = 0.6;

/* CAMERA POSITIONING */
let CAMERA_ROTATION = -0;
let CAMERA_PIVOT = new Vector(0, 0, 0);

/* OBJECTS AND LIGHTING TO BE RENDERED */
let scene = {
    camera: new Vector(0, 0, 5),
    objects: [ 
        // x, y, z, radius, r, g, b, shiny

        new Sphere(0.6, -1, 2, 0.25, 201, 26, 70, false), // red
        new Sphere(-0.8, 1, -1, 2, 255, 255, 255, true), // mirror
        new Sphere(1.5, 0, 1, 1, 85, 199, 50, false), // green
        new Sphere(-1, -0.5, 2, 0.5, 68, 73, 201, false), // blue
        new Sphere(0, -996, -100, 1000, 255, 255, 255, false) // ground
    ],
    lights: [ 
        new Vector(100, 100, 200),
    ]
}

/* INITIAL SETUP */
const canvas = document.getElementById("display");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let context = canvas.getContext('2d');
let data = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

const rotSlider = document.getElementById("rotSlider");
rotSlider.oninput = function() {
    CAMERA_ROTATION = -rotSlider.value;
    render();
}

/**
 * Renders each pixel on the canvas using our ray-tracing algorithm.
 */
function render() {
    for(let y = 0; y < CANVAS_HEIGHT; y++) {
        for(let x = 0; x < CANVAS_WIDTH; x++) {
            let dir = new Vector(x - CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - y, -CANVAS_HEIGHT);

            // Rotate the camera by applying a rotation matrix
            let pos = scene.camera.rotatePivot(CAMERA_ROTATION, CAMERA_PIVOT);
            dir = dir.rotatePivot(CAMERA_ROTATION, CAMERA_PIVOT).unit();

            let clr = trace(pos, dir, 0);
            drawPixel(x, y, clr.x, clr.y, clr.z);  
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
    let distance = NaN;
    let closest = null;

    // Loop through all objects to find the nearest non-NaN intersection (i.e. object)
    for(let i = 0; i < scene.objects.length; i++) {
        let d = scene.objects[i].intersection(origin, direction);

        if(!isNaN(d) && (closest == null || d < distance)) {
            distance = d;
            closest = scene.objects[i];
        }
    }
    
    // If there are no intersections, then render the background
    if(closest == null){
        return BACKGROUND_COLOUR;
    }

    /* CALCULATE REFLECTIONS AND SHADOWS */
    // Pt represents the ray contact-point on the sphere
    let pt = origin.add(direction.scalar(distance));
    let norm = (pt.subtract(closest.centre)).unit();
    let colour = closest.colour.scalar(0.1);

    scene.lights.forEach((light) => {
        // The direction from the contact-point to light source
        let lightDir = light.subtract(pt).unit();
        let seenByLight = 1;

        /* Generate a cast shadow by checking if there's an obstruction
        between the contact-point and light source. */
        scene.objects.forEach((obj) => { 
            if(!isNaN(obj.intersection(pt, lightDir))){
                seenByLight = 0;
            }
        });

        // Apply Lambert (diffuse) shading
        let lambert = Math.max(0, lightDir.dotProduct(norm));
        if(!closest.shiny){
            colour = colour.add((closest.colour).scalar(lambert).scalar(DIFFUSE).scalar(seenByLight));
        }
        else{
            colour = colour.add((closest.colour).scalar(lambert).scalar(DIFFUSE).scalar(seenByLight).scalar(0.5));
        }

        // Apply reflections recursively with a reflected ray
        if(depth < MAX_REFLECTION_ITERATIONS && closest.shiny){
            /* Uses the formula: r = -2 (d.n)n + d
            where d = original direciton vector, n = normal vector */
            let reflectDir = norm.scalar(-2 * direction.dotProduct(norm)).add(direction);
            colour = colour.add(trace(pt, reflectDir, depth + 1).scalar(REFLECTION_INTENSITY));
        }

        // Applying Blinn-Phong (specular) reflection
        let phong = Math.pow(clamp(norm.dotProduct(lightDir.unit())), 50);
        colour = colour.add(new Vector(255, 255, 255).scalar(phong).scalar(SPECULAR).scalar(seenByLight));
    });

    return colour;
}

/**
 * Clamps a given number between 0 and 1.
 * @param {Number} num To be clamped.
 * @returns Value between 0 and 1.
 */
function clamp(num){
    return Math.min(Math.max(num, 0), 1);
}

render();
