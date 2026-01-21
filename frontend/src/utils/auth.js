function getAuthUser(){
    //localstorage: key-value authentication pair on browsers
    const token=localStorage.getItem("token"); 
    if(!token) return null;

    try{
        const payload=JSON.parse(atob(token.split(".")[1]));
        //header.payload.signature: we only need payload
        //atob: ascii to binary as JWT payload is Base64-encoded, 
        //then decoded it to JSON.
        return payload;
    }
    catch(err){
        console.log(`Invalid token: ${err}`);
        return null;
    }
}

export default getAuthUser;