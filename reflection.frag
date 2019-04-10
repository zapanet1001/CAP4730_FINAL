#version 330 core


//TO DO: Write code to compute the reflection vector - GLSL has a function for this.
// Then sample your cube map and update the fragment color.
//Be sure to pass in the correct variables and set your out variables
//-----------------------------------------------------------------------



in vec3 pos_out;
in vec3 norm_out;

uniform samplerCube skybox;
uniform vec3 cameraPosition;
uniform vec3 light_position;

out vec4 FragColor;


//COLOR VALUES
const vec3 ambientColor = vec3(0.90,0.0,0.20);
const int levels = 7;
const float scaleFactor = 1.0/levels;
vec3 diffuseColor = vec3(0.30,0.80,0.10);

void main()
{
	//VECTORS
	vec3 normal = normalize(norm_out);
	vec3 incident_ray = normalize(cameraPosition-pos_out );
	vec3 light_ray = normalize(light_position-pos_out);
	vec3 halfway = normalize(incident_ray + light_ray);
	vec3 reflected_ray = reflect(incident_ray, normal);

	//DETECT EDGE
	float edgeDetection = (dot(incident_ray,normal)>0.2)? 1 : 0;

	//REFLECTION COLOR
	vec3 reflect_Color =  texture(skybox, reflected_ray).rgb;
	vec4 reflectionColor = vec4(reflect_Color*edgeDetection,1.0);


	//DIFFUSE COLOR
	float diffuse = max(0,dot(light_ray,normal));
	float diffuse_kd = 0.40;
	diffuseColor = diffuseColor*diffuse_kd * floor(diffuse*levels) *scaleFactor;
	

	//PECULAR COLOR
	float specularColor = 0.0;
	float specular_ks = 0.38;
	int material_shine = 10;
	if(dot(light_ray,normal) >0.0)
	{
		specularColor = specular_ks* pow(max(0,dot(halfway,normal)), material_shine );
	}
	float specularLimit = (pow(dot(halfway,normal),material_shine) > 0.4) ? 1 : 0 ;

	float light = edgeDetection * (diffuse*diffuse_kd + specularColor);
	vec3 color = vec3(light,light,light);
	color = edgeDetection * (color + diffuseColor + specularColor * specularLimit);

    FragColor  = vec4(color,1.0);
}
//-----------------------------------------------------------------------
