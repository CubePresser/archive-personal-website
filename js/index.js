/**
 * @author jonesjonathan / www.github.com/jonesjonathan
 */

var scene, camera, renderer;

function init_scene()
{
    scene = new THREE.Scene();
}

function init_camera()
{
// PerspectiveCamera (FOV, Aspect Ratio, near clipping plane, far clipping plane)
    // Clipping plane: Objects further away than far or closer than near will not render
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
}

function init_renderer()
{
    //Where the magic happens
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function animate()
{
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

//Check if WEBGL is available on the current browser
if (WEBGLTest.isWebGLAvailable()) 
{
    init_scene();
    init_camera();
    init_renderer();
    animate();
} 
else 
{
    var warning = WEBGLTest.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}