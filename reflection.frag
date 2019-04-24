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

uniform vec3 aveColor0;
uniform vec3 aveColor1;
uniform vec3 aveColor2;
uniform vec3 aveColor3;
uniform vec3 aveColor4;
uniform vec3 aveColor5;
uniform vec3 aveColor6;

uniform vec3 shaderMode;

out vec4 FragColor;


//COLOR VALUES
const vec3 ambientColor = vec3(0.70,0.2,0.10);
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
	
	//RGB to HSL Math
	float refRed = reflect_Color[0] / 255;
	float refGreen = reflect_Color[1] / 255;
	float refBlue = reflect_Color[2] / 255;

	float maxRef = max(refRed, refGreen);
	maxRef = max(maxRef, refBlue);

	float minRef = min(refRed, refGreen); 
	minRef = min(minRef, refBlue);

	int hue;

	if (maxRef == refRed){
		hue = int(((refGreen - refBlue) / (maxRef - minRef)) * 60);
	}
	else if (maxRef == refGreen){
		hue = int((2.0 + (refBlue - refRed) / (maxRef - minRef)) * 60);
	}
	else{
		hue = int((4.0 + (refRed - refGreen) / (maxRef - minRef)) * 60);
	}

	if (hue < 0){
		hue = hue + 360;}

	int tempDifference = 255;
	int difference = 255;
	vec3 foundHue;


	if(abs(hue - (int(aveColor0[0]))) < tempDifference){
		foundHue = aveColor0;
		tempDifference = abs(hue - (int(aveColor0[0])));
	}
	if(abs(hue - (int(aveColor1[0]))) < tempDifference){
		foundHue = aveColor1;
		tempDifference = abs(hue - (int(aveColor1[0])));
	}
	if(abs(hue - (int(aveColor2[0]))) < tempDifference){
		foundHue = aveColor2;
		tempDifference = abs(hue - (int(aveColor2[0])));
	}
	if(abs(hue - (int(aveColor3[0]))) < tempDifference){
		foundHue = aveColor3;
		tempDifference = abs(hue - (int(aveColor3[0])));
	}
	if(abs(hue - (int(aveColor4[0]))) < tempDifference){
		foundHue = aveColor4;
		tempDifference = abs(hue - (int(aveColor4[0])));
	}
	if(abs(hue - (int(aveColor5[0]))) < tempDifference){
		foundHue = aveColor5;
		tempDifference = abs(hue - (int(aveColor5[0])));
	}
	if(abs(hue - (int(aveColor6[0]))) < tempDifference){
		foundHue = aveColor6;
		tempDifference = abs(hue - (int(aveColor6[0])));
	}

	//HSL to RGB Math
	float temp1, temp2, tempR, tempG, tempB;
	float H = foundHue[0]		;
	float S = foundHue[1] / 100;
	float L = foundHue[2] / 100;

	float R, G, B;


	if (L < 0.5){
		temp1 = L * (1.0 + S);
	}
	else{
		temp1 = L + S - L * S;
	}
	temp2 = 2 * L - temp1;

	H = H / 360;

	tempR = H + 0.333;
	if (tempR > 1){
		tempR = tempR - 1;}
	tempG = H;
	tempB = H - 0.333;
	if (tempB < 0){
		tempB = tempB + 1;}

	//HSL to Red
	if (tempR * 6 < 1){
		R = (temp2 + (temp1 - temp2) * 6 * tempR) ;}
	else if (tempR * 2 < 1){
		R = temp1;}
	else if (tempR * 3 < 2){
		R = (temp2 + (temp1 - temp2) * (0.666 - tempR) * 6);}
	else{
		R = temp2;}

	//HSL to Green
	if (tempG * 6 < 1){
		G = (temp2 + (temp1 - temp2) * 6 * tempG) ;}
	else if (tempG * 2 < 1){
		G = temp1 ;}
	else if (tempG * 3 < 2){
		G = (temp2 + (temp1 - temp2) * (0.666 - tempG) * 6) ;}
	else{
		G = temp2 ;}

	//HSL to Blue
	if (tempB * 6 < 1){
		B = (temp2 + (temp1 - temp2) * 6 * tempB) ;}
	else if (tempB * 2 < 1){
		B = temp1 ;}
	else if (tempB * 3 < 2){
		B = (temp2 + (temp1 - temp2) * (0.666 - tempB) * 6) ;}
	else{
		B = temp2 ;}

	//Assert new reflect color
	if(shaderMode == vec3(0, 0, 0)){
		//ambientColor = vec3(0.1, 0.1, 0.1);
		finalReflection = vec3(R, G, B) + vec3(0.1, 0.1, 0.1);
	}

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

//SOURCES
//	Hue -> RGB calculations
//	https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glGetTexImage.xml
//	GLSL Visual Studio Support
//	https://marketplace.visualstudio.com/items?itemName=DanielScherzer.GLSL
//	Understanding Uniform Variables
//	https://www.opengl.org/sdk/docs/tutorials/ClockworkCoders/uniform.php
//	Passing color values to shaderMode
//	http://www.lighthouse3d.com/tutorials/glsl-tutorial/color-example/
