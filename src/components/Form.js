import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import CryptoJS from 'crypto-js';
// import { enc } from 'crypto-js/core';
// import crypto from 'crypto-js';


function Form() {

    const url = 'http://localhost:3001/api/users';

    const handleSubmit = async function (event) {
        event.preventDefault();

        let firstname = event.target.firstname.value;
        let lastname = event.target.lastname.value;
        let email = event.target.email.value;
        let username = event.target.username.value;
        let password = event.target.password.value;

        const encryptWithAES = (text) => {
            const passphrase = process.env.REACT_APP_ENCRYPTION_KEY;
            return CryptoJS.AES.encrypt(text, passphrase).toString();
        };


        let encryptedFirstname = encryptWithAES(firstname);
        let encryptedLastname = encryptWithAES(lastname);
        let encryptedEmail = encryptWithAES(email);
        let encryptedUsername = encryptWithAES(username);
        let encryptedPassword = encryptWithAES(password);

        let reqBody = [
            encryptedFirstname,
            encryptedLastname,
            encryptedEmail,
            encryptedUsername,
            encryptedPassword
        ].toString();

        try {

            let result = await fetch(url, {
                method: 'post',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: reqBody
            });

            console.log('result: ' + result);

        } catch (error) {
            console.log(error)
        }

    }


    return (
        <div className='container'>
            <form onSubmit={handleSubmit} method='post' encType='application/x-www-form-urlencoded'>
                <div className='form-container'>
                    <h2>Sign Up</h2>
                    {/* Errors */}

                    <div className='form-group'>
                        <label htmlFor='firstname'>Firstname:</label>
                        <input type='text' className='form-control' name='firstname' id='firstname'></input>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='lastname'>Lastname:</label>
                        <input type='text' className='form-control' name='lastname' id='lastname'></input>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='email'>Email:</label>
                        <input type='email' className='form-control' name='email' id='email'></input>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='username'>Username:</label>
                        <input type='text' className='form-control' name='username' id='username'></input>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Password:</label>
                        <input type='password' className='form-control' name='password' id='password'></input>
                    </div>

                    <button type='submit' className='btn px-3 my-3 btn-primary'>Sign Up</button>
                </div>
            </form>
        </div>
    )
}

export default Form