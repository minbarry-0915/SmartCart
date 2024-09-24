import { useState, useCallback } from 'react';
import { Product, CartItem } from '../types';

function useGetProduct(initialResponses: CartItem[], setResponses: React.Dispatch<React.SetStateAction<CartItem[]>>) {
    const [barcodeData, setBarcodeData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleBarcodeScan = useCallback(async (data: string) => {
        console.log(`Scanned: ${data}`);
        setBarcodeData(data);
    
        const foundItem = initialResponses.find(item => item.product.Product_id.toString() === data);
    
        if (foundItem) {
            // 제품이 있으면 수량 업데이트
            setResponses(prevResponses => {
                const updatedResponses = prevResponses.map(item => 
                    item.product.Product_id.toString() === data 
                    ? { ...item, quantity: item.quantity + 1 } // 수량 증가
                    : item
                );
                console.log('Updated responses after found item:', updatedResponses); // 로그 추가
                return updatedResponses;
            });
        } else {
            try {
                setLoading(true);
                setError(null);
    
                const jsonResponse = {
                    Product_id: 530244373975,
                    Product_name: "Product as12345678",
                    Price: 150,
                    Discount: 5,
                    Description: "Description of Product 5",
                    Category: "Category 5",
                    quantity: 12,
                };
                const newItem: CartItem = {
                    product: jsonResponse,
                    quantity: 1,
                };
    
                setResponses(prevResponses => {
                    const updatedResponses = [...prevResponses, newItem];
                    console.log('Updated responses after adding new item:', updatedResponses); // 로그 추가
                    return updatedResponses;
                });
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [initialResponses, setResponses]);
    

    return {
        handleBarcodeScan,
        barcodeData,
    };
}

export default useGetProduct;
