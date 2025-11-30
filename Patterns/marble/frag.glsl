// Frag file is adjusted from thie shadertoy sketch
//https://www.shadertoy.com/view/4td3RN


#ifdef GL_ES
precision mediump float;
#endif

// Pass in uniforms from the sketch.js file
uniform vec2 u_resolution; 
uniform float u_time;
uniform float iFrame;

#define PURPLE vec3(112, 50, 126) / 255.
#define GREEN vec3(102, 211, 52) / 255.
#define YELLOW vec3(252, 238, 33) / 255.
#define ORANGE vec3(248, 158, 79) / 255.
#define RASPBERRY vec3(236, 1, 90) / 255.

vec3 marble(vec2 uv, vec3 col1, vec3 col2, vec3 col3, vec3 col4) {
    
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
   
    // yellow and purple
    vec3 m1 = mix(col1*col1, col2*col2, bias2);
    // green and raspberry
    vec3 m2 = mix(col3*col3, col4*col4, bias3);
   
    return mix(m1, m2, bias4);
}

void main()	{
	vec2 uv = (gl_FragCoord.xy - 0.5*u_resolution.xy)/u_resolution.xy;
     
    vec3 color = marble(uv, YELLOW, PURPLE, GREEN, RASPBERRY);
  
    gl_FragColor = vec4(color, 1.0);
}