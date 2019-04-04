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
#version 330 core


//TO DO: Write code to compute the reflection vector - GLSL has a function for this.
// Then sample your cube map and update the fragment color.
//Be sure to pass in the correct variables and set your out variables
//-----------------------------------------------------------------------



in vec3 pos_out;
in vec3 norm_out;
in vec3 light_ray;
//in vec3 halfway_vec;

uniform samplerCube skybox;
uniform vec3 cameraPosition;

out vec4 FragColor;

//Diffuse Color
vec4 diffuse_color = vec4(0.72,0.45,0.2,1.0);

void main()
{
	//reflect ray around normal
	vec3 incident_ray = normalize(cameraPosition-pos_out );			//VIEWING DIRECTION VECTOR
	vec3 L = normalize(light_ray-pos_out);					//LIGHT VECTOR
	vec3 normal = normalize(norm_out);					//NORMAL VECTOR
	vec3 H = normalize(L+incident_ray);					//HALFWAY VECTOR

	//DETECT EDGE
	//float edgeDetection = (dot(incident_ray,normal)>0.0) ? 1 : 0;

	//REFLECTION COLOR
	vec3 reflected_ray = reflect(incident_ray, normal);
	vec3 reflect_Color =  texture(skybox, reflected_ray).rgb;
	vec4 reflectionColor = vec4(reflect_Color,1.0);

	

	//DIFFUSE COLOR
	float diffuse = max(0,dot(L,normal));
	vec4 diffuse_color = vec4(0.72,0.45,0.2,1.0);
		//INDEXED COLOR
		float intensity = dot(reflected_ray, normal);
		if(intensity>0.95)
			diffuse_color = diffuse_color*1.0;
		else if(intensity>0.5)
			diffuse_color = diffuse_color*0.6;
		else if(intensity>0.25)
			diffuse_color = diffuse_color*0.4;
		else
			diffuse_color = diffuse_color*0.2;
	

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
