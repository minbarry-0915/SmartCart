import { REACT_NATIVE_BACKEND_IP } from "@env";
import axios from "axios";
import { useState } from "react";

function useVerifyCodeForFindingId(){
    const [loading, setLoading] = useState<boolean>(false);
    
    const postVerifyCode = async(email:string, code:string) => {
        try{
            console.log('Trying to verify code...');
            setLoading(true);
            const jsonResponse = await axios.post(`http://${REACT_NATIVE_BACKEND_IP}/api/verify_code/id`,{
                Email: email,
                Code: code,
            });
            return jsonResponse.data;
        }catch(err: any){
            console.log('Failed to verify code:',err.response?.data);
            return err.response?.data;
        }
    }
    
    return {
        loading,
        postVerifyCode
    }
}
export default useVerifyCodeForFindingId;