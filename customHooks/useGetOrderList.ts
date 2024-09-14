import { useCallback, useEffect, useState } from "react";

interface Product {
    pNum: string;
    pCategory: string;
    pName: string;
    pImage: string;
    pPrice: number;
    quantity: number;  // 수량 추가
}

interface Order {
    id: string;
    orderDate: string;
    productList: Product[];
    tag: boolean; // true: online, false: offline
    totalProductPrice: number;
    totalDiscountPrice: number;
    paymentCard: string;
    paymentCardNum: string;
    totalPaymentPrice: number;
}

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
                                "pCategory": "Electronics",
                                "pName": "Smartsssssssssss냐냐냐ㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑㅑphone",
                                "pImage": "https://static.thcdn.com/images/large/webp//productimg/1600/1600/13687585-1625000373316641.jpg",
                                "pPrice": 4845484,
                                "quantity": 1
                            },
                            {
                                "pNum": "P002",
                                "pCategory": "Home Appliance",
                                "pName": "Blender",
                                "pImage": "https://example.com/images/blender.jpg",
                                "pPrice": 4861315,
                                "quantity": 2
                            },
                            {
                                "pNum": "P003",
                                "pCategory": "Home Appliance",
                                "pName": "Blender",
                                "pImage": "https://example.com/images/blender.jpg",
                                "pPrice": 48215,
                                "quantity": 2
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
                                "pCategory": "Books",
                                "pName": "TypeScript Handbook",
                                "pImage": "https://example.com/images/typescript_handbook.jpg",
                                "pPrice": 29.99,
                                "quantity": 3
                            },
                            {
                                "pNum": "P004",
                                "pCategory": "Clothing",
                                "pName": "T-shirtsssssssssssssssssssssssssssssssssssssssssss",
                                "pImage": "https://example.com/images/tshirt.jpg",
                                "pPrice": 19.99,
                                "quantity": 5
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
                                "pCategory": "Grocery",
                                "pName": "Organic Apples",
                                "pImage": "https://example.com/images/apples.jpg",
                                "pPrice": 5.99,
                                "quantity": 10
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