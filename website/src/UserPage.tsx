
import { useState } from 'react';


export default function UserPage(props: any) {

    // States for registration
    const [content, setcontent] = useState('');



    // Handling the name change
    const handleContent = (e: any) => {
        setcontent(e.target.value);
    };



    // Handling the form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await fetch('http://localhost:5019/add_poll?username='+props.username+'&text='+content);
    };




    return (
        <div className="form">
            <div>
                <h1>hello {props.username}</h1>
            </div>


            <form>
                {/* Labels and inputs for form data */}
                <label className="label">content</label>
                <input onChange={handleContent} className="input"
                    value={content} type="text" />


                <button onClick={handleSubmit} className="btn" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}