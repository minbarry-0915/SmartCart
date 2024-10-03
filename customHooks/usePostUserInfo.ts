import axios from "axios";
import { User } from "../types";
import { REACT_NATIVE_BACKEND_IP } from "@env";

function usePostUserInfo() {
    const postUserInfo = async ({ Userid, Password, Name, Birthdate, Gender, Phone_num, Email }: User) => {

        const userInfo = {
            Userid,
            Password,
            Name,
            Birthdate,
            Gender,
            Phone_num,
            Email,
        };

        try {
            // API 호출
            const response = await axios.post(`http://192.168.56.1:3001/api/register`, userInfo, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.status);

            // 성공적으로 처리된 경우 true 반환
            return true;

        } catch (error) {
            console.error('Error posting user info:', error);
            return false;  // 실패 시 false 반환
        }
    };

    return { postUserInfo };
}

export default usePostUserInfo;
