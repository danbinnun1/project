
import { useState } from 'react';


export default function UserPage() {

    // States for registration
    const [content, setcontent] = useState('');



    // Handling the name change
    const handleContent = (e: any) => {
        setcontent(e.target.value);
    };



    // Handling the form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await fetch('http://localhost:5019/register?id='+name+'&password=');
    };




    return (
        <div className="form">
            <div>
                <h1>User Page</h1>
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