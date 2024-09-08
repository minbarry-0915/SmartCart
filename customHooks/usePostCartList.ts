import { useEffect, useRef } from "react";
import axios from "axios";

interface Product {
    pNum: string;
    pName: string;
    count: number;
    price: number;
    discount: number;
    total: number;
}

function usePostCartList(responses: Product[], setResponses: React.Dispatch<React.SetStateAction<Product[]>>) {
    const isInitialMount = useRef(true);
   
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // 장바구니 상태가 변경될 때마다 서버에 POST 요청을 보냅니다.
        const postCartList = async () => {
            try {
                // 서버에 장바구니 상태를 POST
                console.log("Posting cart list...");

            } catch (error) {
                console.error("Fail to update cart list:", error);
            } finally {
                console.log("Successfully posted cart list.");
            }
        };

        postCartList();

    }, [responses, setResponses]);
};

export default usePostCartList;
