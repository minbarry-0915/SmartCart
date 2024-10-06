import { REACT_NATIVE_BACKEND_IP } from "@env";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";

// -- 연결 완 -- 
function useDeleteCartItem() {
    const { userId } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState<boolean>(false);
    
    const deleteCartItem = async (productId: string) => {
        setLoading(true); // 로딩 시작
        try {
            console.log(`Deleting cart item ${productId} from cart list...`);
            const jsonResponse = await axios.delete(`http://${REACT_NATIVE_BACKEND_IP}/api/cart`, {
                data: {
                    Userid: userId,
                    Product_id: productId
                }
            });

            console.log('Cart Item deletion complete:', productId);
            return true; // 성공 시 true 반환
        } catch (error) {
            console.error("Fail to delete cart item:", error);
            return false; // 실패 시 false 반환
        } finally {
            setLoading(false); // 로딩 종료
        }
    }

    return {
        deleteCartItem,
        loading // 로딩 상태 반환
    }
}

export default useDeleteCartItem;
