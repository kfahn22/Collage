// let palette = [
//   [240, 90, 88],
//   [84, 197, 201],
//   [61, 42, 137],
// ];
let palette = [
   [12, 71, 103],
  [86, 110, 61],
  [185, 164, 76],
  [254, 153, 32],
  [250, 121, 33],
];

let theShader;

function preload() {
  // load the shader
  theShader = loadShader(marble.frag, marble.vert);
}

function setup() {
  let canvasSize = min(windowWidth, windowHeight);
  createCanvas(canvasSize, canvasSize, WEBGL);

  pixelDensity(1);
  noCursor();
  vertSource = resolveLygia(marble.vert);
  fragSource = resolveLygia(marble.frag);
  theShader = createShader(vertSource, fragSource);
}

function draw() {
  background(0);

  // send resolution of sketch into shader
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  theShader.setUniform("iFrame", frameCount);
  theShader.setUniform("u_time", millis() / 1000);
  theShader.setUniform("uNoiseTexture", noise);
  theShader.setUniform("c1", palette[0]);
  theShader.setUniform("c2", palette[1]);
  theShader.setUniform("c3", palette[2]);

  shader(theShader);
  rect(0, 0, width, height);
}

function mousePressed() {
  saveCanvas("pattern.jpg");
}

const marble = {
  frag: `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 u_resolution; 
uniform float u_time;
uniform float iFrame;
uniform vec3 c1;
uniform vec3 c2;
uniform vec3 c3;

vec3 rgb( vec3 color) 
{
   return vec3(color.r/ 255.0, color.g / 255.0, color.b / 255.0);
}

vec3 marble(vec2 uv, vec3 col1, vec3 col2, vec3 col3) {
    
    //float t = u_time;
    float t = iFrame*0.01;
    float n = 1.825;
	float freq = cos(u_time*0.01)/n;

  
    for(float i=1.;i<75.;i++)  {
      uv.x += freq/i*cos(i*uv.y+t) + 0.494*i;
      uv.y += freq/i*sin(i*uv.x+t) - 0.458*i;}
    
	float bias2 = abs(sin(uv.y*2.));
    float bias3 = abs(sin(uv.y*3.));
    float bias4 = abs(sin(uv.y*4.));
   
    // 1st and 2nd color
    vec3 m1 = mix(col1*col1, col2*col2, bias2);
    // 1st and 3rd color
    vec3 m2 = mix(col1*col1, col3*col3, bias3);
   
    return mix(m1, m2, bias4);
}

void main()	{
	vec2 uv = (gl_FragCoord.xy - 0.5*u_resolution.xy)/u_resolution.xy;
     
    vec3 color = marble(uv, rgb(c1), rgb(c2), rgb(c3));
  
    O = vec4(color, 1.0);
}`,
  vert: `#version 300 es 
in vec3 aPosition; void main() { gl_Position=vec4(aPosition*2.-1., 1.0); }`,
};
