import { useState, useCallback, useEffect } from "react";

interface Product {
    pNum: string;
    pCategory: string;
    pName: string;
    pImage: string;
    pPrice: number;
}


function useGetRecommendProductList(){
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct ] = useState<Product[]>([]);
    const getRecommendProductList = useCallback (async() => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching recommended product list...');
            const jsonResponse = {
                "data": [
                    {
                        "pNum": '1234',
                        "pCategory": '마이프로틴',
                        "pName": '코카콜라난sssssssssss난나나나나나나나나나나나나나나ㅏ나나',
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
            }
            setProduct(jsonResponse.data);
        } catch (error: any) {
            console.error('Failed to Fetch: ', error);
            setError(error);
        } finally {
            console.log('Fetch Done.');
            setLoading(false);
        }
        
    },[])

    useEffect(()=>{
        getRecommendProductList();
    },[])
    return {
        loading,
        error,
        product
    }
}
export default useGetRecommendProductList;