import { useState } from "react";
import axios from "axios";
import { REACT_NATIVE_BACKEND_IP } from "@env";

interface Prop {
    userId: string;
    password: string;
}

// -- 연결 완 -- 
function usePostUserVerify() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const postUserVerify = async ({ userId, password }: Prop) => {
        setLoading(true);
        setError(null);  // 이전 에러를 초기화

        // 입력 검증 예시
        if (!userId || !password) {
            setError('User ID and password are required.');
            setLoading(false);
            return { status: 400, error: 'User ID and password are required.' }; // 에러 반환
        }

        try {
            console.log('Trying Login...')
            console.log(REACT_NATIVE_BACKEND_IP);
            const response = await axios.post(`http://${REACT_NATIVE_BACKEND_IP}/api/login`, {
                Userid: userId,
                Password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 5000,
            });
            console.log('Login Successful.');
            return true; // 성공 시 상태 반환
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message; // 서버 에러 메시지 활용
            setError(errorMessage);

            console.error('Login Failed', err);
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        postUserVerify,
    }
}

export default usePostUserVerify;
