import { useState, useCallback, useEffect } from "react";
import { Product } from "../types";

function useGetProductDetail(productId: number) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | undefined>(undefined);

    const getProductDetail = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const jsonResponse: Product = {
                Product_id: productId, // productId를 사용
                Category: "마이프로틴",
                Product_name: "퓨처 웨이(Future Whey) 스트로베리 맛",
                Main_image: "https://static.thcdn.com/images/large/webp//productimg/1600/1600/13687585-1625000373316641.jpg",
                Price: 38900,
                Description: `인스턴트 오트란 무엇인가요? 
                인스턴트 오트는 풍부한 영양가를 가진 건강하고 맛있는 귀리 파우더입니다.
                귀리는 다른 곡물에 비해 단백질을 비롯해 각종 미네랄과 비타민 및 식이섬유가 풍부하게 포함되어 있습니다.
                인스턴트 오트는 누구에게 적합한가요? 하루중 탄수화물 섭취를 증가시키고자하는 누구에게나 좋은 제품입니다.`,
                Location_id: "e3",
                Discount: undefined, // 필요에 따라 설정
            };

            setProduct(jsonResponse);

        } catch (error: any) {
            setError(error.message || "Failed to fetch product details");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        getProductDetail();
    }, [getProductDetail]);

    return {
        loading,
        error,
        product,
    };
}

export default useGetProductDetail;
