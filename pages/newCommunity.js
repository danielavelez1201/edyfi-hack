import { useState } from 'react';

export default function NewCommunity() {

    const [formData, setFormData] = useState({})

    function updateFormData(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    async function onSubmit(e) {
        e.preventDefault();
        await fetch('api/createCommunity', {method: 'POST',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formData })}).then((res) => res.json())
    }

    return (
    <div className="h-screen flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light">
        <div class='w-full max-w-md m-auto bg-white rounded-lg drop-shadow py-10 px-16'>
            <h1 class="text-xl font-medium mt-4 text-left">Let's create your new community :)</h1>
            <br></br>
            <form onSubmit={onSubmit}>
                <input class="w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" type="text" name="communityId" placeholder ="Community Id" onChange={updateFormData}/>
                <br>
                </br>
                <input class="w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" type="text" name="communityToken" placeholder="Token" onChange={updateFormData}/>
                <br></br>
                <button class="bg-blue py-2 px-4 text-sm text-white rounded  focus:outline-none focus:border-green-dark hover:bg-blue-hover "> 
                Create
                </button>
                <br></br>
            </form>
            <br>
            </br>
            <h2><a class="text-blue" href="/landing">Back to login</a></h2>
        </div>
    </div>)
}