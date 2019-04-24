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
uniform vec3 light_position;

out vec4 FragColor;


//COLOR VALUES
const vec3 ambientColor = vec3(0.70,0.6,0.90);
const int levels = 7;
const float scaleFactor = 1.0/levels;


void main()
{

	//VECTORS
	vec3 normal = normalize(norm_out);
	vec3 incident_ray = normalize(cameraPosition-pos_out );
	vec3 light_ray = normalize(light_position-pos_out);
	vec3 halfway = normalize(incident_ray + light_ray);
	
	

	//REFLECTION COLOR
	vec3 reflected_ray = reflect(incident_ray, normal);
	vec3 reflect_Color =  texture(skybox, reflected_ray).rgb;
	float red_reflect =  floor(reflect_Color.r*levels) *scaleFactor;
	float green_reflect =  floor(reflect_Color.g*levels) *scaleFactor;
	float blue_reflect =  floor(reflect_Color.b*levels) *scaleFactor;
	vec3 finalReflection = vec3(red_reflect,green_reflect,blue_reflect)+ambientColor ;
	


	//DIFFUSE COLOR
	float diffuse = max(0,dot(light_ray,normal));
	float diffuse_kd = 1.0;
	float diffuseColor = diffuse_kd * floor(diffuse*levels)*scaleFactor;
	//float diffuseColor = diffuse_kd * diffuse;
	


	//SPECULAR COLOR
	float specularColor = 0.0;
	float specular_ks = 0.50;
	int material_shine = 10;
	if(dot(light_ray,normal) >0.0)
	{
		specularColor = pow(max(0,dot(light_ray,reflect(-light_ray,normal))),material_shine);
		//specularColor = pow(max(0,dot(halfway,normal)), material_shine ); 
	}
	float specularLimit=    (pow (dot(light_ray,reflect(-light_ray,normal) ),material_shine) > 0.4) ? 1 : 0 ;


	//DETECT EDGE
	float edgeDetection = (dot(light_ray,normal)>0.1)? 1 : 0;




	//FINAL COLOR
	float light = edgeDetection*(diffuseColor + specularColor*specularLimit);
	vec3 color = vec3(light,light,light) * finalReflection  ;
	color = color;

    FragColor  = vec4(color,1.0);

}
//-----------------------------------------------------------------------
