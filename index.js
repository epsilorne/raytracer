import { Vector } from './vector.js';
import { Sphere } from './objects.js';

// DISPLAY PARAMETERS
let canvasWidth = 512;
let canvasHeight = 512;

// OBJECTS AND LIGHTING TO BE RENDERED
class Scene {
    constructor(){
        this.objects = [ 
            new Sphere(0, 1, 0, 2, 200),
            new Sphere(1, 0, 0.5, 1.5, 100)
                    ];
        this.lights = [ new Vector(0, 100, 0) ];
    }
}

let scene = new Scene();

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
            let val = trace(new Vector(0, 1, 5), dir);
            
            // ImageData.data is an array where every 4 elements represents RGBA of a single pixel
            let index = x * 4 + y * canvasWidth * 4
            data.data[index + 0] = val;
            data.data[index + 1] = val;
            data.data[index + 2] = val;
            data.data[index + 3] = 255;
        }
    }

    context.putImageData(data, 0, 0);
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

    // If there are no intersections, then render darkness
    if(index < 0){
        return 0;
    }

    return scene.objects[index].colour;
}

render();