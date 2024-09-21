import { useCallback, useEffect, useState } from "react";
import { Order}  from "../types";

function useGetOrderList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orderList, setOrderList] = useState<Order[]>([]);

    const getOrderlist = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Fetching Order List...');
            const jsonResponse = {
                "orders": [
                    {
                        "id": "order12345",
                        "orderDate": "2024-05-28",
                        "productList": [
                            {
                                "pNum": "P001",
                                "category": "Electronics",
                                "pName": "Smartsssssssssss냐냐냐ㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑphone",
                                "pMainImage": "https://static.thcdn.com/images/large/webp//productimg/1600/1600/13687585-1625000373316641.jpg",
                                "price": 4845484,
                                "count": 1
                            },
                            {
                                "pNum": "P002",
                                "category": "Home Appliance",
                                "pName": "Blender",
                                "pMainImage": "https://example.com/images/blender.jpg",
                                "price": 4861315,
                                "count": 2
                            },
                            {
                                "pNum": "P003",
                                "category": "Home Appliance",
                                "pName": "Blender",
                                "pMainImage": "https://example.com/images/blender.jpg",
                                "price": 48215,
                                "count": 2
                            }
                        ],
                        "tag": true,
                        "totalProductPrice": 1000000,
                        "totalDiscountPrice": 100,
                        "paymentCard": '신한카드',
                        "paymentCardNum": '4221555845457878',
                        "totalPaymentPrice": 999900,
                    },
                    {
                        "id": "order12346",
                        "orderDate": "2024-05-27T11:23:45.678Z",
                        "productList": [
                            {
                                "pNum": "P003",
                                "category": "Books",
                                "pName": "TypeScript Handbook",
                                "pMainImage": "https://example.com/images/typescript_handbook.jpg",
                                "price": 29.99,
                                "count": 3
                            },
                            {
                                "pNum": "P004",
                                "category": "Clothing",
                                "pName": "T-shirtsssssssssssssssssssssssssssssssssssssssssss",
                                "pMainImage": "https://example.com/images/tshirt.jpg",
                                "price": 19.99,
                                "count": 5
                            }
                        ],
                        "tag": false,
                        "totalProductPrice": 1000000,
                        "totalDiscountPrice": 100,
                        "paymentCard": '신한카드',
                        "paymentCardNum": '4221555845457878',
                        "totalPaymentPrice": 999900,
                    },
                    {
                        "id": "order12347",
                        "orderDate": "2024-05-26T10:12:34.567Z",
                        "productList": [
                            {
                                "pNum": "P005",
                                "category": "Grocery",
                                "pName": "Organic Apples",
                                "pMainImage": "https://example.com/images/apples.jpg",
                                "price": 5.99,
                                "count": 10
                            }
                        ],
                        "tag": true,
                        "totalProductPrice": 1000000,
                        "totalDiscountPrice": 100,
                        "paymentCard": '신한카드',
                        "paymentCardNum": '4221555845457878',
                        "totalPaymentPrice": 999900,
                    }]
            }
            setOrderList(jsonResponse.orders);
        } catch (error: any) {
            console.error('Failed to fetch order list: ', error);
            setError(error);
        } finally {
            console.log('Fetch Done.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getOrderlist();
    }, [])

    return {
        loading,
        error,
        orderList,
    }
}
export default useGetOrderList;