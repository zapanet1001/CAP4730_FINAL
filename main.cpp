//-------------------------------------------------------------
// University of Florida
// copyright 2017 Corey Toler-Franklin 
// main.cpp for environment mapping program
//-------------------------------------------------------------


// included files
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <SOIL.h>
#include <glm.hpp>
#include <gtc/matrix_transform.hpp>
#include <gtc/type_ptr.hpp>
#include <iostream>
#include <string>
#include <vector>
#include "Shader.h"
#include "Camera.h"
#include "Geometry.h"

// compiler definitions
#define BUFFER_OFFSET(a) ((void*)(a))


//----------------------------------------------
// Gemoetry (Teapot and Skybox)
//----------------------------------------------
//  Global VAO objects: the list of vertex array objects
enum VAO_IDs { Skybox, Astronaut, NumVAOs };
GLuint  VAOs[NumVAOs];
Geometry astronaut;



//----------------------------------------------
// Textures (for cubemap)
//----------------------------------------------
enum Texture_IDs { SkyboxTexture, NumTextures };
GLuint  Textures[NumTextures];
// Called to generate the cubmap
GLuint GenerateCubeMapTexture(GLuint textureId);
GLuint GenerateCubeVAO(GLuint VAO);




//----------------------------------------------
// Attribute identifiers: These help identify the
// type data in a buffer.
//----------------------------------------------
// ID for vertex position: vPosition, ID for normals: vNormal
enum Attrib_IDs { vPosition = 0, vNormal = 1};




//----------------------------------------------
// OpenGL
//----------------------------------------------
// Checks OpenGL support for SOIL
void SetSoilCapabilties(void);




//----------------------------------------------
// windows
//----------------------------------------------
int windowHeight = 1200;
int windowLength = 1200;




//----------------------------------------------
// camera 
//----------------------------------------------
// initializes the camera. The teapot is a Geometry object.
Camera camera(glm::vec3(0.0f, 0.0f, 0.0f), glm::vec3(0.0f, 1.0f, 0.0f), -90.0f, 0.0f);



//----------------------------------------------
// time variables
//----------------------------------------------
// tracks the change in time for camera and model
// manipulation in the scene
GLfloat deltaTime = 0.0f;
GLfloat lastFrame = 0.0f;




//----------------------------------------------
// Callback functions
//----------------------------------------------
// manages the mouse position which controls the camera
// and rotates the teapot model
void KeyCallback(GLFWwindow *window, int key, int scan, int act, int mode);
void MouseCallback(GLFWwindow *window, double xPosition, double yPosition);
void ScrollCallback(GLFWwindow *window, double deltaX, double deltaY);
void KeyMovement(void);
bool keys[1024];
GLfloat lastX = windowLength / 2, lastY = windowHeight / 2;
bool firstMouse = true;




//----------------------------------------------
// Display
//----------------------------------------------
// continually draws the scene
void display(int windowWidth, int windowHeight);



//----------------------------------------------
// init
//----------------------------------------------
void init()
{
    glEnable(GL_DEPTH_TEST);

    // TO DO: Set up cubemap
	// 1. use glGenTextures to get a set of texture names
	// 2. call GenerateCubeMapTexture to create the cubemap
	// 3. now set-up the geometry for the skybox using GenerateCubeVAO
	// 4. finally initialize the teapot Geometry::Initialize
	//--------------------------------------------------

		//get set of texture names
		//create cubemap
		Textures[SkyboxTexture] = GenerateCubeMapTexture(0);


		//set up geometry for skybox
		//GLuint VAO;
		glGenVertexArrays(1, &VAOs[Skybox]);
		VAOs[Skybox] = GenerateCubeVAO(0);
		
		//initialize the teapot
		glGenVertexArrays(1, &VAOs[Astronaut]);
		astronaut.Initialize("../../data/models/teapot.obj", VAOs[Astronaut]);

		


	//----------------------------------------------------

    glDepthFunc(GL_LEQUAL);

}

