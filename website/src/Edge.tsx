import { url } from "inspector";

export default function Edge(props: any) {
    const middleX = (props.x1 + props.x2) / 2;
    const middleY = (props.y1 + props.y2) / 2;
    const length = Math.sqrt((props.x1 - props.x2) * (props.x1 - props.x2)
        + (props.y1 - props.y2) * (props.y1 - props.y2));
    let angle = Math.atan((props.y1 - props.y2) / (props.x1 - props.x2));
    if (props.x1 >= props.x2){
        angle += Math.PI;
    }
    return <div style={{
        height: props.height + 'px', width: length + 'px',
        left: middleX - length / 2 + 'px', top: middleY - props.height / 2 + 'px', position: 'absolute',
        transform: 'rotate(' + angle + 'rad)',
        border:props.selected?'3px solid green':'', backgroundImage: `url('/b.jpg')`
    }} onClick={props.onClick}
    ></div>
}