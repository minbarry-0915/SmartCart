import { useState } from 'react';
import axios from 'axios';
import { User } from '../types';
import { REACT_NATIVE_BACKEND_IP } from '@env';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// -- 연결 완 -- 
const usePatchUserInfo = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const { userId } = useSelector((state: RootState) => state.auth);

    const patchUserInfo = async (userId: string, userData: Partial<User>) => {
        try {
            setLoading(true);
            console.log('Patching User Info...');
            const jsonResponse = await axios.patch(`http://${REACT_NATIVE_BACKEND_IP}/api/user/${userId}`, {
                Name: userData.Name,
                Birthdate: userData.Birthdate,
                Gender: userData.Gender,
                Phone_num: userData.Phone_num,
                Email: userData.Email,
                Password: userData.Password,
            })
            setStatus(jsonResponse.status);
        } catch (error: any) {
            setError(error);
            console.error('Failed to update user info:', error);
            setStatus(error?.messege?.status);
        } finally {
            console.log('Update Done.');
            setLoading(false);
        }
    };

    return { patchUserInfo, status };
};

export default usePatchUserInfo;
