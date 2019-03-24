#version 330 core


//TO DO: Use a sampler object to set the color.
// Be sure to pass in the correct variables and set your out variables
//-----------------------------------------------------------------------
in vec3 textureCoordinates;
out vec4 FragColor;
uniform samplerCube skybox;

void main()
{
    FragColor = texture(skybox, textureCoordinates);
}
//-----------------------------------------------------------------------
