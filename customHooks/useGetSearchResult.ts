// useGetSearchResults.ts
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types";

function useGetSearchResult(keyword: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const getSearchResults = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching search results...');

            // 예시 데이터
            const jsonResponse = {
                data: [
                    {
                        Product_id: 1234,
                        Product_name: '코카콜라',
                        Price: 1320,
                        Category: '음료',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: 0,
                        Description: 'Refreshing soft drink',
                    },
                    {
                        Product_id: 21321,
                        Product_name: '마이프로틴',
                        Price: 18000,
                        Category: '단백질',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: 2000,
                        Description: 'High-quality protein powder',
                    },
                    {
                        Product_id: 32523523,
                        Product_name: '초코바',
                        Price: 2500,
                        Category: '간식',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: 500,
                        Description: 'Delicious chocolate snack',
                    },
                    // 추가 데이터...
                ]
            };
            setProducts(jsonResponse.data);
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
        products,
        loading,
        error,
    };
}

export default useGetSearchResult;
