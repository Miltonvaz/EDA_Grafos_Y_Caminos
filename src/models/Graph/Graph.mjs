import LinkedList from "./LinkdeList.mjs";

export default class Graph {
    #listAdyacencia = [];
    #map = new Map();

    constructor() {}

    addVertex(vertex) {
        if (!this.#map.has(vertex)) {
            this.#listAdyacencia.push(new LinkedList());
            this.#map.set(vertex, this.#listAdyacencia.length - 1);
        }
    }

    addEdge(node1, node2, weight = 1) {
        if (this.#map.has(node1) && this.#map.has(node2)) {
            this.#listAdyacencia[this.#map.get(node1)].push(node2, weight);
        }
        return false;
    }

    dfs(startVertex, callback) {
        const visited = {};

        const dfsRecursive = (vertex) => {
            if (!this.#map.has(vertex)) {
                return;
            }

            callback(vertex);
            visited[vertex] = true;

            const neighborsLinkedList = this.#listAdyacencia[this.#map.get(vertex)];
            let current = neighborsLinkedList.getHead();
            while (current) {
                const neighborVertex = current.value.node;
                if (!visited[neighborVertex]) {
                    dfsRecursive(neighborVertex);
                }
                current = current.next;
            }
        };

        dfsRecursive(startVertex);
    }

    bfs(startVertex, callback) {
        if (!this.#map.has(startVertex)) {
            return;
        }

        const visited = {};
        const queue = [startVertex];

        const bfsRecursive = () => {
            if (queue.length === 0) {
                return;
            }

            const currentVertex = queue.shift();
            if (!visited[currentVertex]) {
                callback(currentVertex);
                visited[currentVertex] = true;

                const neighborsLinkedList = this.#listAdyacencia[this.#map.get(currentVertex)];
                let current = neighborsLinkedList.getHead();
                while (current) {
                    const neighborVertex = current.value.node;
                    if (!visited[neighborVertex]) {
                        queue.push(neighborVertex);
                    }
                    current = current.next;
                }
            }

            bfsRecursive();
        };

        bfsRecursive();
    }

    printGraph() {
        for (let [vertex, index] of this.#map.entries()) {
            const linkedList = this.#listAdyacencia[index];
            console.log(`${vertex} ->`);
            linkedList.print();
        }
    }

    getVertices() {
        return this.#map.keys();
    }

    getNeighbors(vertex) {
        const index = this.#map.get(vertex);
        if (index !== undefined) {
            return this.#listAdyacencia[index];
        }
        return null;
    }

    numVertices() {
        return this.#map.size;
    }
    
    dijkstra(startVertex, endVertex) {
        const inf = 1000000;
        const numVertices = this.numVertices();
        let D = [];   // Array para las distancias
        let L_p = []; // Lista de vértices no visitados
        let L = [];   // Lista de vértices visitados
        let V = [];   // Lista de todos los vértices
        
        // Llenar los arreglos D, L_p y V
        for (let i = 0; i < numVertices; i++) {
            D.push(inf);    // Inicializar todas las distancias como infinito
            L_p.push(i);    // Inicializar L_p con todos los vértices
            V.push(i);      // Llenar V con todos los vértices
        }
    
        const start = this.#map.get(startVertex);
        const end = this.#map.get(endVertex);
    
        D[start] = 0;
    
        console.log('Inicialización:');
        console.log('D:', D);
        console.log('L_p:', L_p);
        console.log('L:', L);
        console.log('V:', V);
        console.log('------------------');
    
        while (L.length < V.length) {
            // Encontrar vértice en L_p con la mínima distancia D
            let minDistance = inf;
            let minIndex = -1;
    
            // Recorrer L_p para encontrar el vértice con la mínima distancia
            for (let i = 0; i < L_p.length; i++) {
                const vertex = L_p[i];
                if (minIndex === -1 || D[vertex] < minDistance) {
                    minDistance = D[vertex];
                    minIndex = i;
                }
            }
    
            // Obtener u (vértice con mínima distancia) y moverlo a L (marcar como visitado)
            const u = L_p[minIndex];
            L.push(u);
    
            // Eliminar u de L_p sin usar filter
            L_p[minIndex] = L_p[L_p.length - 1];
            L_p.pop();
    
            // Actualizar las distancias de los vecinos de u
            const neighborsLinkedList = this.#listAdyacencia[u];
            let current = neighborsLinkedList.getHead();
    
            while (current) {
                const neighbor = this.#map.get(current.value.node);
                const weight = current.value.weight;
    
                if (L_p.includes(neighbor) && D[u] + weight < D[neighbor]) {
                    D[neighbor] = D[u] + weight;
                }
                current = current.next;
            }
    
            console.log('Iteración:');
            console.log('u:', u);
            console.log('D:', D);
            console.log('L_p:', L_p);
            console.log('L:', L);
            console.log('V:', V);
            console.log('------------------');
        }
    
        return D[end];
    }
    
    
}
