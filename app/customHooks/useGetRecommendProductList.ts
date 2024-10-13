import { useState, useCallback, useEffect } from "react";
import { Product } from "../types";
import axios from "axios";
import { REACT_NATIVE_BACKEND_IP } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { setRecommendations , startLoadingRecommendations } from "../redux/authSlice"; // 액션 임포트

function useGetRecommendProductList() {
    const isLoadingRecommendations = useSelector((state: any) => state.auth.isLoadingRecommendations); // Redux에서 로딩 상태 가져오기

    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]); //old
    const dispatch = useDispatch();

    const getRecommendProductList = useCallback(async () => {
        dispatch(startLoadingRecommendations()); // 로딩 시작
        setError(null);

        try {
            console.log('Fetching recommended product list...');
            const jsonResponse = await axios.post(`http://${REACT_NATIVE_BACKEND_IP}/recommend`)
            //setProducts(jsonResponse.data);
            dispatch(setRecommendations(jsonResponse.data)); // Redux에 추천 제품 저장
        } catch (error: any) {
            console.log('Failed to Fetch: ', error);
            setError(error.message || 'Failed to fetch recommended products');
        } finally {
            console.log('Fetch Done.');
        }
    }, []);

    useEffect(() => {
        getRecommendProductList();
    }, [getRecommendProductList]);
    
    return {
        error,
        //products
    };
}

export default useGetRecommendProductList;
