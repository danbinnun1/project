import React from "react";
import { useEffect, useRef } from "react";
import useState from 'react-usestateref';


interface State {
    x: number;
    y: number;
    relX: number;
    relY: number;
    previousDragging: boolean;
    dragging: boolean;
}

export default function Vertex() {
    const inputRef: any = useRef();
    const [state, setState, stateRef] = useState<State>({
        x: 500,
        y: 500,
        relX: 0,
        relY: 0,
        previousDragging: false,
        dragging: false
    })
    useEffect(() => {
        console.log(stateRef);
        if (!stateRef.current.previousDragging && stateRef.current.dragging) {
            console.log(4);
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
            setState({
                ...stateRef.current, previousDragging: true
            });
        }
        else if (stateRef.current.previousDragging && !stateRef.current.dragging) {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp);
            console.log(5);
            setState({
                ...stateRef.current, previousDragging: false
            });
        }
    }, [state]);
    const onMouseUp= React.useCallback (()=> {
        setState({
            ...(stateRef.current as any), dragging: false
        });
        console.log(inputRef.current);
    },[]);

    const onMouseMove= React.useCallback ((e: any)=> {
        if (!stateRef.current.dragging){
            return;
        }
        setState({
            ...stateRef.current, x: e.pageX-stateRef.current.relX, y: e.pageY-stateRef.current.relY
        });
        e.stopPropagation();
        e.preventDefault();
    },[]);

    function onMouseDown(e: any) {
        if (e.button !== 0) {
            return;
        }
        let posLeft = inputRef.current.offsetLeft;
        let posUp = inputRef.current.offsetTop;
        setState({
            ...stateRef.current, dragging: true, relX: e.pageX-posLeft, relY: e.pageY-posUp
        });
        e.stopPropagation();
        e.preventDefault();
    }

    return <div ref={inputRef} onMouseDown={onMouseDown} style={{backgroundColor:'blue', left: state.x + 'px', top: state.y + 'px', position: 'absolute' }}
    >1</div>

}