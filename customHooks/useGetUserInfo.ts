import { useCallback, useEffect, useState } from "react";
import { User } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import axios from "axios";

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

            // 서버에서 사용자 정보 요청
            // const response = await axios.get(`https://api.example.com/user/${userId}`);
            // const userData = response.data;

            const userData = {
                userid: 'userId', // 예시로 userId 사용
                password: 'examplePassword',
                name: '홍길동',
                birthDate: '2000-01-01', // YYYY-MM-DD 형식
                gender: 'male',
                phoneNum: '010-5547-1405',
                email: 'example@mail.com',
            };

            // 서버에서 받은 데이터를 User 인터페이스에 맞춰 상태에 설정
            const user: User = {
                Userid: userData.userid,
                Password: userData.password,
                Name: userData.name,
                BirthDate: new Date(userData.birthDate), // Date 형식으로 변환
                Gender: userData.gender,
                Phone_Num: userData.phoneNum,
                Email: userData.email,
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
            setLoading(false);
        }
    }, [userId, dispatch]);

    useEffect(()=>{
        getUserInfo();
    },[])

    return { loading, error, userInfo, getUserInfo };
}

export default useGetUserInfo;