// Create a Vertex Array Object for the cube
GLuint GenerateCubeVAO(GLuint VAO) {


	// TO DO: Create a Vertex Array Object (VOA) for the cube
	// 1. Initialize the vertices
	// 2. Bind your vertex array 
	//    glBindVertexArray
	// 3. Create a buffer for the cube vertices and bind it
	//   glGenBuffers, glBindBuffer
	// 4. Fill the buffer with position data
	//   Use the correct attribute ID to enable the vertex attribute array
	//   glBufferData, glVertexAttribPointer, glEnableVertexAttribArray
	//--------------------------------------------------

		GLuint vao;
		//intialize vertices
		float vertices[] = {
			-10.0f,  10.0f, -10.0f,
			-10.0f, -10.0f, -10.0f,
			10.0f, -10.0f, -10.0f,
			10.0f, -10.0f, -10.0f,
			10.0f,  10.0f, -10.0f,
			-10.0f,  10.0f, -10.0f,
			
			-10.0f, -10.0f,  10.0f,
			-10.0f, -10.0f, -10.0f,
			-10.0f,  10.0f, -10.0f,
			-10.0f,  10.0f, -10.0f,
			-10.0f,  10.0f,  10.0f,
			-10.0f, -10.0f,  10.0f,
			
			10.0f, -10.0f, -10.0f,
			10.0f, -10.0f,  10.0f,
			10.0f,  10.0f,  10.0f,
			10.0f,  10.0f,  10.0f,
			10.0f,  10.0f, -10.0f,
			10.0f, -10.0f, -10.0f,
			
			-10.0f, -10.0f,  10.0f,
			-10.0f,  10.0f,  10.0f,
			10.0f,  10.0f,  10.0f,
			10.0f,  10.0f,  10.0f,
			10.0f, -10.0f,  10.0f,
			-10.0f, -10.0f,  10.0f,
			
			-10.0f,  10.0f, -10.0f,
			10.0f,  10.0f, -10.0f,
			10.0f,  10.0f,  10.0f,
			10.0f,  10.0f,  10.0f,
			-10.0f,  10.0f,  10.0f,
			-10.0f,  10.0f, -10.0f,
			
			-10.0f, -10.0f, -10.0f,
			-10.0f, -10.0f,  10.0f,
			10.0f, -10.0f, -10.0f,
			10.0f, -10.0f, -10.0f,
			-10.0f, -10.0f,  10.0f,
			10.0f, -10.0f,  10.0f
		};

		//Bind vertex array
		glGenVertexArrays(1, &vao);
		glBindVertexArray(vao);

		//Create a buffer for the cube vertices and bind it
		GLuint VBO;
		glGenBuffers(1, &VBO);
		glBindBuffer(GL_ARRAY_BUFFER, VBO);

		//Fill buffer with position data
		glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), &vertices, GL_STATIC_DRAW);
		glEnableVertexAttribArray(0);
		glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3*sizeof(GLfloat), (GLvoid *) 0);
		glBindVertexArray(0);
		glBindBuffer(GL_ARRAY_BUFFER,0);
		return vao;
		
	//---------------------------------------------------------------
}



