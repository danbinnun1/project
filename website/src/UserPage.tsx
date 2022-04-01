
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function UserPage() {
    let [polls, setPolls] = useState<any[]>([]);
    let params = useParams();

    useEffect(() => {
        async function fetchPolls() {
            let response = await fetch("http://localhost:5019/polls?username=" + params.username);
            let pollsJson = await response.json();
            setPolls(pollsJson);
        }
        fetchPolls();
    }, []);

    //let polls = await fetch("localhost:5019/polls?username="+params.username);

    return (
        <div>
            <table>
                {polls.map(poll => 
                    <tr>
                        <th>{poll.name}</th>
                        <th>{poll.recepients.map((recepient: any) => 
                            <div>
                            {recepient}<br></br></div>
                        )}</th>
                    </tr>
                )}
            </table>
        </div>
    );
}