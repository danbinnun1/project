import useState from 'react-usestateref';
import Edge from './Edge';
import Vertex from "./Vertex";

export default function PollCreation() {
    const [vertexes, setVertexes, vertexesRef] = useState<{ x: number, y: number, dragging: boolean, text: string, }[]>([]);
    const [edges, setEdges, edgesRef] = useState<{ src: number, dest: number, text: string }[]>([]);
    const [addingEdge, setAddingEdge] = useState(false);
    const [selectedVertex, setSelectedVertex] = useState(-1);
    const [selectedEdge, setSelectedEdge] = useState(-1);
    const [vertexName, setVertexName] = useState('');
    const [edgeName, setEdgeName] = useState('');
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
        <div style={{ width: '20%', height: '90%', left: '80%', position: 'absolute' }}>
            <table style={{ width: '100%', height: '100%' }}>
                <tr style={{
                    width: '100%', height: '50%',
                }}>
                    <th style={{ borderWidth: '1px', borderColor: 'black', borderStyle: 'solid' }}>
                        <input onChange={(e: any) => {
                            setVertexName(e.target.value);
                            let newVertexes = [...vertexesRef.current];
                            newVertexes[selectedVertex].text = e.target.value;
                            setVertexes(newVertexes);
                        }} value={vertexName}></input>
                    </th>
                </tr>
                <tr style={{
                    width: '100%', height: '50%',
                }}>
                    <th style={{
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'
                    }}>
                        <input onChange={(e: any) => {
                            setEdgeName(e.target.value);
                            let newEdges = [...edgesRef.current];
                            newEdges[selectedVertex].text = e.target.value;
                            setEdges(newEdges);
                        }} value={edgeName}></input>
                    </th>
                </tr>
            </table>
        </div>
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
                            newVertexes.push({
                                x: rect?.x as number, y: rect?.y as number,
                                dragging: true, text: ''
                            });
                            setVertexes(newVertexes);
                        }}></div>
                    </th>
                    <th style={{
                        width: '20%', height: '100%',
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'
                    }}><button onClick={() => {
                        setAddingEdge(true);
                    }}></button></th>
                </tr>
            </table>
        </div>
        <div style={{
            width: '80%', height: '80%', position: 'absolute',
            backgroundColor: 'red', transform: 'rotate(0deg)', top: '10%'
        }}>
        </div>
        {edges.map((edge, index) => (
            <Edge x1={vertexes[edge.src].x + vertexSize / 2} x2={vertexes[edge.dest].x + vertexSize / 2}
                y1={vertexes[edge.src].y + vertexSize / 2}
                y2={vertexes[edge.dest].y + vertexSize / 2}
                height={10}
                onClick={() => {
                    setSelectedEdge(index);
                    setEdgeName(edgesRef.current[index].text);
                }}
                selected={selectedEdge === index}></Edge>
        ))}
        {vertexesRef.current.map((vertex, id) => (
            <Vertex size={vertexSize} x={vertex.x} y={vertex.y} id={id} positionChanged={positionChanged}
                onMouseUp={onMouseUp} dragging={vertex.dragging}
                selected={selectedVertex === id}
                onClick={() => {
                    if (selectedVertex !== -1 && addingEdge) {
                        let newEdges = [...edgesRef.current];
                        newEdges.push({ src: selectedVertex, dest: id, text: '' });
                        setSelectedVertex(-1);
                        setAddingEdge(false);
                        setEdges(newEdges);
                        return;
                    }
                    setSelectedVertex(id);
                    setVertexName(vertexesRef.current[id].text);
                }}></Vertex>
        ))}
    </div>
}


