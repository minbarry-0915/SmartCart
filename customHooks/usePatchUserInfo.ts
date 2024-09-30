import { useState } from 'react';
import axios from 'axios';
import { User } from '../types';

const usePatchUserInfo = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [status, setStatus] = useState<number | null>(null);

    const patchUserInfo = async (userId: string, userData: Partial<User>) => {
        try {
            setLoading(true);
            console.log('Patching User Info...');
            //const response = await axios.patch(`https://api.example.com/user/${userId}`, userData);
            //setStatus(response.status);
            setStatus(200);
        } catch (error: any) {
            setError(error);
            console.error('Failed to update user info:', error);
            setStatus(401); // 에러 발생 시 상태 코드 401 설정
        } finally{
            console.log('Update Done.');
            setLoading(false);
        }
    };

    return { patchUserInfo, status };
};

export default usePatchUserInfo;
