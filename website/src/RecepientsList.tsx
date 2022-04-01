import { useEffect, useState } from "react";

export default function RecepientsList(props: any) {
    let [recepients, setRecepients] = useState<any[]>([]);
    useEffect(() => {
        async function fetchData() {
            let response = await fetch("http://localhost:5019/poll?username=" + props.username + "&pollName=" + props.pollName);
            let responseJson = await response.json();
            setRecepients(responseJson);
        }
        fetchData();
    },[]);
}