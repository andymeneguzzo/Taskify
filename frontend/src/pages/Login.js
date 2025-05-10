import React, {useState} from 'react';
import {Link} from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: Implement login logic with actual backend
        console.log('Login attempt', {email, password});
    };

    return (//write html code for page visualization)
}