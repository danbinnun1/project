import { useEffect, useState } from "react";

export default function RecepientsList(props: any) {
    const [newRecepient, setNewRecepient] = useState();
    return <div>
        <form>
        <h2>Poll Participants</h2>
            <label className="label_register_login">Participant's phone number:</label>
            <input onChange={(e: any) => {
                setNewRecepient(e.target.value);
            }} className="input_register_login" type="text" />
            <button onClick={(e: any) => {
                e.preventDefault();
                if (!newRecepient){
                    alert('cannot be empty');
                    return;
                }
                props.add(newRecepient);
            }} className="button_submit" type="submit">
                Add Participant
            </button>
        </form>
        <table> {props.recepients.map((recepient: any) => (
            <Recepient name={recepient} remove={props.remove}></Recepient>))}
        </table>
    </div>
}

function Recepient(props: any) {
    return <tr><th>{props.name}</th>
        <th><button className="button_submit" onClick={() => props.remove(props.name)}>Remove Participant</button></th></tr>
}