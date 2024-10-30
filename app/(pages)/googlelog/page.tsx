"use client"
const GoogleLog = () => {
    const handleLogOut = async ()=>{
        window.location.href='http://localhost:3000/login';
    }
    return (
        <>
            <h1>Login success</h1>
            <button onClick={handleLogOut}>Log out</button>
        </>
    );
}


export default GoogleLog;