import { useState, useCallback, useEffect } from "react";
import { Product } from "../types";
import axios from "axios";
import { REACT_NATIVE_BACKEND_IP } from "@env";

// -- 연결 완 -- 
function useGetProductDetail(productId: number) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | undefined>(undefined);

    const getProductDetail = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const jsonResponse = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}/api/products/${productId}`);
            
            setProduct(jsonResponse.data);

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
