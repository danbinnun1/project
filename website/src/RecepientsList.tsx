import { useEffect, useState } from "react";

export default function RecepientsList(props: any) {
    const [newRecepient, setNewRecepient] = useState();
    return <div>
        <form>
            <label className="label">Name</label>
            <input onChange={(e: any) => {
                setNewRecepient(e.target.value);
            }} className="input" type="text" />
            <button onClick={(e: any) => {
                e.preventDefault();
                props.add(newRecepient);
            }} className="btn" type="submit">
                Submit
            </button>
        </form>
        <table> {props.recepients.map((recepient: any) => (
            <Recepient name={recepient} remove={props.remove}></Recepient>))}
        </table>
    </div>
}

function Recepient(props: any) {
    return <tr><th>{props.name}</th>
        <th><button onClick={() => props.remove(props.name)}>remove</button></th></tr>
}