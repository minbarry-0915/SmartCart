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

        try {
            const response = await axios.post('https://example.com/api/data', {
                userId,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setStatus(response.status);
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to verify user data', err);
        } finally {
            setStatus(200);
            setLoading(false);
        }
    }

    return {
        loading,
        status,
        error,  // 에러 상태도 반환하면 유용할 수 있습니다.
        postUserVerify,
    }
}

export default usePostUserVerify;
