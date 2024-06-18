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
        let D = [];
        let visited = [];
    
        for (let i = 0; i < numVertices; i++) {
            D[i] = inf;
            visited[i] = false;
        }
    
        const start = this.#map.get(startVertex);
        const end = this.#map.get(endVertex);
        D[start] = 0;
    
        let notVisited = [];
        for (let i = 0; i < numVertices; i++) {
            notVisited.push(i);
        }
    
        let continueAlgorithm = true;
    
        while (continueAlgorithm) {
            let u = null;
            let minDistance = inf;
    

            for (let i = 0; i < numVertices; i++) {
                if (!visited[i] && D[i] < minDistance) {
                    minDistance = D[i];
                    u = i;
                }
            }
    
            if (u === null) {
                continueAlgorithm = false; 
            } else {
                visited[u] = true;
    
                const neighborsLinkedList = this.#listAdyacencia[u];
                let current = neighborsLinkedList.getHead();
    
                while (current) {
                    const neighbor = this.#map.get(current.value.node);
                    const weight = current.value.weight;
    
                    if (!visited[neighbor] && D[u] + weight < D[neighbor]) {
                        D[neighbor] = D[u] + weight;
                    }
                    current = current.next;
                }
            }
        }
    
        return D[end];
    }
}
