import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

interface Product {
    pNum: string;
    pName: string;
    count: number;
    price: number;
    discount: number;
    total: number;
}

function useGetCartList() {
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>();

    const [responses, setResponses] = useState<Product[]>([]);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [grandDiscount, setGrandDiscount] = useState<number>(0);
    const [grandCount, setGrandCount] = useState<number>(0);
    const [grandPrice, setGrandPrice] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getCartList = useCallback(async () => {
        // if (!userId) return;

        try {
            setLoading(true);
            setError(null);
            // 실제 API 요청 부분
            const response = {
                data: [{
                    "pNum": "P001",
                    "pName": "Product 1",
                    "count": 10,
                    "price": 100,
                    "discount": 10,
                    "total": 90
                },
                {
                    "pNum": "P002",
                    "pName": "Product 2",
                    "count": 5,
                    "price": 200,
                    "discount": 20,
                    "total": 180
                },
                {
                    "pNum": "P003",
                    "pName": "Product 3",
                    "count": 3,
                    "price": 300,
                    "discount": 15,
                    "total": 285
                },
                {
                    "pNum": "P004",
                    "pName": "Product 4",
                    "count": 7,
                    "price": 400,
                    "discount": 25,
                    "total": 375
                },
                {
                    "pNum": "P005",
                    "pName": "Product 5",
                    "count": 12,
                    "price": 150,
                    "discount": 5,
                    "total": 145
                }],
                status: 200
            };

            if (response.status === 200) {
                const cartItems = response.data;
                setResponses(cartItems);
            } else {
                throw new Error("Failed to fetch cart data");
            }
        } catch (error: any) {
            setError(error);
            console.error(`Error fetching cart data: ${error}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCartList();
    }, []); // getCartList가 변경될 때마다 실행
    

    useEffect(() => {
        let newGrandTotal = 0;
        let newGrandDiscount = 0;
        let newGrandCount = 0;
        let newGrandPrice = 0;

        responses.forEach(product => {
            newGrandTotal += product.total;
            newGrandDiscount += product.discount * product.count;
            newGrandCount += product.count;
            newGrandPrice += product.price * product.count;
        });

        setGrandTotal(newGrandTotal);
        setGrandDiscount(newGrandDiscount);
        setGrandCount(newGrandCount);
        setGrandPrice(newGrandPrice);
    }, [responses]); //리스트 내용 변경이 일어날때 마다 계산

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
