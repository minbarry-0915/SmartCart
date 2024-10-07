import { useCallback, useEffect, useState } from "react";
import { User } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import axios from "axios";
import { REACT_NATIVE_BACKEND_IP } from "@env";

// -- 연결 완 -- 
function useGetUserInfo() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<User | null>(null); // 초기값을 null로 설정
    const { userId } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const getUserInfo = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching user info...');
            const jsonResponse = await axios.get(`http://$${REACT_NATIVE_BACKEND_IP}/api/user/${userId}`);

            // const userData = {
            //     Userid: 'userId', // 예시로 userId 사용
            //     Password: 'examplePassword',
            //     Name: '홍길동',
            //     Birthdate: '2000-01-01', // YYYY-MM-DD 형식
            //     Gender: 'male',
            //     Phone_num: '010-5547-1405',
            //     Email: 'example@mail.com',
            // };
            const userData = jsonResponse.data;

            // 서버에서 받은 데이터를 User 인터페이스에 맞춰 상태에 설정
            const user: User = {
                Userid: userData.Userid,
                Password: userData.Password,
                Name: userData.Name,
                Birthdate: new Date(userData.Birthdate), // Date 형식으로 변환
                Gender: userData.Gender,
                Phone_num: userData.Phone_num,
                Email: userData.Email,
            };

            setUserInfo(user);
        } catch (error) {
            console.error('Error fetching user info:', error);
            setError('Failed to fetch user information.'); // 에러 메시지 설정
            // 로그아웃 처리 추가
            // if (axios.isAxiosError(error) && error.response?.status === 401) {
            //     dispatch(logout());
            // }
        } finally {
            console.log('Fetch Done.');
            setLoading(false);
        }
    }, [userId, dispatch]);

    useEffect(()=>{
        getUserInfo();
    },[])

    return { loading, error, userInfo, getUserInfo };
}

export default useGetUserInfo;
