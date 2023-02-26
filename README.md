# RDF 3D
A force-directed FPS 3D RDF visualizer for the browser written in TypeScript with Three.js and N3.js

## [Try it online](https://langsamu.github.io/rdf-3d/)

## Run it locally
```bat
npm start
```

and navigate to [`localhost:8080`](http://localhost:8080/)

## Usage
### Loading RDF
#### From a remote URI
Put a URL-encoded URI in the fragment to load remote RDF.

**Remote URI MUST support both `text/turtle` and `CORS`.**

[Try it online](https://langsamu.github.io/rdf-3d/#https%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3DCONSTRUCT%2520WHERE%257B%253Fs%2520%253Fp%2520%253Fo%257D%2520OFFSET%25203000%2520LIMIT%2520100) or locally:
[`http://localhost:8080/#https%3A%2F%2Fquery.wikidata.org...`](http://localhost:8080/#https%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3DCONSTRUCT%2520WHERE%257B%253Fs%2520%253Fp%2520%253Fo%257D%2520OFFSET%25203000%2520LIMIT%2520100)
(This visualizes an arbitrary query from the Wikidata SPARQL endpoint.)

#### From a local file
Put an RDF file serialized as TURTLE in the `docs` folder and reference it by file name in the fragment:
[`http://localhost:8080/#FibonacciSequenceUntyped.ttl`](http://localhost:8080/#FibonacciSequenceUntyped.ttl)

### Layout
- Press `L` to toggle displaying node and edge labels.
- Press `,` to decrease edge length.
- Press `.` to increase edge length.

### Navigating
**Press `SHIFT` to toggle** between '[trackball](https://threejs.org/docs/#examples/en/controls/TrackballControls)' and '[fly](https://threejs.org/docs/#examples/en/controls/FlyControls)' controls.

#### Trackball (default)
- Click and drag with the mouse to rotate the visualized graph around its center.
- Right click and drag to pan the graph.
- Middle click and drag up and down or scroll to zoom.

#### Fly
- Move the mouse to look around (pan the camera).
- Click to move forward and right click to move back.
- Press `WASD` to move forward, back, right and left.
- Press `QE` to rotate right and left.
- Press `RF` to move up and down.
