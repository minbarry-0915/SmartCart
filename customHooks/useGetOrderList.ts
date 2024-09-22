import { useCallback, useEffect, useState } from "react";
import { Order } from "../types";

function useGetOrderList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orderList, setOrderList] = useState<Order[]>([]);

    const getOrderList = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Fetching Order List...');
            const jsonResponse = {
                orders: [
                    {
                        id: "order12345",
                        orderDate: "2024-05-28",
                        orderItems: [ // 변경: orderItems로
                            {
                                product: {
                                    Product_id: 1,
                                    Product_name: "Smartphone",
                                    Price: 4845484,
                                    Category: "Electronics",
                                    Main_image: "https://static.thcdn.com/images/large/webp//productimg/1600/1600/13687585-1625000373316641.jpg",
                                    Discount: undefined,
                                    Description: "Latest smartphone",
                                },
                                quantity: 1,
                            },
                            {
                                product: {
                                    Product_id: 2,
                                    Product_name: "Blender",
                                    Price: 4861315,
                                    Category: "Home Appliance",
                                    Main_image: "https://example.com/images/blender.jpg",
                                    Discount: undefined,
                                    Description: "High-quality blender",
                                },
                                quantity: 1,
                            }
                        ],
                        tag: true,
                        totalProductPrice: 1000000,
                        totalDiscountPrice: 100,
                        paymentCard: '신한카드',
                        paymentCardNum: '4221555845457878',
                        totalPaymentPrice: 999900,
                    },
                    {
                        id: "order12346",
                        orderDate: "2024-05-27T11:23:45.678Z",
                        orderItems: [
                            {
                                product: {
                                    Product_id: 3,
                                    Product_name: "TypeScript Handbook",
                                    Price: 2999,
                                    Category: "Books",
                                    Main_image: "https://example.com/images/typescript_handbook.jpg",
                                    Discount: undefined,
                                    Description: "Learn TypeScript",
                                },
                                quantity: 1,
                            },
                            {
                                product: {
                                    Product_id: 4,
                                    Product_name: "T-shirt",
                                    Price: 1999,
                                    Category: "Clothing",
                                    Main_image: "https://example.com/images/tshirt.jpg",
                                    Discount: undefined,
                                    Description: "Comfortable t-shirt",
                                },
                                quantity: 5,
                            }
                        ],
                        tag: false,
                        totalProductPrice: 1000000,
                        totalDiscountPrice: 100,
                        paymentCard: '신한카드',
                        paymentCardNum: '4221555845457878',
                        totalPaymentPrice: 999900,
                    }
                ]
            };
            setOrderList(jsonResponse.orders);
        } catch (error: any) {
            console.error('Failed to fetch order list: ', error);
            setError(error.message || 'Failed to fetch order list');
        } finally {
            console.log('Fetch Done.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getOrderList();
    }, [getOrderList]);

    return {
        loading,
        error,
        orderList,
    };
}

export default useGetOrderList;
