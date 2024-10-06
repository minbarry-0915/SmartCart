import { useState, useCallback, useEffect } from "react";
import { Product } from "../types";

function useGetRecommendProductList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const getRecommendProductList = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching recommended product list...');
            const jsonResponse = {
                data: [
                    {
                        Product_id: '1',
                        Product_name: '코카콜라난sssssssssss난나나나나나나나나나나나나나나ㅏ나나',
                        Price: 1320,
                        Category: '마이프로틴',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: undefined,
                        Description: 'Refreshing beverage',
                    },
                    {
                        Product_id: '21321',
                        Product_name: '코카콜라',
                        Price: 1320,
                        Category: '마이프로틴',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: undefined,
                        Description: 'Refreshing beverage',
                    },
                    {
                        Product_id: '32523523',
                        Product_name: '코카콜라',
                        Price: 1320,
                        Category: '마이프로틴',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: undefined,
                        Description: 'Refreshing beverage',
                    },
                    {
                        Product_id: '32523523',
                        Product_name: '코카콜라',
                        Price: 1320,
                        Category: '마이프로틴',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: undefined,
                        Description: 'Refreshing beverage',
                    },
                    {
                        Product_id: '32523523',
                        Product_name: '코카콜라',
                        Price: 1320,
                        Category: '마이프로틴',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: undefined,
                        Description: 'Refreshing beverage',
                    },
                    {
                        Product_id: '32523523',
                        Product_name: '코카콜라',
                        Price: 1320,
                        Category: '마이프로틴',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: undefined,
                        Description: 'Refreshing beverage',
                    },
                    {
                        Product_id: '32523523',
                        Product_name: '코카콜라',
                        Price: 1320,
                        Category: '마이프로틴',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: undefined,
                        Description: 'Refreshing beverage',
                    },
                    {
                        Product_id: '657657',
                        Product_name: '코카콜라',
                        Price: 1320,
                        Category: '마이프로틴',
                        Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                        Discount: undefined,
                        Description: 'Refreshing beverage',
                    }
                ]
            };
            setProducts(jsonResponse.data);
        } catch (error: any) {
            console.error('Failed to Fetch: ', error);
            setError(error.message || 'Failed to fetch recommended products');
        } finally {
            console.log('Fetch Done.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getRecommendProductList();
    }, [getRecommendProductList]);
    
    return {
        loading,
        error,
        products
    };
}

export default useGetRecommendProductList;
