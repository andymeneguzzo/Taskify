import React, {useState} from 'react';
import {Link} from 'react-router-dom';

function Register() {
    // useState is a React Hook that lets you add state to functional components
    // Each line declares a state variable and its setter function with an initial value
    // Syntax: const [stateVariable, setStateFunction] = useState(initialValue)
    
    // Name state - stores user's name, initialized as empty string
    const [name, setName] = useState('');
    
    // Email state - stores user's email, initialized as empty string 
    const [email, setEmail] = useState('');
    
    // Password state - stores user's password, initialized as empty string
    const [password, setPassword] = useState('');
    
    // Confirm password state - stores password confirmation, initialized as empty string
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: implement registration logic with backend
        if(password !== confirmPassword) {
            alert("Password don't match");
            return;
        }
        console.log('Registration attempt', {name, email, password});
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Register;