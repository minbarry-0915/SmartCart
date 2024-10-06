import { useState, useCallback } from "react";
import { Keyword } from "../types";
import axios from "axios";
import { REACT_NATIVE_BACKEND_IP } from "@env";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// -- 연결 완
function useGetRecentKeyword() {
    const [keywordArray, setKeywordArray] = useState<Keyword[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useSelector((state: RootState) => state.auth);

    const getRecentKeyword = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching recent keywords...');
            // 서버 요청 부분을 예시로 대체
            const jsonResponse = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}/api/search/history/${userId}`);

            setKeywordArray(jsonResponse.data);
        } catch (err: any) {
            console.error('Failed to fetch recent keywords', err);
            setError(err.message || 'Unknown error occurred');
        } finally {
            setLoading(false);
            console.log('Successfully fetched recent keywords');
        }
    }, []);

    return {
        keywordArray,
        loading,
        error,
        getRecentKeyword,
        setKeywordArray
    };
}

export default useGetRecentKeyword;