//----------------------------------------------
// display function
//-----------------------------------------------
void display(int windowWidth, int windowHeight)
{

	// Create  two shaders by initializing the 
	// Shader obects with a path to shaders.
    static Shader envShader("./Shaders/environment.vert", "./Shaders/environment.frag");
    static Shader refShader("./Shaders/reflection.vert", "./Shaders/reflection.frag");

    
	// sets up the camera motion
    float camX = cos(.1*glfwGetTime());
    float camZ = sin(.1*glfwGetTime());
    float ratio = (float)windowHeight/windowWidth;
    
	// sets up the camera projection matrices
    //glm::mat4 projection = glm::ortho(-1.0f, 1.0f, -ratio, ratio, -1.0f, 1.0f);
    glm::mat4 rotation = glm::lookAt(glm::vec3(0.0, 0.0, 0.0), glm::vec3(camX, 0.0, camZ), glm::vec3(0.0, 1.0, 0.0));
   
	glm::mat4 view = glm::mat4(1.0f);
	glm::mat4 projection = glm::perspective(45.0f, (float)windowLength / (float)windowHeight, 0.1f, 1000.0f);
	//glm::mat4 view = glm::mat4(1.0f) *rotation;
	glm::mat4 model = glm::mat4(1.0f);


	// prints camera projection matricies to the command window
	// as the program runs
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 4; j++) {
            std::cout << projection[i][j] << " ";
        }
        std::cout << std::endl;
    }
    std::cout << "======" << std::endl;
    



	// TO DO: Draw the cubemap and the teapot model
	//        1. First clear the screen. 
	//           glClear
	//        2. Draw the cubemap using the Shader class (Shader.h)
	//           see Shader::Use, also send in the input variables using the Shader set functions
	//        3. Set up the textures.
	//           see glActiveTexture, glBindTexture, glBindVertexArray, glDrawArrays
	//        4. Now use a shader to draw the teapot
	//           see Shader::Use, also send in the input variables using the Shader set functions
	//           don't forget to call Geometry::Draw function on the teapot model
	//           you also have to shift the model so that it is centered in the view
	//           see glm::translate and related functions for moving the model
	//----------------------------------------------

		//clear the screen
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		
		//view = view*camera.viewMat();
		//glm::mat4 model = glm::mat4(1.0f);
		glm::mat4 projection_alt = glm::perspective(camera.zoomfactor, (float)windowWidth / (float)windowHeight, 0.1f, 1000.0f);
		
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  ASTRONAUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		//Draw Astronaut with shader class
		refShader.Use();

		//Grab locations of teapot attributes
		GLuint vertex = glGetAttribLocation(refShader.Program, "vertex");
		glEnableVertexAttribArray(vertex);
		glVertexAttribPointer(vertex, 3, GL_FLOAT, GL_FALSE, 0, 0);
		GLuint normal = glGetAttribLocation(refShader.Program, "normal");
		glEnableVertexAttribArray(normal);
		glVertexAttribPointer(normal, 3, GL_FLOAT, GL_FALSE, 0, 0);

		GLuint cameraPosition = glGetAttribLocation(refShader.Program, "cameraPosition");
		glEnableVertexAttribArray(cameraPosition);
		glVertexAttribPointer(cameraPosition, 3, GL_FLOAT, GL_FALSE, 0, 0);

		GLuint lightPosition = glGetAttribLocation(refShader.Program, "light_position");
		glEnableVertexAttribArray(lightPosition);
		glVertexAttribPointer(lightPosition, 3, GL_FLOAT, GL_FALSE, 0, 0);

		GLuint lightPosition2 = glGetAttribLocation(refShader.Program, "light_position2");
		glEnableVertexAttribArray(lightPosition2);
		glVertexAttribPointer(lightPosition2, 3, GL_FLOAT, GL_FALSE, 0, 0);


		//set teapot matrices

		view = camera.viewMat();
		//view = glm::translate(view, glm::vec3(0.0f,-1.0f,-3.0f));
		//view = view * rotation;
		model = glm::mat4(1.0f);
		model = glm::translate(model, glm::vec3(0.0f, -0.5f, 0.0f));
		glm::vec3 light_position = glm::vec3(0.0f, 300.0f, -300.0f);
		glm::vec3 light_position2 = glm::vec3(0.0f, 300.0f, -300.0f);

		refShader.setMat4("projection", projection);
		refShader.setMat4("view", view*rotation);
		refShader.setMat4("model", model);
		refShader.setVec3("cameraPosition", camera.pos);
		refShader.setVec3("light_position", light_position);
		refShader.setVec3("light_position2", light_position2);

		astronaut.Draw(vertex, normal);
		glBindVertexArray(0);

		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  SKYBOX  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		envShader.Use();

		//Grab locations of attributes
		GLuint cubeMapPosition = glGetAttribLocation(envShader.Program, "cubeMapPosition");
		glEnableVertexAttribArray(cubeMapPosition);
		glVertexAttribPointer(cubeMapPosition, 3, GL_FLOAT, GL_FALSE, 0, 0);

		//set skybox matrices
		view = glm::mat4(camera.viewMat());
		model = glm::mat4(1.0f);
		model = glm::scale(glm::mat4(1.0f), glm::vec3(500, 500, 500));
		envShader.setMat4("projection", projection);
		envShader.setMat4("view", view);
		envShader.setMat4("model", model*rotation);
		

		//Set up textures
		//glActiveTexture(GL_TEXTURE0);
		glBindVertexArray(VAOs[Skybox]);
		glBindTexture(GL_TEXTURE_CUBE_MAP, Textures[SkyboxTexture]);
		glDrawArrays(GL_TRIANGLES, 0, 36);
		glBindVertexArray(0);

		

		glDepthMask(GL_LESS);

	//----------------------------------------------
}



//=====================================================================
// Cameras and callbacks
//=====================================================================
// The camera is in a continuous orbit.
// Place the mouse over the window to draw the scene.
// Move the mouse over the window to rotate the object in the scene.
// The escape key exits
//-------------------------------------------------------------

