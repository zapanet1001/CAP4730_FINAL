#version 330 core


//TO DO: Write code to compute the reflection vector - GLSL has a function for this.
// Then sample your cube map and update the fragment color.
//Be sure to pass in the correct variables and set your out variables
//-----------------------------------------------------------------------

in vec3 pos_out;
in vec3 norm_out;

uniform samplerCube skybox;
uniform vec3 cameraPosition;

out vec4 FragColor;

void main()
{
	//reflect ray around normal
	vec3 incident_ray = normalize(pos_out-cameraPosition);
	vec3 normal = normalize(norm_out);

	vec3 reflected_ray = reflect(incident_ray, normal);
	//reflected_ray = vec3( inverse(view) * vec4(reflected_ray,0,0));
    FragColor  = vec4(texture(skybox, reflected_ray).rgb,1.0);
}
//-----------------------------------------------------------------------
