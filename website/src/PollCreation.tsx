import useState from 'react-usestateref';
import Vertex from "./Vertex";

export default function PollCreation() {
    const [vertexes, setVertexes, vertexesRef]=useState<{x:number, y:number}[]>([{x:0,y:0}]);

    function positionChanged(x:number,y:number,index:number){

        let newVertexes=[...vertexesRef.current];
        newVertexes[index].x=x;
        newVertexes[index].y=y;
        setVertexes(newVertexes);
    }

    function onMouseUp(index: number){
        let newVertexes=[...vertexesRef.current];
        if (index===0){
            newVertexes.unshift({x:0,y:0});
            index++;
        }
        if (newVertexes[index].y>window.innerHeight*0.8||newVertexes[index].x>window.innerWidth*0.8){
            newVertexes.splice(index,1);
        }
        setVertexes(newVertexes);
    }
    
    return <div style={{width:'80%', height:'80%', position:'absolute', backgroundColor:'red'}}>
        {vertexesRef.current.map((vertex, id)=>(
            <Vertex x={vertex.x} y={vertex.y} id ={id} positionChanged={positionChanged}
            onMouseUp={onMouseUp}></Vertex>
        ))}
    </div>
}


