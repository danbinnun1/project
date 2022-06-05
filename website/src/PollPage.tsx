import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import RecepientsList from "./RecepientsList";
import { PieChart } from 'react-minimal-pie-chart';



export default function Poll() {
    const pollTime = 1000000;
    const [value, setValue] = useState(0); // for rerendering
    let params = useParams();
    let [poll, setPoll] = useState<any>();
    let [time, setTime] = useState(-1);
    const [categories, setCategories] = useState<{
        [name: string]:
        { [result: string]: number }
    }>({});
    useEffect(() => {
        async function fetchData() {
            let response = await fetch("http://localhost:5019/poll?username=" + params.username + "&name=" + params.pollName);
            let responseJson = await response.json();
            setPoll(responseJson);
            let newCategories: any = {};
            for (let recepient in responseJson.submissions) {
                let submission = responseJson.submissions[recepient];
                for (let category in submission.categories) {
                    if (!newCategories[category]) {
                        newCategories[category] = {};
                    }
                    if (!newCategories[category][submission.categories[category]]) {
                        newCategories[category][submission.categories[category]] = 0;
                    }
                    newCategories[category][submission.categories[category]] += 1;
                }
            }
            setCategories(newCategories);
        }
        fetchData();
    }, [value]);
    useEffect(() => {
        if (!!poll && poll.status == 'ACTIVE') {
            setTimeout(async () => {
                let difference = poll.startTimeStamp - Date.now() + pollTime;
                if (difference < 0) {
                    await fetch("http://localhost:5019/poll", {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ...poll, status: 'FINISHED' })
                    })
                    setValue(value => value + 1);
                }
                else {
                    setTime(difference);
                }
            }, 10);
        }
    }, [poll, time, value]);
    const removeRecepient = async (recepient: any) => {
        const index = poll.recepients.indexOf(recepient);
        const newPoll = JSON.parse(JSON.stringify(poll));
        newPoll.recepients = [...poll.recepients.slice(0, index), ...poll.recepients.slice(index + 1)];
        await fetch("http://localhost:5019/poll", {
            method: "PUT",
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
    const startPoll = async () => {
        await fetch("http://localhost:5019/send_poll?username=" + params.username + "&name=" + params.pollName);
        setValue(value => value + 1);
    }
    return (
        <div>
            {!!poll ? 'status: ' + poll.status : null}
            <br></br>
            <a href={'/new_poll/' + params.username + '?poll=' + params.pollName}>edit</a>
            <br></br>
            {
                !!poll && poll.status === 'ACTIVE' ? (
                    <div>
                        <p>time left:</p>
                        hours: {Math.floor(time / (1000 * 3600))} minutes: {Math.floor(time / (1000 * 60) % 60)} seconds: {Math.floor(time / (1000) % 60)}
                        <br></br>
                    </div>
                ) : null
            }
            {
                !!poll && poll.status !== 'READY' ? (
                    <div>
                        <button onClick={async () => {
                            const newPoll = JSON.parse(JSON.stringify(poll));
                            newPoll.submissions = {};
                            newPoll.status = 'READY';
                            await fetch("http://localhost:5019/poll", {
                                method: "PUT",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(newPoll)
                            });
                            setValue(value => value + 1);
                        }}>reset</button>
                    </div>
                ) : null
            }

            {(() => {
                if (poll && poll.status === 'READY') {
                    return (
                        <button onClick={startPoll}>start</button>
                    )
                }
            })()}
            <RecepientsList remove={removeRecepient} add={addRecepient} recepients={poll === undefined ? [] : poll.recepients}></RecepientsList>
            {Object.keys(categories).map((category: any) => (
                <div>
                    <PieChart
                        data={Object.keys(categories[category])
                            .map((key) => ({
                                title: key,
                                value: categories[category][key], color: '#E38627'
                            }))}></PieChart>
                </div>
            ))}
        </div>
    )
}