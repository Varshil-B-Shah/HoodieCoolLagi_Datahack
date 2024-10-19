import React, { useRef, useEffect } from 'react'

const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;
  varying vec2 vTextureCoord;
  void main() {
    gl_Position = aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`

const fragmentShaderSource = `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vTextureCoord;

  vec3 colorA = vec3(0.0, 0.2, 0.0); // Dark green
  vec3 colorB = vec3(0.0, 1.0, 0.4); // Bright cybersecurity green
  vec3 colorC = vec3(0.0, 0.0, 0.0); // Black

  // Improved noise function for smoother results
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vTextureCoord;
    vec2 pos = uv * 2.0 - 1.0;
    pos.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.2;
    
    // Use multiple layers of noise for more organic look
    float n1 = snoise(uv * 3.0 + vec2(t, t * 0.5)) * 0.5 + 0.5;
    float n2 = snoise(uv * 5.0 - vec2(t * 0.7, t * 0.3)) * 0.5 + 0.5;
    float n3 = snoise(uv * 8.0 + vec2(t * 0.3, -t * 0.6)) * 0.5 + 0.5;
    
    float finalNoise = (n1 * 0.5 + n2 * 0.35 + n3 * 0.15);
    
    // Adjust the color mix to favor black (70%) over green (30%)
    vec3 color = mix(colorC, colorB, smoothstep(0.6, 0.9, finalNoise));
    
    // Add some subtle variation over time
    color += vec3(0.0, 0.05, 0.02) * sin(uTime * 0.5 + uv.y * 10.0);

    // Add a subtle glow effect
    float glow = max(0.0, 1.0 - length(pos));
    color += colorB * glow * 0.1;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}

export default function App() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl')

    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser may not support it.')
      return
    }

    const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource)

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        time: gl.getUniformLocation(shaderProgram, 'uTime'),
        resolution: gl.getUniformLocation(shaderProgram, 'uResolution'),
      },
    }

    const positions = [
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ]

    const textureCoordinates = [
      0.0,  1.0,
      1.0,  1.0,
      0.0,  0.0,
      1.0,  0.0,
    ]

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const textureCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

    let then = 0

    function render(now) {
      now *= 0.001  // convert to seconds
      const deltaTime = now - then
      then = now

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(programInfo.program)

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)

      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)
      gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord)

      gl.uniform1f(programInfo.uniformLocations.time, now)
      gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      requestAnimationFrame(render)
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      gl.deleteProgram(shaderProgram)
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-black">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#00ff66]">Cybersecurity Pulse</h1>
          <p className="text-xl max-w-lg mx-auto text-[#00cc66]">
            This React app features an animated cybersecurity-themed background effect using WebGL shaders.
          </p>
        </div>
      </div>
    </div>
  )
}