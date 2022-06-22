
import { useState } from 'react';
import Qr from './QrCode';
import './css.css';


export default function Login() {

    // States for registration
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [tempName, setTempName] =useState('');
    const [tempPassword, setTempPassword]=useState('');
    const [crediantials, setCrediantials] =useState<any>({});

    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    // Handling the name change
    const handleName = (e: any) => {
        setName(e.target.value);
        setSubmitted(false);
    };



    // Handling the password change
    const handlePassword = (e: any) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };

    // Handling the form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let response = await fetch('http://localhost:5019/users');
        console.log('123');
        let users=await response.json();
        let exists=false;
        for (let user of users){
            if (user.username === name && user.password==password){
                exists=true;
            }
        }
        if (!exists){
            alert('user does not exist');
            return;
        }
        if (name === '' || password === '') {
            setError(true);
        } else {
            setSubmitted(true);
            setError(false);
            setCrediantials({username: name, password});
        }
        //await fetch('http://localhost:5019/register?id='+name+'&password='+password);
    };

    // Showing success message
    const successMessage = () => {
        return (
            <div
                className="success"
                style={{
                    display: submitted ? '' : 'none',
                }}>
                <h2>User {name} successfully connected!!</h2>
            </div>
        );
    };

    // Showing error message if error is true
    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? '' : 'none',
                }}>
                <h2>Please enter all the fields</h2>
            </div>
        );
    };

    return (
        <div className="center">
            <div>
                <h1>User Login</h1>
            </div>

            {/* Calling to the methods */}
            <div className="messages">
                {errorMessage()}
                {successMessage()}
            </div>

            <form>
                {/* Labels and inputs for form data */}
                <label className="label_register_login">Name:</label>
                <input onChange={handleName} className="input_register_login"
                    value={name} type="text" />


                <label className="label_register_login">Password:</label>
                <input onChange={handlePassword} className="input_register_login"
                    value={password} type="password" />

                <button onClick={handleSubmit} className="button_submit" type="submit">
                    Submit
                </button>
                <Qr username={crediantials.username} password={crediantials.password}></Qr>
            </form>
        </div>
    );
}