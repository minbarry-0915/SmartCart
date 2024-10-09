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
    const { userId } = useSelector((state: RootState) => state.auth);

    const patchUserInfo = async (userData: Partial<User>) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Patching User Info...');
            const jsonResponse = await axios.patch(`http://${REACT_NATIVE_BACKEND_IP}/api/user/${userId}`, {
                Name: userData.Name,
                Birthdate: userData.Birthdate?.toISOString().split('T')[0],
                Gender: userData.Gender,
                Phone_num: userData.Phone_num,
                Email: userData.Email,
                Password: userData.Password,
            })
            //console.log(jsonResponse);
            console.log('Patch User Info Successfully');
            return true;
        } catch (err: any) {
            console.error('Failed to patch userinfo: ',err);
            return false;
        } finally {
            console.log('Update Done.');
            setLoading(false);
        }
    };

    return { 
        patchUserInfo, 
        loading
    };
};

export default usePatchUserInfo;
