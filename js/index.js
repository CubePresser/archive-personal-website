/**
 * @author jonesjonathan / www.github.com/jonesjonathan
 */

var scene, canvas, camera, renderer, controls;

//Check if WEBGL is available on the current browser
if (WEBGLTest.isWebGLAvailable()) 
{
    init();
    animate();
} 
else 
{
    var warning = WEBGLTest.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}

function init()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0);

    //WebGL access setup
    canvas = document.createElement('canvas');
    gl = canvas.getContext('webgl');

    // PerspectiveCamera (FOV, Aspect Ratio, near clipping plane, far clipping plane)
    // Clipping plane: Objects further away than far or closer than near will not render
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({canvas: canvas, context: gl});
    renderer.setSize(window.innerWidth, window.innerHeight); //CHANGE RESOLUTION BASED ON WINDOW SIZE HERE
    document.body.appendChild(renderer.domElement);

    //ORBIT CONTROLS
    controls = new THREE.OrbitControls( camera );  
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.maxPolarAngle = 1.39626;
    controls.minPolarAngle = 1.39626;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.05;
    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 0, 2, 10 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize, false );

    initGeometry();
}

function initGeometry()
{
    let height = 100.0, width = 100.0, rows = 100, cols = 100;
    var grid = gridGeometry(height, width, rows, cols);
    grid.matrix.setPosition(new THREE.Vector3(-width / 2.0, 0.0,-height / 2.0));
    grid.matrixAutoUpdate = false;
    scene.add(grid);

    var plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshPhongMaterial({color: 0xff00aa, shininess: 30}));
    plane.translateY(-0.01);
    plane.rotateX(4.71239);
    scene.add(plane);

    var sphere = new THREE.Mesh( new THREE.SphereGeometry( 5, 10, 10 ), new THREE.MeshPhongMaterial({color: 0xff00aa, flatShading: true}));
    scene.add( sphere );

    var ambientLight = new THREE.AmbientLight(0x004444);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xff0055, 1.0);
    directionalLight.position.set( 0, height / 3, -height );
    scene.add(directionalLight);
}

function gridGeometry(height, width, rows, cols)
{
    var grid_geometry = new THREE.BufferGeometry();
    var vertices = new Float32Array(6*(rows + cols + 2)); //Perimeter

    var index = 0;
    for(let row = 0; row <= rows; row++)
    {
        //Left edge
        vertices[index++] = 0.0;
        vertices[index++] = 0.0;
        vertices[index++] = height - row*(height / rows);
        
        //Right edge
        vertices[index++] = width;
        vertices[index++] = 0.0;
        vertices[index++] = height - row*(height / rows);
    }
    for(let col = 0; col <= cols; col++)
    {
        //Top
        vertices[index++] = width - col*(width / cols);
        vertices[index++] = 0.0;
        vertices[index++] = 0.0;

        //Bottom
        vertices[index++] = width - col*(width / cols);
        vertices[index++] = 0.0;
        vertices[index++] = height;
    }

    grid_geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

    return new THREE.LineSegments(grid_geometry, new THREE.LineBasicMaterial( { color: 0x00ffff , linewidth: 5} ));
}

function animate()
{
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}