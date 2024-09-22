import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { Product, CartItem } from "../types";

function useGetCartList() {
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

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

            // 실제 API 요청 부분 (예시 데이터 사용)
            const response = {
                data: [
                    {
                        Product_id: 1,
                        Product_name: "Product 1",
                        Price: 100,
                        Discount: 10,
                        Description: "Description of Product 1",
                        Category: "Category 1",
                        quantity: 10,
                    },
                    {
                        Product_id: 2,
                        Product_name: "Product 2",
                        Price: 200,
                        Discount: 20,
                        Description: "Description of Product 2",
                        Category: "Category 2",
                        quantity: 5,
                    },
                    {
                        Product_id: 3,
                        Product_name: "Product 3",
                        Price: 300,
                        Discount: 15,
                        Description: "Description of Product 3",
                        Category: "Category 3",
                        quantity: 3,
                    },
                    {
                        Product_id: 4,
                        Product_name: "Product 4",
                        Price: 400,
                        Discount: 25,
                        Description: "Description of Product 4",
                        Category: "Category 4",
                        quantity: 7,
                    },
                    {
                        Product_id: 5,
                        Product_name: "Product 5",
                        Price: 150,
                        Discount: 5,
                        Description: "Description of Product 5",
                        Category: "Category 5",
                        quantity: 12,
                    },
                ],
                status: 200,
            };

            if (response.status === 200) {
                const cartItems: CartItem[] = response.data.map(item => ({
                    product: {
                        Product_id: item.Product_id,
                        Product_name: item.Product_name,
                        Price: item.Price,
                        Discount: item.Discount,
                        Description: item.Description,
                        Category: item.Category,
                    },
                    quantity: item.quantity,
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
