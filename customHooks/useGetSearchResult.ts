// useGetSearchResults.ts
import { useCallback, useEffect, useState } from "react";

interface Product {
    pNum: string;
    pCategory: string;
    pName: string;
    pImage: string;
    pPrice: number;
}

function useGetSearchResult(keyword: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<Product[]>([]);

    const getSearchResults = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching search results...');

            // 예시 데이터
            const response = {
                "data": [
                    {
                        "pNum": '1234',
                        "pCategory": '마이프로틴',
                        "pName": '코카콜라난난나나나나ssssssssssssssssssaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaassssssssssssssssssssssssssssssssssss나나나나나나나나나나ㅏ나나',
                        "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        "pPrice": 1320,
                    },
                    {
                        "pNum": '21321',
                        "pCategory": '마이프로틴',
                        "pName": '코카콜라',
                        "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        "pPrice": 1320,
                    },
                    {
                        "pNum": '32523523',
                        "pCategory": '마이프로틴',
                        "pName": '코카콜라',
                        "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        "pPrice": 1320,
                    },
                    {
                        "pNum": '657657',
                        "pCategory": '마이프로틴',
                        "pName": '코카콜라',
                        "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        "pPrice": 1320,
                    },
                    {
                        "pNum": '1234',
                        "pCategory": '마이프로틴',
                        "pName": '코카콜라',
                        "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        "pPrice": 1320,
                    },
                    {
                        "pNum": '1234',
                        "pCategory": '마이프로틴',
                        "pName": '코카콜라',
                        "pImage": 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        "pPrice": 1320,
                    }
                ]
            };
            setResponse(response.data);
        } catch (err: any) {
            console.error('Fail to fetch search results', err);
            setError(err);
        } finally {
            setLoading(false);
            console.log('Successfully fetched search results');
        }
    }, [keyword]);

    useEffect(() => {
        if (keyword) {
            getSearchResults();
        }
    }, [keyword, getSearchResults]);

    return {
        response,
        loading,
        error,
    };
}

export default useGetSearchResult;
