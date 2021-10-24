import router from 'next/router';
import { useState } from 'react';
import 'tailwindcss/tailwind.css'
import { hashcode } from './api/helpers';


export default function Landing() {

    const [formData, setFormData] = useState({})
    const [error, setError] = useState("")

    function login(e) {
        e.preventDefault();
        const communityId = e.target[0].value.toString()
        
      }

    function updateFormData(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    async function onSubmit(e) {
        e.preventDefault();
        await fetch('api/login', {method: 'POST', 
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ formData })})
            .then((res) => {
                if (res.ok) {
                    router.push({
                        pathname: '/home',
                        query: {communityId: formData.communityId, token: hashcode(formData.communityToken)}
                    })
                }
                else {
                    setError("Community doesn't exist or password is incorrect.")
                }
            })
        
    }

    return (
        <div className="h-screen flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light">
            <div class='w-full max-w-md m-auto bg-white rounded-lg drop-shadow py-10 px-16'>
                <h1 class="text-2xl font-medium text-primary mt-4 mb-12 text-center">Welcome to Loop. </h1>
                <h1 class="text-xl font-medium mt-4 text-center">Log into your community.</h1>
                <br></br>
                <form onSubmit={onSubmit}>
                    <input class="w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" type="text" name="communityId" placeholder ="Community Id" onChange={updateFormData}/>
                    <br>
                    </br>
                    <input class="w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" type="text" name="communityToken" placeholder="Token" onChange={updateFormData}/>
                    <br></br>
                    <button class="bg-blue py-2 px-4 text-sm text-white rounded  focus:outline-none focus:border-green-dark hover:bg-blue-hover "> 
                    Log in
                    </button>
                    <br></br>
                    <br></br>
                    <h1 className="text-red">{error}</h1>
                </form>
                <br>
                </br>
                <h2>➡️<a class="text-blue hover:underline ml-3" href="/newCommunity">Create a new community</a></h2>
                <h2>➡️<a class="text-blue hover:underline ml-3" href="/adminLogin">Log in as an admin </a></h2>
            </div>
        </div>
    )
}