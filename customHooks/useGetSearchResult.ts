// useGetSearchResults.ts
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types";
import { REACT_NATIVE_BACKEND_IP } from "@env";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function useGetSearchResult(keyword: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const { userId } = useSelector((state: RootState) => state.auth);

    const getSearchResults = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching search results...:', keyword);

            // 예시 데이터
            const jsonResponse = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}/api/search/${keyword}/${userId}`);
            setProducts(jsonResponse.data);
        } catch (err: any) {
            console.error('Fail to fetch search results', err);
            setError(err);
            setProducts([]);
        } finally {
            setLoading(false);
            console.log('Successfully fetched search results');
        }
    }, []);

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
