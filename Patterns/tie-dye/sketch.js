// Port of shader that is no longer available on shadertoy. I have incorported the Lygia library.
// I think original author's name is shaderjiang
//https://www.shadertoy.com/view/ctByWz (shadertoyjiang)

let shdr;
//let colors = ["#edf7f8", "#008a99", " #8c1508"];
//let palette = [[240, 90, 88], [84, 197, 201], [61, 42, 137]]
let palette = [
  [12, 71, 103],
  //[86, 110, 61],
  //[185, 164, 76],
  [254, 153, 32],
  [250, 121, 33],
];

function setup() {
  let canvasSize = min(windowWidth, windowHeight);
  createCanvas(canvasSize, canvasSize, WEBGL);

  pixelDensity(1);
  noCursor();

  // tieDye shader
  vertSource = resolveLygia(tieDye.vert);
  fragSource = resolveLygia(tieDye.frag);
 
  shdr = createShader(vertSource, fragSource);
}

function draw() {
  shader(shdr);

  // send resolution of sketch into shader
  shdr.setUniform("u_resolution", [width, height]);
  shdr.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  shdr.setUniform("iFrame", frameCount);
  shdr.setUniform("u_time", millis() / 1000);
  shdr.setUniform("c1", palette[0]);
  shdr.setUniform("c2", palette[1]);
  shdr.setUniform("c3", palette[2]);

  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  saveCanvas("pattern.jpg");
}

const tieDye = {
  frag: `#version 300 es
precision highp float;
out vec4 O;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 c1;
uniform vec3 c2;
uniform vec3 c3;


//#include "lygia/color/mixSpectral.glsl"
#include "lygia/animation/easing.glsl"
#include "lygia/color/mixOklab.glsl"
#include "lygia/color/palette/spectral.glsl"
#include "lygia/color/palette/pigments.glsl"
#include "lygia/color/blend.glsl"
#include "lygia/draw/fill.glsl"
#include "lygia/math/rotate2d.glsl"
#include "lygia/math/const.glsl"
#include "lygia/math/smootherstep.glsl"
#include "lygia/sdf/superShapeSDF.glsl"
#include "lygia/sdf/circleSDF.glsl"
#include "lygia/generative/random.glsl"

#include "lygia/generative/psrdnoise.glsl"
//#include "lygia/color/palette/water.glsl"
#include "lygia/color/palette/spectral.glsl"

#include "lygia/sample/flow.glsl"

#include "lygia/color/desaturate.glsl"
//#include "lygia/space/aspect.glsl"
//#include "lygia/space/ratio.glsl"
//#include "lygia/space/rotate.glsl"

vec3 rgb( vec3 color) 
{
   return vec3(color.r/ 255.0, color.g / 255.0, color.b / 255.0);
}

float tieDye( vec2 st, float speed, float zoom, int N) {
    st -= 0.5;
    vec3 r = u_resolution.xxx;
    vec3 uv = vec3((2.0 * st.xyy- r)/r.x * zoom);
    uv.z = sineIn(u_time*speed);
	  uv *= 0.5;
	
    for (int i = 0; i< N; i++) {
        uv = abs(uv) / dot( uv, uv) - atan(uv.z, length(uv.xy))-atan(length(uv.xy), uv.z);
        uv = length( uv )*( uv + 1.3 ); 
	}
    uv = vec3(dot( uv, uv ) * 0.5);
    return clamp(uv.x, 0.0, 1.0);
}
  
vec3 tye_dye( vec2 st, float speed,  float zoom, int N, vec3 color1, vec3 color2, vec3 color3, vec3 color4) {
    st -= 0.5;
    vec3 r = u_resolution.xxx;
    vec3 u = vec3((2.0 * st.xyy- r)/r.x * zoom);
    u.z = sineIn(u_time*speed);
    
	  u *= 0.5;
    for (int i = 0; i< N; i++) {
        u = abs(u) / dot( u, u) - atan(u.z, (u.x*u.x + u.y*u.y))-atan( (u.x*u.x + u.y*u.y), u.z);
        u = length( u )*( u + 1.3 );
       
	}
    u = vec3(dot( u, u ) * 0.5);
    vec3 col1 = mix(color1, color2, u.x);
    vec3 col2 = mix(color3, color4, u.x);
    return mix(col1, col2, u.x);
   // return u.x;
}
  
void main()
{
    vec2 st = gl_FragCoord.xy;
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    vec2 mouse = u_mouse.xy;
    vec4 color = vec4(vec3(0), 1.);
		
		vec3 v = vec3(random(uv*456.) * 8.0);
		
    float f = tieDye(st, 0.1, 3.0, 6); // 3.0, 6
   
    
    color.rgb = mixOklab(rgb(c1), rgb(c2), f);
  
    //color.rgb += mixOklab(rgb(c1), rgb(c3), f);
  
  
   // Filling a shape
	 //float n = random(uv*456.);
	  float n = floor(uv*5.).x;
    float sdf = circleSDF(uv) - 0.9;
    
    float s = smootherstep(0.0, 0.1, sdf);
    //color.rgb = (1.0-s)*color.rgb;
    //color.rgb = (1.0-s)*color.rgb + s * PURPLE;
    
    O = color;
}`,
  vert: `#version 300 es 
in vec3 aPosition; void main() { gl_Position=vec4(aPosition*2.-1., 1.0); }`,
};


