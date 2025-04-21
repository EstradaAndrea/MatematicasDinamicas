        // ===================== EJERCICIO 4 - Bisección =====================
        
        // Inserta el valor pulsado en el input de función
        function insertar(valor) {
          const input = document.getElementById("funcion");
          input.value += valor;
      }

      // Elimina el último carácter del input de función
      function borrar() {
          const input = document.getElementById("funcion");
          input.value = input.value.slice(0, -1);
      }

      // Calcula el punto medio entre a y b
      function puntoMedio(a, b) {
          return (a + b) / 2;
      }

      // Transforma expresiones matemáticas en su equivalente en JavaScript
      function transformarExpresion(expresion) {
          return expresion
              .replace(/sin\(/g, 'Math.sin(')
              .replace(/cos\(/g, 'Math.cos(')
              .replace(/tan\(/g, 'Math.tan(')
              .replace(/log\(/g, 'Math.log(')
              .replace(/sqrt\(/g, 'Math.sqrt(')
              .replace(/pi/g, 'Math.PI')
              .replace(/e/g, 'Math.E')
              .replace(/(\w+)\^([\w\d]+)/g, 'Math.pow($1,$2)');
      }

      // Implementación del método de la bisección
      function Biseccion(f, a, b, n) {
          let salida = "";

          // Verifica si existe una raíz en el intervalo
          if (f(a) * f(b) >= 0) {
              return "No se puede aplicar el método de la bisección: f(a) * f(b) >= 0";
          }

          let medio;
          for (let i = 0; i < n; i++) {
              medio = puntoMedio(a, b);
              salida += `Iteración ${i + 1}. x = ${medio.toFixed(6)}, f(x) = ${f(medio).toFixed(6)}<br>`;

              if (f(medio) === 0) {
                  salida += `¡Raíz exacta encontrada!\nx = ${medio.toFixed(6)}`;
                  return salida;
              }

              if (f(a) * f(medio) < 0) {
                  b = medio;
              } else {
                  a = medio;
              }
          }
          salida += `Aproximación final:\nx ≈ ${medio.toFixed(6)}`;
          return salida;
      }

      // Función que recoge los valores del usuario y lanza el método
      function calcularBiseccion() {
          const expresionRaw = document.getElementById("funcion").value;
          const expresion = transformarExpresion(expresionRaw);
          const a = parseFloat(document.getElementById("a").value);
          const b = parseFloat(document.getElementById("b").value);
          const n = parseInt(document.getElementById("n").value);
          const salida = document.getElementById("resultado");

          try {
              const f = new Function("x", `return ${expresion}`);
              const resultado = Biseccion(f, a, b, n);
              salida.innerHTML = resultado;
          } catch (e) {
              salida.textContent = "Error al interpretar la función. Revisa la sintaxis.";
          }
      }

// ===================== EJERCICIO 5 - Canvas =====================

let puntos = [];
let ctxCanvas;

window.addEventListener("load", () => {
    const canvas = document.getElementById("canvasPoligono");
    if (canvas) {
        ctxCanvas = canvas.getContext("2d");
    }
});

function dibujarLineaPoligonal(event) {
    const canvas = document.getElementById("canvasPoligono");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    puntos.push({ x, y });

    document.getElementById("coordenadas").innerText = `(${x.toFixed(1)}, ${y.toFixed(1)})`;
    document.getElementById("contador").innerText = puntos.length;

    const color = document.getElementById("colorSelector").value;
    const grosor = parseFloat(document.getElementById("grosorSelector").value);

    ctxCanvas.strokeStyle = color;
    ctxCanvas.lineWidth = grosor;

    if (puntos.length > 1) {
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(puntos[puntos.length - 2].x, puntos[puntos.length - 2].y);
        ctxCanvas.lineTo(x, y);
        ctxCanvas.stroke();
    }

    ctxCanvas.fillStyle = color;
    ctxCanvas.beginPath();
    ctxCanvas.arc(x, y, grosor + 1, 0, 2 * Math.PI);
    ctxCanvas.fill();
}

function borrarCanvas1() {
    const canvas = document.getElementById("canvasPoligono");
    ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);
    puntos = [];
    document.getElementById("coordenadas").innerText = "";
    document.getElementById("contador").innerText = "0";
}

function cerrarPoligono() {
    if (puntos.length >= 3) {
        const color = document.getElementById("colorSelector").value;
        const grosor = parseFloat(document.getElementById("grosorSelector").value);

        ctxCanvas.strokeStyle = color;
        ctxCanvas.lineWidth = grosor;
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(puntos[puntos.length - 1].x, puntos[puntos.length - 1].y);
        ctxCanvas.lineTo(puntos[0].x, puntos[0].y);
        ctxCanvas.stroke();
    }
}

// ===================== EJERCICIO 6 - Intersección de rectas =====================

function inicializarInterseccionRectas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let points = [];
    let rectas = [];
  
    const escala = 15;
    const centro = 315;
    dibujarEjesCuadricula(canvas, ctx, centro, escala);
  
    document.getElementById("borrarTodo").addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dibujarEjesCuadricula(canvas, ctx, centro, escala);
      points = [];
      rectas = [];
      document.getElementById("resultado").innerText = "";
    });
  
    canvas.addEventListener("click", (e) => {
      if (points.length >= 4) return; // máximo 4 clics totales
  
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      points.push({ x, y });
      drawPoint(ctx, { x, y }, "blue");
  
      if (points.length % 2 === 0) {
        const linea = points.slice(points.length - 2);
        rectas.push(linea);
        drawInfiniteLine(ctx, linea[0], linea[1], "black");
      }
  
      if (rectas.length === 2) {
        const mPoints = rectas.flat().map(p => coordCanvasToMath(p.x, p.y, centro, escala));
        const intersection = getIntersection(mPoints[0], mPoints[1], mPoints[2], mPoints[3]);
        if (intersection) {
          const pixel = coordMathToCanvas(intersection.x, intersection.y, centro, escala);
          drawPoint(ctx, pixel, "red");
          document.getElementById("resultado").innerText =
            `Intersección: (${intersection.x.toFixed(2)}, ${intersection.y.toFixed(2)})`;
        } else {
          document.getElementById("resultado").innerText =
            "Las rectas no se intersectan (son paralelas).";
        }
      }
    });

    const modoSelector = document.getElementById("modoSelector");
    const entradaPendientes = document.getElementById("entradaPendientes");

    modoSelector.addEventListener("change", () => {
    const modo = modoSelector.value;
    if (modo === "pendiente") {
        entradaPendientes.style.display = "block";
        canvas.style.pointerEvents = "none"; // desactiva clics en canvas
    } else {
        entradaPendientes.style.display = "none";
        canvas.style.pointerEvents = "auto"; // activa clics
    }
    });
  }  
  
  function coordCanvasToMath(x, y, centro, escala) {
    return {
      x: (x - centro) / escala,
      y: (centro - y) / escala
    };
  }
  
  function coordMathToCanvas(x, y, centro, escala) {
    return {
      x: centro + x * escala,
      y: centro - y * escala
    };
  }
  
  function drawPoint(ctx, p, color) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  function drawInfiniteLine(ctx, p1, p2, color) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = 10000;
    const norm = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / norm;
    const uy = dy / norm;
  
    const start = {
      x: p1.x - ux * length,
      y: p1.y - uy * length
    };
  
    const end = {
      x: p1.x + ux * length,
      y: p1.y + uy * length
    };
  
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  
  function getIntersection(p1, p2, p3, p4) {
    const a1 = p2.y - p1.y;
    const b1 = p1.x - p2.x;
    const c1 = a1 * p1.x + b1 * p1.y;
  
    const a2 = p4.y - p3.y;
    const b2 = p3.x - p4.x;
    const c2 = a2 * p3.x + b2 * p3.y;
  
    const det = a1 * b2 - a2 * b1;
    if (Math.abs(det) < 1e-10) return null;
  
    const x = (b2 * c1 - b1 * c2) / det;
    const y = (a1 * c2 - a2 * c1) / det;
  
    return { x, y };
  }
  
  function dibujarEjesCuadricula(canvas, ctx, centro, escala) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    for (let i = -20; i <= 20; i++) {
      const x = centro + i * escala;
      const y = centro - i * escala;
  
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = -20; i <= 20; i++) {
      if (i % 5 === 0 && i !== 0) {
        const x = centro + i * escala;
        ctx.fillText(i, x, centro + 3);
        ctx.beginPath();
        ctx.moveTo(x, centro - 4);
        ctx.lineTo(x, centro + 4);
        ctx.stroke();
      }
    }
  
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = -20; i <= 20; i++) {
      if (i % 5 === 0 && i !== 0) {
        const y = centro - i * escala;
        ctx.fillText(i, centro - 5, y);
        ctx.beginPath();
        ctx.moveTo(centro - 4, y);
        ctx.lineTo(centro + 4, y);
        ctx.stroke();
      }
    }
  
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centro, 0);
    ctx.lineTo(centro, canvas.height);
    ctx.stroke();
  
    ctx.beginPath();
    ctx.moveTo(0, centro);
    ctx.lineTo(canvas.width, centro);
    ctx.stroke();
  
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "bold 10px Arial";
    ctx.fillText("0", centro + 4, centro + 4);
  }
  
  function dibujarRectasDesdeFormula() {
    const m1 = parseFloat(document.getElementById("m1").value);
    const n1 = parseFloat(document.getElementById("n1").value);
    const m2 = parseFloat(document.getElementById("m2").value);
    const n2 = parseFloat(document.getElementById("n2").value);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const escala = 15;
    const centro = 315;
  
    // Borrar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarEjesCuadricula(canvas, ctx, centro, escala);
  
    // Dibujar rectas
    [ [m1, n1], [m2, n2] ].forEach(([m, n], i) => {
      const x1 = -20, x2 = 20;
      const y1 = m * x1 + n;
      const y2 = m * x2 + n;
      const p1 = coordMathToCanvas(x1, y1, centro, escala);
      const p2 = coordMathToCanvas(x2, y2, centro, escala);
      drawInfiniteLine(ctx, p1, p2, i === 0 ? "black" : "blue");
    });
  
    // Calcular intersección algebraicamente
    if (m1 === m2) {
      document.getElementById("resultado").innerText = "Las rectas son paralelas o coincidentes.";
      return;
    }
  
    const x = (n2 - n1) / (m1 - m2);
    const y = m1 * x + n1;
    const p = coordMathToCanvas(x, y, centro, escala);
    drawPoint(ctx, p, "red");
    document.getElementById("resultado").innerText =
      `Intersección: (${x.toFixed(2)}, ${y.toFixed(2)})`;
  }
  
