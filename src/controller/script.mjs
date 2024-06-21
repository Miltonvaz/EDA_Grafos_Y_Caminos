import Graph from "../models/Graph/Graph.mjs";

const grafo = new Graph();
document.addEventListener('DOMContentLoaded', () => {
    const formEstacion = document.getElementById('formEstacion');
    const formArista = document.getElementById('formArista');
    const recorrerBtn = document.getElementById('recorrerBtn');
    const recorrerBFSBtn = document.getElementById('recorrerBFSBtn');
    const formCamino = document.getElementById('formCamino');
    const estacionesContainer = document.getElementById('estacionesContainer');
    const aristasTable = document.getElementById('aristasTable');
    const resultadoElement = document.getElementById('resultado');

    formEstacion.addEventListener('submit', (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombreEstacion').value.trim();

        if (nombre === '') {
            mostrarError("Debes ingresar un nombre de estación válido");
            return;
        }

        grafo.addVertex(nombre);

        actualizarListaEstaciones();
        limpiarFormularioEstacion();

        mostrarExito(`La estación "${nombre}" ha sido agregada exitosamente.`);
    });

    formArista.addEventListener('submit', (event) => {
        event.preventDefault();

        const nodoOrigen = document.getElementById('nodoOrigen').value.trim();
        const nodoDestino = document.getElementById('nodoDestino').value.trim();
        const pesoArista = parseFloat(document.getElementById('pesoArista').value.trim());

        if (nodoOrigen === '' || nodoDestino === '') {
            mostrarError("Debes ingresar nodos válidos para la arista");
            return;
        }

        if (isNaN(pesoArista) || pesoArista <= 0) {
            mostrarError("Debes ingresar un peso válido para la arista");
            return;
        }

        grafo.addEdge(nodoOrigen, nodoDestino, pesoArista);

        actualizarListaAristas();
        limpiarFormularioArista();

        mostrarExito(`La arista entre "${nodoOrigen}" y "${nodoDestino}" ha sido agregada exitosamente.`);
    });

    recorrerBtn.addEventListener('click', () => {
        resultadoElement.innerHTML = '';

        if (grafo.numVertices() === 0) {
            mostrarError("Agrega al menos una estación antes de realizar el recorrido.");
            return;
        }

        const startVertex = [...grafo.getVertices()][0];
        const visitedVertices = [];
        grafo.dfs(startVertex, (vertex) => {
            visitedVertices.push(vertex);
        });

        if (visitedVertices.length > 0) {
            mostrarRecorrido("Recorrido en profundidad", visitedVertices);
            mostrarExito("El recorrido en profundidad ha sido completado.");
        } else {
            mostrarError("No se ha realizado ningún recorrido en profundidad.");
        }
    });

    recorrerBFSBtn.addEventListener('click', () => {
        resultadoElement.innerHTML = '';

        if (grafo.numVertices() === 0) {
            mostrarError("Agrega al menos una estación antes de realizar el recorrido.");
            return;
        }

        const startVertex = [...grafo.getVertices()][0];
        const visitedVertices = [];
        grafo.bfs(startVertex, (vertex) => {
            visitedVertices.push(vertex);
        });

        if (visitedVertices.length > 0) {
            mostrarRecorrido("Recorrido en anchura", visitedVertices);
            mostrarExito("El recorrido en anchura ha sido completado.");
        } else {
            mostrarError("No se ha realizado ningún recorrido en anchura.");
        }
    });

    formCamino.addEventListener('submit', (event) => {
        event.preventDefault();
        const nodoOrigenCamino = document.getElementById('nodoOrigenCamino').value.trim();
        const nodoDestinoCamino = document.getElementById('nodoDestinoCamino').value.trim();
    
        if (nodoOrigenCamino === '' || nodoDestinoCamino === '') {
            mostrarError("Debes ingresar nodos válidos para calcular el camino más corto.");
            return;
        }
    
        const shortestDistance = grafo.dijkstra(nodoOrigenCamino, nodoDestinoCamino);
    
        if (shortestDistance === 1000000) {
            mostrarError(`No se encontró camino entre "${nodoOrigenCamino}" y "${nodoDestinoCamino}".`);
        } else {
            resultadoElement.innerHTML = `Camino más corto encontrado: ${shortestDistance}`;
            mostrarExito(`El camino más corto entre "${nodoOrigenCamino}" y "${nodoDestinoCamino}" es ${shortestDistance}.`);
        }
    });
    

    function mostrarRecorrido(tipoRecorrido, vertices) {
        let recorrido = vertices.join(' &#8594; ');

        resultadoElement.innerHTML = `<h4>${tipoRecorrido}</h4>${recorrido}`;
    }

    function actualizarListaEstaciones() {
        if (!estacionesContainer) {
            console.error("Elemento estacionesContainer no encontrado en el DOM.");
            return;
        }

        estacionesContainer.innerHTML = '';

        grafo.getVertices().forEach(estacion => {
            const estacionDiv = document.createElement('div');
            estacionDiv.textContent = estacion;
            estacionesContainer.appendChild(estacionDiv);
        });

        actualizarListaAristas();
    }

    function actualizarListaAristas() {
        if (!aristasTable) {
            console.error("Elemento aristasTable no encontrado en el DOM.");
            return;
        }
    
        const tbody = aristasTable.querySelector('tbody');
        tbody.innerHTML = '';
    
        grafo.getVertices().forEach(estacion => {
            const conexiones = grafo.getNeighbors(estacion);
            if (conexiones && !conexiones.isEmpty()) {
                let row = document.createElement('tr');
    
                let estacionCell = document.createElement('td');
                estacionCell.textContent = estacion;
                row.appendChild(estacionCell);
    
                let conexionesCell = document.createElement('td');
                let conexionesText = '';
                let current = conexiones.getHead(); 
                while (current) {
                    conexionesText += `${current.value.node} (weight: ${current.value.weight})<br>`;
                    current = current.next;
                }
                conexionesCell.innerHTML = conexionesText;
                row.appendChild(conexionesCell);
    
                tbody.appendChild(row);
            }
        });
    }

    function limpiarFormularioEstacion() {
        document.getElementById('nombreEstacion').value = '';
    }

    function limpiarFormularioArista() {
        document.getElementById('nodoOrigen').value = '';
        document.getElementById('nodoDestino').value = '';
        document.getElementById('pesoArista').value = '';
    }

    function mostrarError(mensaje) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: mensaje,
        });
    }

    function mostrarExito(mensaje) {
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: mensaje,
        });
    }
});
