import { REACT_NATIVE_BACKEND_IP } from "@env";
import axios from "axios";
import { useState } from "react";

function useVerifyCode(){
    const [loading, setLoading] = useState<boolean>(false);
    
    const postVerifyCodeForId = async(email:string, code:string) => {
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
        }finally{
            setLoading(false);
        }
    }

    const postVerifyCodeForPW = async(id:string, code:string) => {
        try{
            console.log('Trying to verify code...');
            setLoading(true);
            const jsonResponse = await axios.post(`http://${REACT_NATIVE_BACKEND_IP}/api/verify_code/password`,{
                Userid: id,
                Code: code,
            });
            return jsonResponse.data;
        }catch(err: any){
            console.log('Failed to verify code:',err.response?.data);
            return err.response?.data;
        }finally{
            setLoading(false);
        }
    }
    
    
    return {
        loading,
        postVerifyCodeForId,
        postVerifyCodeForPW
    }
}
export default useVerifyCode;