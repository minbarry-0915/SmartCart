import { useCallback, useEffect, useState } from "react";
import { Order } from "../types";
import axios from "axios";
import { REACT_NATIVE_BACKEND_IP } from "@env";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function useGetOrderList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orderList, setOrderList] = useState<Order[]>([]);
    const {userId} = useSelector((state:RootState)=>state.auth)
    const getOrderList = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Fetching Order List...');
            const jsonResponse = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}/api/orders/${userId}`);

            setOrderList(jsonResponse.data?.orders);
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
