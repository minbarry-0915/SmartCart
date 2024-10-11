import { useState, useCallback } from 'react';
import { Product, CartItem } from '../types';
import axios from 'axios';
import { REACT_NATIVE_BACKEND_IP } from '@env';

//장바구니 바코드 스캔 처리용 custom hook
// -- 연결 중 -- 
function useGetProduct(initialResponses: CartItem[], setResponses: React.Dispatch<React.SetStateAction<CartItem[]>>) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product>();

    const handleBarcodeScan = useCallback(async (data: string) => {
        console.log(`Barcode Scanned: ${data}`);
        
        //기존 장바구니 목록에서 검색
        const foundItem = initialResponses.find(item => item.product.Product_id.toString() === data);
    
        if (foundItem) {
            // 제품이 있으면 수량 업데이트
            console.log('Product already in the cart list.');
            setResponses(prevResponses => {
                const updatedResponses = prevResponses.map(item => 
                    item.product.Product_id.toString() === data 
                    ? { ...item, quantity: item.quantity + 1 } // 수량 증가
                    : item
                );
                // console.log('Updated responses after found item:', updatedResponses); // 로그 추가
                return updatedResponses;
            });
        } else {
            try {
                setLoading(true);
                setError(null);
                console.log('Cannot find product in cart list, getting data from server...');
                console.log(REACT_NATIVE_BACKEND_IP);
                const jsonResponse = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}/api/products/${data}`);
                console.log(jsonResponse.data);

                const newProduct = jsonResponse.data;

                const newItem: CartItem = {
                    product: newProduct,  // 바로 jsonResponse.data 사용
                    quantity: 1,
                };
    
                setResponses(prevResponses => {
                    const updatedResponses = [...prevResponses, newItem];
                    console.log('Updated responses after adding new item:', updatedResponses);
                    return updatedResponses;
                });
            } catch (error: any) {
                setError(error);
                console.log('Failed to get product info.',error);
            } finally {
                console.log('Done.');
                setLoading(false);
            }
        }
    }, [initialResponses, setResponses]);
    

    return {
        handleBarcodeScan
    };
}

export default useGetProduct;
