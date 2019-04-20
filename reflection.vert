#version 330 core

//TO DO: Write code to set the model's position in relation to the view 
//Be sure to pass in the correct variables and set your out variables
//-----------------------------------------------------------------------
in vec3 vertex;
in vec3 normal;

uniform vec3 light_position;
uniform vec3 light_position2;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

out vec3 pos_out;
out vec3 norm_out;
out vec3 light_vector;
out vec3 halfway_vector;

void main()
{
	
	

    gl_Position = projection * view * model * vec4(vertex, 1.0);

	vec4 v = view * model * vec4(vertex,1.0);
	vec3 normal_temp = normalize(normal);

	light_vector = normalize((view * vec4(light_position,1.0)).xyz - v.xyz);
	halfway_vector = light_vector + normalize(-v.xyz);
	norm_out = (inverse(transpose(view*model)) * vec4(normal_temp,0.0)).xyz;
	pos_out = (inverse(transpose(model))* vec4(normal_temp,0.0)).xyz;


}

//-----------------------------------------------------------------------