void KeyCallback(GLFWwindow *window, int key, int scan, int act, int mode)
{
    //escape with escape key
	if (key == GLFW_KEY_ESCAPE && act == GLFW_PRESS)
		glfwSetWindowShouldClose(window, GL_TRUE);


    if (key == GLFW_KEY_UP && act == GLFW_PRESS)
    {

    }

    if (key == GLFW_KEY_DOWN && act == GLFW_PRESS)
    {

    }

    if (key == GLFW_KEY_LEFT && act == GLFW_PRESS)
    {

    }

    if (key == GLFW_KEY_RIGHT && act == GLFW_PRESS)
    {

    }

    //updating keys table 
    if (act == GLFW_PRESS)
        keys[key] = true;
    else if (act == GLFW_RELEASE)
        keys[key] = false;

}

// controlling camera ad object orientation
void MouseCallback(GLFWwindow *window, double xPosition, double yPosition)
{
    //first time being encountered
    if (firstMouse)
    {
        lastX = xPosition;
        lastY = yPosition;
        firstMouse = false;
    }
    
    //finding change
    GLfloat deltaX = xPosition - lastX;
    GLfloat deltaY = lastY - yPosition;

    //updating last coords
    lastX = xPosition;
    lastY = yPosition;

    camera.mouseIn(deltaX, deltaY);
}

// controlling camera movement
void ScrollCallback(GLFWwindow *window, double deltaX, double deltaY)
{
    camera.mouseScroll(deltaY);
}


// controlling camera movement
void KeyMovement()
{
    //simple forwards, backwards and strafe
    //handled by camera object
    if (keys[GLFW_KEY_W])
        camera.keyIn(FORWARD, deltaTime);
    if (keys[GLFW_KEY_S])
        camera.keyIn(BACKWARD, deltaTime);
    if (keys[GLFW_KEY_A])
        camera.keyIn(LEFT, deltaTime);
    if (keys[GLFW_KEY_D])
        camera.keyIn(RIGHT, deltaTime);
    if (keys[GLFW_KEY_SPACE])
        camera.keyIn(UP, deltaTime);
    if (keys[GLFW_KEY_LEFT_CONTROL])
        camera.keyIn(DOWN, deltaTime);
}

//=====================================================================
// GenerateCubeMapTexture
//=====================================================================
GLuint GenerateCubeMapTexture(GLuint textureId)
{
	// TO DO:
	// Set-up Cubemap: Load all the cubemap textures. Use the SOIL API  
	// 
	// 1. Call SOIL_load_OGL_cubemap (SOIL.c) with the images from data/images
	//   you are provided with the St. Peter's cubemap images but you can also
	//   use other examples from online or your own images.
    // ---------------------------------------------------------------------
		GLuint textureID;
		glActiveTexture(GL_TEXTURE0);
		glEnable(GL_TEXTURE_CUBE_MAP);
		glGenTextures(1, &textureID);
		glBindTexture(GL_TEXTURE_CUBE_MAP, textureID);
		glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
		glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
		glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
		glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
		glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_R, GL_CLAMP_TO_EDGE);


		int width, height;
		unsigned char* image;

		
		std::vector<const GLchar *> faces;
		/*faces.push_back("../../data/images/blood_posx.jpg");
		faces.push_back("../../data/images/blood_negx.jpg");
		faces.push_back("../../data/images/blood_posy.jpg");
		faces.push_back("../../data/images/blood_negy.jpg");
		faces.push_back("../../data/images/blood_posz.jpg");
		faces.push_back("../../data/images/blood_negz.jpg");*/
		
		
		faces.push_back("../../data/images/posx.jpg");
		faces.push_back("../../data/images/negx.jpg");
		faces.push_back("../../data/images/posy.jpg");
		faces.push_back("../../data/images/negy.jpg");
		faces.push_back("../../data/images/posz.jpg");
		faces.push_back("../../data/images/negz.jpg");

		for (GLuint i = 0; i < faces.size();i++) {
			image = SOIL_load_image(faces[i], &width, &height, 0, SOIL_LOAD_RGB);
			if (image == 0) return textureId;
			glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
			SOIL_free_image_data(image);
		}
		
		
		
		glBindTexture(GL_TEXTURE_CUBE_MAP, 0);
		return textureID;
	// ---------------------------------------------------------------------

}


