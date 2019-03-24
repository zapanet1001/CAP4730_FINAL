#version 330 core

//TO DO: Set the position of the cubemap and texture coordinates.
// Be sure to pass in the correct variables and set your out variables
//-----------------------------------------------------------------------
in vec3 cubeMapPosition;
out vec3 textureCoordinates;
uniform mat4 view;
uniform mat4 projection;
uniform mat4 model;

void main()
{
	gl_Position = projection * view * model * vec4(cubeMapPosition, 1.0);
	//gl_Position = pos.xyww;
	textureCoordinates = cubeMapPosition;
}
//-----------------------------------------------------------------------
