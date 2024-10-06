import axios from "axios";
import { REACT_NATIVE_BACKEND_IP } from "@env";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// -- 연결 완
function usePostSearchKeyword() {
    const { userId } = useSelector((state: RootState) => state.auth);

    const postSearchKeyword = async (keywordName: string) => {
        try {
            // 서버에 장바구니 상태를 POST
            console.log("Posting keywords ...");
            const jsonResponse = await axios.post(`http://${REACT_NATIVE_BACKEND_IP}/api/search/history`, {
                Userid: userId,  
                Keyword: keywordName,
            });
            return true;
        } catch (error) {
            console.error("Fail to update keywords:", error);
            return false;
        } finally {
            console.log("Successfully posted keywords.");
        }
    };
    return {
        postSearchKeyword
    }

}
export default usePostSearchKeyword;