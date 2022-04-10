import { Navigate, useParams } from 'react-router-dom';
import useState from 'react-usestateref';
import Edge from './Edge';
import Vertex from "./Vertex";

export default function PollCreation() {
    const [vertexes, setVertexes, vertexesRef] = useState<{ x: number, y: number, dragging: boolean, text: string, id: number }[]>([]);
    const [edges, setEdges, edgesRef] = useState<{ src: number, dest: number, text: string }[]>([]);
    const [addingEdge, setAddingEdge] = useState(false);
    const [selectedVertex, setSelectedVertex] = useState(-1);
    const [selectedEdge, setSelectedEdge] = useState(-1);
    const [vertexName, setVertexName] = useState('');
    const [edgeName, setEdgeName] = useState('');
    const [pollName, setPollName] = useState('');
    const [done, setDone] = useState(false);
    const [start, setStart] = useState(-1);
    
    const vertexSize = 50;
    let params = useParams();

    function positionChanged(x: number, y: number, id: number) {
        const index = vertexById(id);
        let newVertexes = [...vertexesRef.current];
        newVertexes[index].x = x;
        newVertexes[index].y = y;
        setVertexes(newVertexes);
    }

    function onMouseUp(id: number) {
        const index = vertexById(id);
        let newVertexes = [...vertexesRef.current];
        if (newVertexes[index].y > window.innerHeight * 0.9 ||
            newVertexes[index].y < window.innerHeight * 0.1 ||
            newVertexes[index].x > window.innerWidth * 0.8) {
            newVertexes = newVertexes.filter(item => item.id !== id);
            const newEdges = edgesRef.current.filter(item => item.src !== id && item.dest !== id);
            setEdges(newEdges);
        }
        setVertexes(newVertexes);
    }

    function vertexById(id: number) {
        return vertexesRef.current.findIndex((vertex) => vertex.id === id)
    }

    if (done) {
        return <Navigate to={'/userpage/' + params.username}></Navigate>
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
                            const index = vertexById(selectedVertex);
                            newVertexes[index].text = e.target.value;
                            setVertexes(newVertexes);
                        }} value={vertexName}></input>
                        <br></br>
                        <input type='checkbox' onChange={() => {
                            if (selectedVertex === start) {
                                setStart(-1);
                            }
                            else {
                                setStart(selectedVertex);
                            }
                        }}></input>
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
                            newEdges[selectedEdge].text = e.target.value;
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
                                dragging: true, text: '',
                                id: vertexesRef.current.length === 0 ? 0 : vertexesRef.current[vertexesRef.current.length - 1].id + 1
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
                    <th style={{
                        width: '20%', height: '100%',
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'
                    }}>
                        <input onChange={(e: any) => {
                            setPollName(e.target.value);
                        }}></input>
                        <button onClick={() => {
                            let poll: any = { vertexes: {}, edges: {} };
                            vertexesRef.current.forEach((vertex, index) => {
                                poll.vertexes[vertex.id] = vertex.text;
                                poll.edges[vertex.id] = []
                                for (const edge of edgesRef.current) {
                                    if (edge.src === vertex.id) {
                                        poll.edges[vertex.id].push({
                                            question: edge.text,
                                            to: vertexesRef.current[edge.dest]
                                        });
                                    }
                                }
                            });
                            const pollData = {
                                poll, username: params.username,
                                name: pollName, isActive: false,
                                submissions: [], recepients: []
                            };
                            fetch("http://localhost:5019/poll", {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(pollData)
                            });
                            setDone(true);
                        }}>submit</button>
                    </th>
                </tr>
            </table>
        </div>
        <div style={{
            width: '80%', height: '80%', position: 'absolute',
            backgroundColor: 'red', transform: 'rotate(0deg)', top: '10%'
        }}>
        </div>
        {edges.map((edge, index) => (
            <Edge x1={vertexes[vertexById(edge.src)].x + vertexSize / 2} x2={vertexes[vertexById(edge.dest)].x + vertexSize / 2}
                y1={vertexes[vertexById(edge.src)].y + vertexSize / 2}
                y2={vertexes[vertexById(edge.dest)].y + vertexSize / 2}
                height={10}
                onClick={() => {
                    setSelectedEdge(index);
                    setEdgeName(edgesRef.current[index].text);
                }}
                selected={selectedEdge === index}></Edge>
        ))}
        {vertexesRef.current.map((vertex, id) => (
            <Vertex size={vertexSize} x={vertex.x} y={vertex.y} id={vertex.id} positionChanged={positionChanged}
                onMouseUp={onMouseUp} dragging={vertex.dragging}
                selected={selectedVertex === vertex.id}
                onClick={() => {
                    if (selectedVertex !== -1 && addingEdge) {
                        let newEdges = [...edgesRef.current];
                        newEdges.push({ src: selectedVertex, dest: vertex.id, text: '' });
                        setSelectedVertex(-1);
                        setAddingEdge(false);
                        setEdges(newEdges);
                        return;
                    }
                    setSelectedVertex(vertex.id);
                    setVertexName(vertexesRef.current[vertexById(vertex.id)].text);
                }}></Vertex>
        ))}
    </div>
}


