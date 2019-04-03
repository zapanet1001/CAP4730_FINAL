#version 330 core


//TO DO: Write code to compute the reflection vector - GLSL has a function for this.
// Then sample your cube map and update the fragment color.
//Be sure to pass in the correct variables and set your out variables
//-----------------------------------------------------------------------



in vec3 pos_out;
in vec3 norm_out;
//in vec3 light_vec;
//in vec3 halfway_vec;

uniform samplerCube skybox;
uniform vec3 cameraPosition;

out vec4 FragColor;

void main()
{
	//reflect ray around normal
	vec3 incident_ray = normalize(cameraPosition-pos_out );
	vec3 normal = normalize(norm_out);

	//DETECT EDGE
	//float edgeDetection = (dot(incident_ray,normal)>0.0) ? 1 : 0;

	//REFLECTION COLOR
	vec3 reflected_ray = reflect(incident_ray, normal);
	vec3 reflect_Color =  texture(skybox, reflected_ray).rgb;
	vec4 reflectionColor = vec4(reflect_Color,1.0);

	//HANDLE INDEXED COLOR
	float intensity = dot(reflected_ray, normal);
	if(intensity>0.95)
		reflectionColor = reflectionColor*1.0;
	else if(intensity>0.5)
		reflectionColor = reflectionColor*0.6;
	else if(intensity>0.25)
		reflectionColor = reflectionColor*0.4;
	else
		reflectionColor = reflectionColor*0.2;

	//LIGHT
	vec3 L = normalize(reflected_ray-pos_out);
	vec3 H = normalize(L+incident_ray);

	//DIFFUSE COLOR
	float diffuse = max(0,dot(L,normal));
	vec4 diffuse_color = vec4(0.8,0.6,0.2,1.0)*reflectionColor;
	float diffuse_intensity = 0.4;

	/*SPECULAR COLOR
	float specularColor = 0.0;
	if(dot(L,normal) >0.0)
	{
		specularColor
	}

	//c4 specular_color = vec4(1.0,0.0,0.0,1.0)*reflectionColor; 
	float specular_intensity = 0.38;*/
	
	 

    FragColor  = diffuse_color*diffuse_intensity +  reflectionColor;
}
//-----------------------------------------------------------------------
