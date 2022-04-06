import React from "react";
import { useEffect, useRef } from "react";
import useState from 'react-usestateref';


interface State {
    relX: number;
    relY: number;
    previousDragging: boolean;
    dragging: boolean;
}

export default function Vertex(props: any) {
    const inputRef: any = useRef();
    const [state, setState, stateRef] = useState<State>({
        relX: 0,
        relY: 0,
        previousDragging: false,
        dragging: props.dragging
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
    const onMouseUp = React.useCallback(() => {
        setState({
            ...(stateRef.current as any), dragging: false
        });
        props.onMouseUp(props.id);
        console.log(inputRef.current);
    }, []);

    const onMouseMove = React.useCallback((e: any) => {
        if (!stateRef.current.dragging) {
            return;
        }
        props.positionChanged(e.pageX - stateRef.current.relX, e.pageY - stateRef.current.relY, props.id);
        e.stopPropagation();
        e.preventDefault();
    }, []);

    function onMouseDown(e: any) {
        if (e.button !== 0) {
            return;
        }
        let posLeft = inputRef.current.offsetLeft;
        let posUp = inputRef.current.offsetTop;
        setState({
            ...stateRef.current, dragging: true, relX: e.pageX - posLeft, relY: e.pageY - posUp
        });
        e.stopPropagation();
        e.preventDefault();
    }

    return <div ref={inputRef} onMouseDown={onMouseDown} style={{
        textAlign: 'center',
        borderRadius: '50%',
        height: props.size + 'px',
        width: props.size + 'px',
        backgroundColor: 'blue',
        left: props.x + 'px',
        top: props.y + 'px',
        position: 'absolute'
    }}
    ></div>

}