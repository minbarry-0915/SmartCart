import { User } from "../types";

function usePostUserInfo() {
    const postUserInfo = async ({ Userid, Password, Name, BirthDate, Gender, Phone_Num, Email }: User) => {

        const userInfo = {
            Userid, // 중괄호 제거 // 같은 이름의 변수로 자동으로 속성 생성
            Password,
            BirthDate,
            Gender,
            Phone_Num,
            Email,
        };

        try {
            // 여기서 API 호출을 추가하세요
            const response = await fetch('YOUR_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error posting user info:', error);
        }
    };

    return { postUserInfo };
}

export default usePostUserInfo;
