import React, { useEffect, useState } from 'react'
import Login from './Login'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Admindash from './Admindash';


function Maindash({ setLoader }) {
    const [loggedin, setLoggedin] = useState(false);
    const [wait, setWait] = useState(false);

    const auth = getAuth();


    useEffect(() => {
        setLoader(true);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User just signed in, we should not display dialog next time because of firebase auto-login
                if (wait == false)
                    setLoggedin(true)
                setLoader(false)
            } else {
                // User just signed-out or auto-login failed, we will show sign-in form immediately the next time he loads the page
                // localStorage.removeItem('myPage.expectSignIn')

                // Here implement logic to trigger the login dialog or redirect to sign-in page, if necessary. Don't redirect if dialog is already visible.
                // e.g. showDialog()
                setLoader(false)
            }
        }

        );

    }, [])

    return (
        <div class='flex-col dashboard'>
            <h1>Admin Dashboard</h1>
            {loggedin ? <Admindash loggedin={loggedin} setLoggedin={setLoggedin} /> : <Login
                loggedin={loggedin}
                setLoggedin={setLoggedin}
                wait={wait}
                setWait={setWait} />}

        </div>
    )
}

export default Maindash