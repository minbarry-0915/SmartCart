import { useState } from "react";
import axios from "axios";

interface Prop {
    userId: string;
    password: string;
}

function usePostUserVerify() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<number | undefined>(undefined);

    const postUserVerify = async ({ userId, password }: Prop) => {
        setLoading(true);
        setError(null);  // 이전 에러를 초기화
        setStatus(undefined); // 상태 초기화

        // 입력 검증 예시
        if (!userId || !password) {
            setError('User ID and password are required.');
            setLoading(false);
            return { status: 400, error: 'User ID and password are required.' }; // 에러 반환
        }

        try {
            const response = await axios.post('', {
                userId,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setStatus(response.status);
            return { status: response.status, error: null }; // 성공 시 상태 반환
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message; // 서버 에러 메시지 활용
            setError(errorMessage);
            setStatus(err.response?.status); // 에러 상태 설정
            console.error('Failed to verify user data', err);
            return { status: err.response?.status, error: errorMessage }; // 에러 반환
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        status,
        error,
        postUserVerify,
    }
}

export default usePostUserVerify;
