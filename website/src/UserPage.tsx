
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


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
                        <th><Link to={"/poll/"+params.username+"/"+poll.name} className='btn btn-primary' >{poll.name}</Link>
                        </th>
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