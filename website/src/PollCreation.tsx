import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import useState from 'react-usestateref';
import Edge from './Edge';
import Vertex from "./Vertex";
import { DropDownList } from "@progress/kendo-react-dropdowns";


async function toBase64(file: File) {
    return await new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log(reader.result);
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    })
}
export default function PollCreation(props: any) {
    let params = useParams();
    let location = useLocation();

    useEffect(() => {
        async function fetchData() {
            const searchParams = new URLSearchParams(location.search);
            if (searchParams.has('poll')) {
                let response = await fetch("http://localhost:5019/poll?username=" + params.username + "&name=" + searchParams.get('poll'));
                let poll = await response.json();
                setVertexes(Object.values(poll.poll.vertexes).map((v: any) => ({ ...v, dragging: false })) as any);
                setExisting(true);
                setStart(poll.poll.start);
                setPollName(poll.name);
                set_id(poll._id);
                let edges = [];

                for (let i = 0; i < Object.keys(poll.poll.vertexes).length; i++) {
                    for (let e of poll.poll.edges[i]) {
                        edges.push({ src: i, dest: e.to, text: e.question, category: (!!e.category)?e.category:'' });
                    }
                }
                setEdges(edges);

            }
        }
        fetchData();
    }, [location]);

    const [_id, set_id] = useState('');
    const [existing, setExisting] = useState(false);
    const [vertexes, setVertexes, vertexesRef] = useState<{
        x: number, y: number,
        dragging: boolean, text: string, id: number, image?: any
    }[]>([]);
    const [edges, setEdges, edgesRef] = useState<{ src: number, dest: number, text: string, category: string }[]>([]);
    const [addingEdge, setAddingEdge] = useState(false);
    const [selectedVertex, setSelectedVertex] = useState(-1);
    const [selectedEdge, setSelectedEdge] = useState(-1);
    const [vertexName, setVertexName] = useState('');
    const [edgeName, setEdgeName] = useState('');
    const [pollName, setPollName] = useState('');
    const [done, setDone] = useState(false);
    const [start, setStart] = useState(-1);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<string[]>(['no category']);

    const vertexSize = 50;

    function positionChanged(x: number, y: number, id: number) {
        if (y + vertexSize >= window.innerHeight * 0.9 ||
            y <= window.innerHeight * 0.1 ||
            x + vertexSize >= window.innerWidth * 0.8) {
            return;
        }
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
                        <input disabled={selectedVertex === -1} onChange={(e: any) => {
                            setVertexName(e.target.value);
                            let newVertexes = [...vertexesRef.current];
                            const index = vertexById(selectedVertex);
                            newVertexes[index].text = e.target.value;
                            setVertexes(newVertexes);
                        }} value={vertexName}></input>
                        <br></br>
                        <input disabled={selectedVertex === -1} type='checkbox' checked={selectedVertex === start} onChange={() => {
                            if (selectedVertex === start) {
                                setStart(-1);
                            }
                            else {
                                setStart(selectedVertex);
                            }
                        }}></input>
                        <input disabled={selectedVertex === -1}
                            type='file'
                            onChange={async (event: any) => {
                                if (selectedVertex !== -1) {
                                    let newVertexes = [...vertexesRef.current];
                                    const index = vertexById(selectedVertex);
                                    newVertexes[index].image = await toBase64(event.target.files[0]);
                                    setVertexes(newVertexes);
                                }
                            }}
                        >
                        </input>
                        {
                            selectedVertex !== -1 && !!vertexesRef.current[vertexById(selectedVertex)].image ?
                                (<img alt="not found" width={"250px"}
                                    src={vertexesRef.current[vertexById(selectedVertex)].image} />) : null

                        }
                        <button disabled={selectedVertex === -1} onClick={() => {
                            let newVertexes = [...vertexesRef.current];
                            newVertexes = newVertexes.filter(item => item.id !== selectedVertex);
                            const newEdges = edgesRef.current.filter(item => item.src !== selectedVertex
                                && item.dest !== selectedVertex);
                            setEdges(newEdges);
                            setVertexes(newVertexes);
                            setSelectedVertex(-1);
                        }}>remove</button>

                    </th>
                </tr>
                <tr style={{
                    width: '100%', height: '50%',
                }}>
                    <th style={{
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'
                    }}>
                        <input disabled={selectedEdge === -1} onChange={(e: any) => {
                            setEdgeName(e.target.value);
                            let newEdges = [...edgesRef.current];
                            newEdges[selectedEdge].text = e.target.value;
                            setEdges(newEdges);
                        }} value={edgeName}></input>
                        <button disabled={selectedEdge === -1} onClick={() => {
                            let newEdges = [...edgesRef.current];
                            newEdges.splice(selectedEdge, 1);
                            setSelectedEdge(-1);
                            setEdges(newEdges);
                        }}>remove</button>
                        <button disabled={selectedEdge === -1} onClick={() => {
                            const temp = edgesRef.current[selectedEdge].src;
                            let newEdges = [...edgesRef.current];
                            newEdges[selectedEdge].src = newEdges[selectedEdge].dest;
                            newEdges[selectedEdge].dest = temp;
                            setEdges(newEdges);
                        }}>
                            switch direction
                        </button>
                        <br></br>
                        <select disabled={selectedEdge === -1}
                            value={selectedEdge===-1? '': edgesRef.current[selectedEdge].category} onChange={(e: any) => {
                                let newEdges = [...edgesRef.current];
                                newEdges[selectedEdge].category = e.target.value;
                                setEdges(newEdges);
                            }}>
                            {categories.map(category => (
                                <option value={category}>{category}</option>
                            ))}
                        </select>
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
                            if (newVertexes.length === 1) {
                                setSelectedVertex(newVertexes[0].id);
                            }
                            setVertexes(newVertexes);
                        }}></div>
                    </th>
                    <th style={{
                        width: '20%', height: '100%',
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'
                    }}><button onClick={() => {
                        setAddingEdge(true);
                        setSelectedVertex(-1);
                    }}>Add edge</button></th>
                    <th style={{
                        width: '20%', height: '100%',
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'
                    }}><button onClick={() => {
                        setDone(true);
                    }}>cancel</button></th>
                    <th style={{
                        width: '20%', height: '100%',
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'
                    }}>
                        {existing ? null : <input onChange={(e: any) => {
                            setPollName(e.target.value);
                        }}></input>}
                        <button onClick={async () => {
                            let poll: any = { vertexes: {}, edges: {}, start };
                            for (let vertex of vertexesRef.current) {
                                poll.vertexes[vertex.id] = vertex;
                                if (vertex.image) {
                                    poll.vertexes[vertex.id].image = vertex.image;
                                }
                                console.log(1234);
                                poll.edges[vertex.id] = [];
                                for (const edge of edgesRef.current) {
                                    if (edge.src === vertex.id) {
                                        poll.edges[vertex.id].push({
                                            question: edge.text,
                                            to: vertexesRef.current[edge.dest].id
                                        });
                                    }
                                }
                            };
                            if (existing) {
                                const pollData = {
                                    poll, username: params.username,
                                    name: pollName,
                                    submissions: [], recepients: [],
                                    _id, status: 'NOT_ACTIVE'
                                };
                                fetch("http://localhost:5019/poll", {
                                    method: "PUT",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(pollData)
                                });
                            }
                            else {
                                const pollData = {
                                    poll, username: params.username,
                                    name: pollName,
                                    submissions: [], recepients: [],
                                    status: 'NOT_ACTIVE'
                                };
                                fetch("http://localhost:5019/poll", {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(pollData)
                                });
                            }

                            setDone(true);
                        }}>submit</button>
                    </th>
                    <th style={{
                        width: '20%', height: '100%',
                        borderWidth: '1px', borderColor: 'black', borderStyle: 'solid'
                    }}>
                        <input onChange={(e: any) => {
                            setCategory(e.target.value);
                        }}></input>
                        <button onClick={() => {
                            let newCategories = [...categories];
                            newCategories.push(category);
                            setCategory('');
                            setCategories(newCategories)
                        }}>add category</button>
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
                height={40}
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
                        newEdges.push({ src: selectedVertex, dest: vertex.id, text: '', category: '' });
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


