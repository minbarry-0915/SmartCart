import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CartItem } from "../types";
import { PERSONAL_API_KEY, REACT_NATIVE_BACKEND_IP } from "@env";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// -- 연결 완 -- 
function usePostCartList(responses: CartItem[], setResponses: React.Dispatch<React.SetStateAction<CartItem[]>>) {
    const isInitialMount = useRef(true);
    const {userId} = useSelector((state: RootState) => state.auth);
    const [initResponses, setInitResponses] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
   
    // 장바구니 상태가 변경될 때마다 서버에 POST 요청을 보냅니다.
    const postCartList = async () => {
        if (responses.length === 0) {
            console.log("No items to update.");
            return; // 빈 배열인 경우 종료
        }
        
        try {
            // 서버에 장바구니 상태를 POST
            console.log("Posting cart list...");
            setLoading(true);

            // responses 배열을 매핑하여 제품 ID와 수량을 포함시킴
            const cartItems = responses.map(item => ({
                Product_id : item.product.Product_id,
                Quantity: item.quantity
            }));

            const jsonResponse = await axios.post(`http://${REACT_NATIVE_BACKEND_IP}/api/cart`,{
                Userid: userId,
                items: cartItems
            })

            // console.log(jsonResponse.data);
        } catch (error) {
            console.log("Fail to update cart list:", error);
        } finally {
            setLoading(false);
            console.log("Posting cart list done.");
        }
    };

    useEffect(() => {
        if (isInitialMount.current) {
            setInitResponses(responses);
            isInitialMount.current = false;
            console.log('Initial Cart List Updated.');
            return;
        }

        postCartList();

    }, [responses, setResponses]);
};

export default usePostCartList;
