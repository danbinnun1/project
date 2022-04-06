import useState from 'react-usestateref';
import Edge from './Edge';
import Vertex from "./Vertex";

export default function PollCreation() {
    const [vertexes, setVertexes, vertexesRef] = useState<{ x: number, y: number, dragging: boolean }[]>([]);
    const [edges, setEdges, edgesRef] = useState<{ src: number, dest: number }[]>([]);
    const vertexSize = 30;

    function positionChanged(x: number, y: number, index: number) {

        let newVertexes = [...vertexesRef.current];
        newVertexes[index].x = x;
        newVertexes[index].y = y;
        setVertexes(newVertexes);
    }

    function onMouseUp(index: number) {
        let newVertexes = [...vertexesRef.current];
        if (newVertexes[index].y > window.innerHeight * 0.9 ||
            newVertexes[index].y < window.innerHeight * 0.1 ||
            newVertexes[index].x > window.innerWidth * 0.8) {
            newVertexes.splice(index, 1);
        }
        setVertexes(newVertexes);
    }

    return <div>
        <div style={{ width: '80%', height: '10%', position: 'absolute' }}>
            <table style={{
                width: '100%', height: '100%',
            }}>
                <tr style={{
                    width: '100%', height: '100%'
                }}>
                    <th style={{
                        width: '20%', height: '100%',
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid',
                        alignItems: 'center',
                        justifyItems: 'center',
                    }} align='center'>
                        <div style={{
                            borderRadius: '50%',
                            height: vertexSize + 'px',
                            width: vertexSize + 'px',
                            backgroundColor: 'blue',
                        }} id="12345" onMouseDown={() => {
                            const rect = document.getElementById("12345")?.getBoundingClientRect();
                            let newVertexes = [...vertexesRef.current];
                            newVertexes.push({ x: rect?.x as number, y: rect?.y as number ,
                            dragging:true});
                            setVertexes(newVertexes);
                        }}></div>
                    </th>
                    <th style={{
                        width: '20%', height: '100%',
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'
                    }}>2</th>
                </tr>
            </table>
        </div>
        <div style={{
            width: '80%', height: '80%', position: 'absolute',
            backgroundColor: 'red', transform: 'rotate(0deg)', top: '10%'
        }}>
        </div>
        {edges.map((edge) => (
            <Edge x1={vertexes[edge.src].x + vertexSize / 2} x2={vertexes[edge.dest].x + vertexSize / 2}
                y1={vertexes[edge.src].y + vertexSize / 2} y2={vertexes[edge.dest].y + vertexSize / 2} height={10}></Edge>
        ))}
        {vertexesRef.current.map((vertex, id) => (
            <Vertex size={vertexSize} x={vertex.x} y={vertex.y} id={id} positionChanged={positionChanged}
                onMouseUp={onMouseUp} dragging={vertex.dragging}></Vertex>
        ))}
    </div>
}


