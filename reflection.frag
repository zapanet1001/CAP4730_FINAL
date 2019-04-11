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
vec3 diffuseColoring = vec3(1.0,0.0,1.0);

void main()
{
	//VECTORS
	vec3 normal = normalize(norm_out);
	vec3 incident_ray = normalize(cameraPosition-pos_out );
	vec3 light_ray = normalize(light_position-pos_out);
	vec3 halfway = normalize(incident_ray + light_ray);
	vec3 reflected_ray = reflect(incident_ray, normal);
	

	//REFLECTION COLOR
	vec3 reflect_Color =  texture(skybox, reflected_ray).rgb;
	//vec4 reflectionColor = vec4(reflect_Color,1.0);


	//DIFFUSE COLOR
	float diffuse = max(0,dot(light_ray,normal));
	float diffuse_kd = 1.0;
	//diffuseColor = diffuseColor*diffuse_kd * floor(diffuse*levels) *scaleFactor;
	float diffuseColor = diffuse_kd * diffuse;
	diffuseColor = diffuse_kd * floor(diffuseColor*levels) *scaleFactor;


	//SPECULAR COLOR
	float specularColor = 0.0;
	float specular_ks = 0.50;
	int material_shine = 100;
	if(dot(light_ray,normal) >0.0)
	{
		//specularColor = specular_ks* pow(max(0,dot(halfway,normal)), material_shine );
		specularColor = pow(max(0,dot(incident_ray,reflect(-light_ray,normal))), material_shine ); 
	}
	float specularLimit = (pow(dot(incident_ray,reflect(-light_ray,normal)),material_shine) > 0.4) ? 1 : 0 ;


	//DETECT EDGE
	float edgeDetection = (dot(incident_ray,normal)>0.3)? 1 : 0;



	//FINAL COLOR
	float light = edgeDetection * (diffuseColor + specularColor*specularLimit);
	vec3 color = vec3(light,light,light);
	color = edgeDetection * (color + reflect_Color);

    FragColor  = vec4(color,1.0);
}
//-----------------------------------------------------------------------
