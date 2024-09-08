import { useState, useCallback, useEffect } from "react";

interface Keyword {
    pNum: string,
    pName: string
}

function useGetRecentKeyword() {
    const [keywordArray, setKeywordArray] = useState<Keyword[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    //axios로 변경해야됨
    const getRecentKeyword = useCallback(() => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching recent keywords...');
            const response = {
                "data": [
                    {
                        "pNum": '1234',
                        "pName": "코카콜라"
                    },
                    {
                        "pNum": 'asdasasa',
                        "pName": "마이프로틴"
                    },
                    {
                        "pNum": 'qweqwqww',
                        "pName": "커피"
                    },
                    {
                        "pNum": '123412',
                        "pName": "커피"
                    },
                    {
                        "pNum": '123412',
                        "pName": "커피"
                    },
                    {
                        "pNum": '123412',
                        "pName": "커피"
                    },
                    {
                        "pNum": '123412',
                        "pName": "커피"
                    },
                    {
                        "pNum": '123412',
                        "pName": "커피"
                    },
                    {
                        "pNum": '123412',
                        "pName": "커피"
                    },
                    {
                        "pNum": '123412',
                        "pName": "커피"
                    },
                    {
                        "pNum": '123412',
                        "pName": "커피"
                    },

                ],
                "status": 200,
                "statusText": "OK",
                "headers": {
                    "content-type": "application/json; charset=utf-8"
                },
                "config": {
                    "url": "https://api.example.com/data",
                    "method": "get",
                    "headers": {
                        "Accept": "application/json, text/plain, */*"
                    },
                    "transformRequest": [null],
                    "transformResponse": [null],
                    "timeout": 0,
                    "xsrfCookieName": "XSRF-TOKEN",
                    "xsrfHeaderName": "X-XSRF-TOKEN",
                    "maxContentLength": -1,
                    "maxBodyLength": -1
                },
                "request": {}
            };
            setKeywordArray(response.data);
        } catch (err: any) {
            console.error('Failed to fetch recent keywords', err);
            setError(err);
        } finally {
            console.log('Successfully fetched recent keywords')
            setLoading(false);
        }
    }, []);

    return {
        keywordArray,
        loading,
        error,
        getRecentKeyword,
        setKeywordArray
    }
}
export default useGetRecentKeyword;