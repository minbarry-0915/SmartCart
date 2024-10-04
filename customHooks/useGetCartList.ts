import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { Product, CartItem } from "../types";
import { PERSONAL_API_KEY, REACT_NATIVE_BACKEND_IP } from "@env";
import axios from "axios";

function useGetCartList() {
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);

    const [responses, setResponses] = useState<CartItem[]>([]);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [grandDiscount, setGrandDiscount] = useState<number>(0);
    const [grandCount, setGrandCount] = useState<number>(0);
    const [grandPrice, setGrandPrice] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getCartList = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching Cart list...');
            // 실제 API 요청 부분 (예시 데이터 사용)
            const jsonResponse = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}/api/cart/${PERSONAL_API_KEY}/${userId}`)

            if (jsonResponse.status === 200) {
                const cartItems: CartItem[] = jsonResponse.data.map((item: { Product_id: string; Product_name: string; Price: string; Discount: string; Description: string; Category: string; Quantity: string; }) => ({
                    product: {
                        Product_id: item.Product_id,
                        Product_name: item.Product_name,
                        Price: item.Price,
                        Discount: item.Discount,
                        Description: item.Description,
                        Category: item.Category,
                    },
                    quantity: item.Quantity,
                }));
                setResponses(cartItems);
            } else {
                throw new Error("Failed to fetch cart data");
            }
        } catch (error: any) {
            setError(error.message);
            console.error(`Error fetching cart data: ${error}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCartList();
    }, [getCartList]);

    useEffect(() => {
        let newGrandTotal = 0;
        let newGrandDiscount = 0;
        let newGrandCount = 0;
        let newGrandPrice = 0;

        responses.forEach(item => {
            const { product, quantity } = item;
            const totalPrice = product.Price * quantity;
            const discountPrice = (product.Discount || 0) * quantity;

            newGrandTotal += totalPrice - discountPrice;
            newGrandDiscount += discountPrice;
            newGrandCount += quantity;
            newGrandPrice += totalPrice;
        });

        setGrandTotal(newGrandTotal);
        setGrandDiscount(newGrandDiscount);
        setGrandCount(newGrandCount);
        setGrandPrice(newGrandPrice);
    }, [responses]);

    return {
        responses,
        loading,
        error,
        grandTotal,
        grandDiscount,
        grandCount,
        grandPrice,
        setResponses,
        getCartList,
    };
}

export default useGetCartList;
