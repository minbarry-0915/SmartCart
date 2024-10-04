import axios from "axios";
import { User } from "../types";
import { REACT_NATIVE_BACKEND_IP } from "@env";
import { useState } from "react";

function usePostUserInfo() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const postUserInfo = async ({ Userid, Password, Name, Birthdate, Gender, Phone_num, Email }: User) => {
        const userInfo = {
            Userid,
            Password,
            Name,
            Birthdate: new Date(Birthdate).toISOString().split('T')[0],
            Gender,
            Phone_num,
            Email,
        };

        try {
            setLoading(true);
            setError(null);
            // API 호출
            console.log('Posting UserInfo...');
            const response = await axios.post(`http://192.168.0.6:3001/api/register`, userInfo);

            console.log(response);

            // 성공적으로 처리된 경우 true 반환
            return true;

        } catch (error: any) {
            setError(error);
            console.error('Error posting user info:', error);
            return false;  // 실패 시 false 반환
        } finally{
            setLoading(false);
        }
        
    };

    return { 
        loading, 
        error,
        postUserInfo };
}

export default usePostUserInfo;
