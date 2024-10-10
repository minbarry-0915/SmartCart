import { REACT_NATIVE_BACKEND_IP } from "@env";
import axios from "axios";
import { useState } from "react";

function useGetRequestVerification() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [responseData, setResponseData] = useState<any>(null); // 서버 응답 데이터를 저장할 상태
    const [message, setMessage] = useState<string>('');

    const checkEmailType = (email: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규 표현식
        return emailPattern.test(email);
    };

    const getRequestVerification = async (email: string) => {
        // 이메일 형식 검증
        if (!checkEmailType(email)) {
            console.log('wrong email type');
            setMessage('잘못된 이메일 형식입니다.');
            return; // 이메일 형식이 잘못된 경우 함수 종료
        }

        try {
            setLoading(true);
            setError(null);
            setMessage('');
            console.log('Trying to send verification code...');

            // 인증 코드 요청
            const jsonResponse = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}/api/request_verification/${email}`);

            // 응답 데이터 상태에 저장
            setResponseData(jsonResponse.data);
            // setMessage(jsonResponse.data?.message); // 성공 메시지 저장
            return jsonResponse.data; // 응답 데이터를 반환
        } catch (err: any) {
            if(err.response){
                console.error('Error while sending verificatoin code:', err.response.data?.message);
                setMessage(err.response.data?.message);
            }
            setError(err.response?.data?.message || '메일 전송에 실패하였습니다.');
            console.error('Error while sending verification code:', err);
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };

    return { getRequestVerification, loading, error, message, setMessage, responseData }; // 훅을 사용하는 컴포넌트에서 필요한 값을 반환
}

export default useGetRequestVerification;
