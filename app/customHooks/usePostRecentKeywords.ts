import axios from "axios";
import { REACT_NATIVE_BACKEND_IP } from "@env";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";

// -- 연결 완
function usePostSearchKeyword() {
    const { userId } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState<boolean>(false);

    const postSearchKeyword = async (keywordName: string) => {
        if (loading) return;

        try {
            // 서버에 장바구니 상태를 POST
            console.log("Posting keywords ...");
            setLoading(true);
            const jsonResponse = await axios.post(`http://${REACT_NATIVE_BACKEND_IP}/api/search/history`, {
                Userid: userId,
                Keyword: keywordName,
            });
            return true;
        } catch (error) {
            console.log("Fail to update keywords:", error);
            return false;
        } finally {
            setLoading(false);
            console.log("Successfully posted keywords.");
        }
    };
    return {
        postSearchKeyword
    }

}
export default usePostSearchKeyword;