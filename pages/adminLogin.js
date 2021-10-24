import router from 'next/router';
import { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css'
import { signInWithGoogle, user } from '../firebase/clientApp'
import { useRouter } from 'next/router'
import Google from '../img/Google.png'
import Image from 'next/image'
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 

export default function Landing() {

    const [formData, setFormData] = useState({})
    const [error, setError] = useState("")
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

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

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUserLoggedIn(true);
                setUser(currentUser);
            }
            else {
                console.log("not logged in")
            }
        })

    }, [])

    const googleTextStyle = userLoggedIn ? 'text-center ml-5 text-cyan' : 'text-center ml-5';


    async function onSubmit(e) {
        e.preventDefault();
        await fetch('api/adminLogin', {method: 'POST', 
            headers: { 'Content-Type': 'application/json' , 'userId': user.uid}, 
            body: JSON.stringify({ formData })})
            .then((res) => {
                if (res.ok) {
                    router.push({
                        pathname: '/home',
                        query: {communityId: formData.communityId}
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
                <h1 class="text-xl font-medium mt-4 text-center">Log in to manage your community.</h1>
                <br></br>
                <form onSubmit={onSubmit}>
                    <input class="w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" type="text" name="communityId" placeholder ="Community Id" onChange={updateFormData}/>
                    <br>
                    </br>
                    <button
                    className='focus:outline-none flex items-center  h-9 justify-left  rounded-xl p-5 border-black border border-cyan'
                    onClick={signInWithGoogle}
                >
                    <Image height={24} width={24} src={Google} />
                    {userLoggedIn && (<div className={googleTextStyle}>Google account connected!</div>)}
                    {!userLoggedIn && (<div className={googleTextStyle}>Connect your Google account</div>)}
                </button>
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
                <h2><a class="text-blue hover:underline" href="/">Back to member login</a></h2>
            </div>
        </div>
    )
}