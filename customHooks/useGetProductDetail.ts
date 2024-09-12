import { useState , useCallback, useEffect} from "react";

interface Product {
    pNum: string,
    category: string,
    pName: string,
    pMainImage: string,
    pDetailImage: string[],
    price: number,
    location: string,
}

function useGetProductDetail(pnum : string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | undefined>(undefined);


    const getProductDetail = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {           
            const response = {
                "pNum": "1234",
                "category": "마이프로틴",
                "pName": "퓨처 웨이(Future Whey) 스트로베리 맛 ",
                "pMainImage": "https://static.thcdn.com/images/large/webp//productimg/1600/1600/13687585-1625000373316641.jpg",
                //상세페이지 이미지는 string array형태로 받음
                "pDetailImage": [
                    `인스턴트 오트란 무엇인가요? 
                    인스턴트 오트는 풍부한 영양가를 가진 건강하고 맛있는 귀리 파우더입니다.
                    귀리는 다른 곡물에 비해 단백질을 비롯해 각종 미네랄과 비타민 및 식이섬유가 풍부하게 포함되어 있습니다.
                    인스턴트 오트는 누구에게 적합한가요? 하루중 탄수화물 섭취를 증가시키고자하는 누구에게나 좋은 제품입니다.`
                ],
                "price": 38900,
                "location": "e3",
            };

            setProduct(response);

        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
        
    },[]);

    useEffect(()=>{
        getProductDetail();
    },[])

    return{
        loading,
        error,
        product,
    }
};
export default useGetProductDetail;