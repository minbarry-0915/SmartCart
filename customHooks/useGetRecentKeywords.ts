import { useState, useCallback } from "react";
import { Keyword } from "../types";

function useGetRecentKeyword() {
    const [keywordArray, setKeywordArray] = useState<Keyword[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getRecentKeyword = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching recent keywords...');
            // 서버 요청 부분을 예시로 대체
            const response = {
                data: [
                    { Search_id: 1, Search_keyword: '코카콜라' },
                    { Search_id: 2, Search_keyword: '마이프로틴' },
                    { Search_id: 3, Search_keyword: '커피' },
                    { Search_id: 4, Search_keyword: '초콜릿' },
                    { Search_id: 5, Search_keyword: '스낵' },
                    { Search_id: 6, Search_keyword: '치킨' },
                    { Search_id: 7, Search_keyword: '피자' },
                    { Search_id: 8, Search_keyword: '햄버거' },
                    { Search_id: 9, Search_keyword: '사탕' },
                    { Search_id: 10, Search_keyword: '아이스크림' },
                ],
                status: 200,
            };

            if (response.status === 200) {
                setKeywordArray(response.data);
            } else {
                throw new Error('Failed to fetch keywords');
            }
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