// ===================== Ejercicio 7: Suma geométrica =====================

let suma = 0;
let nivel = 0;
let x = 0, y = 0, w = 400, h = 400;

function agregarFraccion() {
  const cuadro = document.getElementById("cuadro");
  const div = document.createElement("div");
  const fraccion = Math.pow(2, -(nivel + 1));
  suma += fraccion;

  // Reducción del tamaño del área
  if (nivel % 2 === 0) {
    w /= 2;
  } else {
    h /= 2;
  }

  div.className = "fraccion";
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.width = w + "px";
  div.style.height = h + "px";

  // Añadir texto si nivel < 6
  if (nivel < 6) {
    const label = document.createElement("span");
    label.className = "fraccion-texto";
    label.innerText = `1/${Math.pow(2, nivel + 1)}`;
    div.appendChild(label);
  }

  cuadro.appendChild(div);

  // Desplazar para el siguiente
  if (nivel % 2 === 0) {
    x += w;
  } else {
    y += h;
  }

  nivel++;
  document.getElementById("suma").innerText = `Suma actual: ${suma.toFixed(10)}`;
}

function reiniciarFracciones() {
  const cuadro = document.getElementById("cuadro");
  cuadro.innerHTML = ""; // Elimina los divs creados
  suma = 0;
  nivel = 0;
  x = 0;
  y = 0;
  w = 400;
  h = 400;
  document.getElementById("suma").innerText = "Suma actual: 0";
}