//----------------------------------------------------
// Check OpenGL support in for SOIL
//--------------------------------------------------
void SetSoilCapabilties(void)
{
	SOIL_update_cubemap_capability(0);
	SOIL_update_dxt_capability(0);
	SOIL_update_tex_rectangle_capability(0);
	SOIL_update_NPOT_capability(0);

	// update the cubemap status
	GLint n, i;
	glGetIntegerv(GL_NUM_EXTENSIONS, &n);
	for (i = 0; i < n; i++) {
		//printf("%s\n", glGetStringi(GL_EXTENSIONS, i));
		const char* extension = (const char*)glGetStringi(GL_EXTENSIONS, i);
		if ((!strcmp("GL_ARB_texture_cube_map", extension)) || (!strcmp("GL_EXT_texture_cube_map", extension)))
			SOIL_update_cubemap_capability(1);
		if (!strcmp("GL_EXT_texture_compression_s3tc", extension))
			SOIL_update_dxt_capability(1);
		if ((!strcmp("GL_ARB_texture_rectangle", extension)) || (!strcmp("GL_EXT_texture_rectangle", extension)) || (!strcmp("GL_NV_texture_rectangle", extension)))
			SOIL_update_tex_rectangle_capability(1);
		if ((!strcmp("GL_ARB_texture_non_power_of_two", extension)) || (!strcmp("GL_OES_texture_npot", extension)))
			SOIL_update_NPOT_capability(1);
	}

}


//----------------------------------------------------
// Main entry point
// Manages all OpenGL draw calls and main loop
//----------------------------------------------------
int main()
{

	//instantiating the window
	//---------------------------------------
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 2);
#ifdef __APPLE__
	glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
#endif
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);


	// create the window
	GLFWwindow* window = glfwCreateWindow(windowLength, windowHeight, "Environment Mapping", nullptr, nullptr);
	if (window == nullptr)
	{
		std::cout << "Could not create the window." << std::endl;
		glfwTerminate();
		return -1;
	}

	// make context
	glfwMakeContextCurrent(window);


	// associate callbacks
	//--------------------------------------------------------------
	glfwSetKeyCallback(window, KeyCallback);
	glfwSetCursorPosCallback(window, MouseCallback);
	glfwSetScrollCallback(window, ScrollCallback);


	// set the input mode
	//---------------------------------------------------------------
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);


	// Init GLEW
	//--------------------------------------------------------------
	glewExperimental = GL_TRUE;
	if (glewInit() != GLEW_OK)
	{
		std::cout << "GLEW not initialized." << std::endl;
		return -1;
	}

	// OpenGL Window and viewport parameter setup
	int widthBuff, heightBuff;
	glfwGetFramebufferSize(window, &widthBuff, &heightBuff);
	glViewport(0, 0, widthBuff, heightBuff);


	// Make sure we can use cube mapping and
	// other OpenGL functions with SOIL
	SetSoilCapabilties();


	// Init OpenGL geometry and buffers
	init();

	// loop and display as long as the window is open
	while (!glfwWindowShouldClose(window))
	{
		//deltaTime is used to calculate camera movement frame independently
		GLfloat currentFrame = glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		// update display
		std::cout << "Width: " << widthBuff << " Height: " << heightBuff << std::endl;

		// draw
		display(widthBuff, heightBuff);

		// swap buffers
		glfwSwapBuffers(window);

		// io and callbacks
		glfwPollEvents();
		KeyMovement();

	}


	// TO DO - Clean-up your vertex arrays here
	// glDeleteVertexArrays
	//--------------------------------------------

	//--------------------------------------------

	// cleanup window
	glfwDestroyWindow(window);

	// end process
	glfwTerminate();

	// return
	return 0;
}




//sources
//http://antongerdelan.net/opengl/cubemaps.html
//https://learnopengl.com/Advanced-OpenGL/Cubemaps
//http://ogldev.atspace.co.uk/www/tutorial25/tutorial25.html
//https://gamedev.stackexchange.com/questions/60313/implementing-a-skybox-with-glsl-version-330
//https://open.gl/textures
//https://stackoverflow.com/questions/15735837/textures-not-displaying-correctly-c-opengl-soil
//http://in2gpu.com/2014/06/23/toon-shading-effect-and-simple-contour-detection/








