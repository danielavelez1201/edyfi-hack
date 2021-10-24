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
        <div>
        <h1>Create a community </h1>
        <br></br>
        <form onSubmit={onSubmit}>
            <input type="text" name="communityId" placeholder ="Community Id" onChange={updateFormData}/>
            <br>
            </br>
            <input type="text" name="communityToken" placeholder="Token" onChange={updateFormData}/>
            <br></br>
            <input type="submit" value="Submit"/>
        </form>
        </div>
    )
}