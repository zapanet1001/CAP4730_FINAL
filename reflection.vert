#version 330 core

//TO DO: Write code to set the model's position in relation to the view 
//Be sure to pass in the correct variables and set your out variables
//-----------------------------------------------------------------------
in vec3 vertex;
in vec3 normal;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform vec3 cameraPosition;

out vec3 pos_out;
out vec3 norm_out;
//out vec3 reflected;

void main()
{
	pos_out = (inverse  (   transpose(model)) * vec4((vertex),0.0)    ).xyz;
	norm_out = (inverse(transpose(model)) * vec4(normalize(normal),0.0)).xyz;


    gl_Position = projection * view * model * vec4(vertex, 1.0);
}
//-----------------------------------------------------------------------