import router from 'next/router';
import { useState } from 'react';
import 'tailwindcss/tailwind.css'


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
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ formData })})
            .then((res) => {
                if (res.ok) {
                    router.push({
                        pathname: '/home',
                        query: {communityId: formData.communityId}
                    })
                }
                else {
                    setError("Community doesn't exist or password is incorrect")
                }
            })
        
    }

    return (
        <div className="h-screen flex bg-gray">
            <div class='w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16'>
                <h1 class="text-2xl font-medium text-primary mt-4 mb-12 text-center">Welcome to Loop. </h1>
                <h1>View your community.</h1>
                <br></br>
                <form onSubmit={onSubmit}>
                    <input class="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" type="text" name="communityId" placeholder ="Community Id" onChange={updateFormData}/>
                    <br>
                    </br>
                    <input class="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" type="text" name="communityToken" placeholder="Token" onChange={updateFormData}/>
                    <br></br>
                    <button class="bg-green py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark"> 
                    Log in
                    </button>
                    <br></br>
                    {error}
                </form>
                <br>
                </br>
                <h2>Or, <a href="/newCommunity">create a new community</a></h2>
            </div>
        </div>
    )
}