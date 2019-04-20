#version 330 core


//TO DO: Write code to compute the reflection vector - GLSL has a function for this.
// Then sample your cube map and update the fragment color.
//Be sure to pass in the correct variables and set your out variables
//-----------------------------------------------------------------------


in vec3 light_vector;
in vec3 halfway_vector;
in vec3 pos_out;
in vec3 norm_out;

uniform samplerCube skybox;
uniform vec3 cameraPosition;
//uniform vec3 light_position;
//uniform vec3 light_position2;

out vec4 FragColor;


//COLOR VALUES
const vec3 ambientColor = vec3(0.90,0.0,0.20);
const int levels = 7;
const int reflectionLevels=100;
const float scaleFactor = 1.0/levels;
vec3 diffuseColoring = vec3(0.56,0.24,0.2);
float diff_r = 0.56;
float diff_g = 0.24;
float diff_b = 0.2;

vec3 GetLightColor(vec3 light_pos);

void main()
{
	vec3 color = GetLightColor(light_vector);
	//color += GetLightColor(light_position2);
    FragColor  = vec4(color,1.0);
}

vec3 GetLightColor(vec3 light_pos) {
//VECTORS
	vec3 normal = normalize(norm_out);
	vec3 incident_ray = normalize(cameraPosition-pos_out);
	vec3 light_ray = normalize(light_pos);
	vec3 halfway = normalize(halfway_vector);
	vec3 reflected_ray = reflect(incident_ray, normal);
	

	//REFLECTION COLOR
	vec3 reflect_Color =  texture(skybox, reflected_ray).rgb;
	float red_reflect =  floor(reflect_Color.r*levels) *scaleFactor;
	float green_reflect =  floor(reflect_Color.g*levels) *scaleFactor;
	float blue_reflect =  floor(reflect_Color.b*levels) *scaleFactor;
	vec3 finalReflection = vec3(red_reflect,green_reflect,blue_reflect);


	//DIFFUSE COLOR
	float diffuse = max(0,dot(light_ray,normal));
	float diffuse_kd = 1.0;
	//diffuseColor = diffuseColor*diffuse_kd * floor(diffuse*levels) *scaleFactor;
	float red_diffuseColor = diffuse_kd * diffuse *diff_r;
	red_diffuseColor =  floor(red_diffuseColor*levels) *scaleFactor;

	float green_diffuseColor = diffuse_kd * diffuse *diff_g;
	green_diffuseColor =  floor(green_diffuseColor*levels) *scaleFactor;

	float blue_diffuseColor = diffuse_kd * diffuse *diff_b;
	blue_diffuseColor =  floor(blue_diffuseColor*levels) *scaleFactor;


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
	float redlight = edgeDetection * (red_diffuseColor + specularColor*specularLimit);
	float greenlight = edgeDetection * (green_diffuseColor + specularColor*specularLimit);
	float bluelight = edgeDetection * (blue_diffuseColor + specularColor*specularLimit);

	vec3 color = vec3(redlight,greenlight,bluelight);
	color = edgeDetection * (color + finalReflection);
	return color;
}
//-----------------------------------------------------------------------
