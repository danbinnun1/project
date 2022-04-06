import useState from 'react-usestateref';
import Edge from './Edge';
import Vertex from "./Vertex";

export default function PollCreation() {
    const [vertexes, setVertexes, vertexesRef] = useState<{ x: number, y: number }[]>
        ([{ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 200, y: 200 }]);
    const [edges, setEdges, edgesRef] = useState<{ src: number, dest: number }[]>([{src:1, dest:2}]);
    const vertexSize = 30;

    function positionChanged(x: number, y: number, index: number) {

        let newVertexes = [...vertexesRef.current];
        newVertexes[index].x = x;
        newVertexes[index].y = y;
        setVertexes(newVertexes);
    }

    function onMouseUp(index: number) {
        let newVertexes = [...vertexesRef.current];
        if (index === 0) {
            newVertexes.unshift({ x: 0, y: 0 });
            index++;
        }
        if (newVertexes[index].y > window.innerHeight * 0.8 || newVertexes[index].x > window.innerWidth * 0.8) {
            newVertexes.splice(index, 1);
        }
        setVertexes(newVertexes);
    }

    return <div style={{ width: '80%', height: '80%', position: 'absolute', backgroundColor: 'red', transform: 'rotate(0deg)' }}>
        {edges.map((edge) => (
            <Edge x1={vertexes[edge.src].x + vertexSize / 2} x2={vertexes[edge.dest].x + vertexSize / 2}
                y1={vertexes[edge.src].y + vertexSize / 2} y2={vertexes[edge.dest].y + vertexSize / 2} height={10}></Edge>
        ))}
        {vertexesRef.current.map((vertex, id) => (
            <Vertex size={vertexSize} x={vertex.x} y={vertex.y} id={id} positionChanged={positionChanged}
                onMouseUp={onMouseUp}></Vertex>
        ))}
    </div>
}


