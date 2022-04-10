import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import RecepientsList from "./RecepientsList";


export default function Poll() {
    const [value, setValue] = useState(0); // for rerendering
    let params = useParams();
    let [poll, setPoll] = useState<any>();
    useEffect(() => {
        async function fetchData() {
            let response = await fetch("http://localhost:5019/poll?username=" + params.username + "&name=" + params.pollName);
            let responseJson = await response.json();
            setPoll(responseJson);
        }
        fetchData();
    }, [value]);
    const removeRecepient = async (recepient: any) => {
        const index = poll.recepients.indexOf(recepient);
        const newPoll = JSON.parse(JSON.stringify(poll));
        newPoll.recepients = [...poll.recepients.slice(0, index), ...poll.recepients.slice(index + 1)];
        await fetch("http://localhost:5019/poll", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPoll)
        })
        setValue(value => value + 1);
    }
    const addRecepient = async (recepient: any) => {
        const newPoll = JSON.parse(JSON.stringify(poll));
        newPoll.recepients.push(recepient);
        await fetch("http://localhost:5019/poll", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPoll)
        });
        setValue(value => value + 1);
    }
    const startPoll = async ()=>{
        await fetch("http://localhost:5019/send_poll?username="+params.username+"&name="+params.pollName);
        setValue(value => value + 1);
    }
    return (
        <div>
            {(() => {
                if (poll) {
                    return (
                        <button onClick={startPoll}>start</button>
                    )
                }
            })()}
            <RecepientsList remove={removeRecepient} add={addRecepient} recepients={poll === undefined ? [] : poll.recepients}></RecepientsList>
        </div>
    )
}