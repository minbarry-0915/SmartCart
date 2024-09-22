// useGetProduct.ts
import { useState, useCallback } from 'react';
import { Product, CartItem } from '../types';

function useGetProduct(initialResponses: CartItem[], setResponses: (responses: CartItem[]) => void) {
    const [barcodeData, setBarcodeData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleBarcodeScan = useCallback(async (data: string) => {
        console.log(`Scanned: ${data}`);
        setBarcodeData(data);

        // 기존 response 배열에서 제품 찾기
        const foundItem = initialResponses.find(item => item.product.Product_id.toString() === data);

        if (foundItem) {
            // 제품이 있으면 수량 업데이트
            const updateResponses = initialResponses.map(item => {
                if (item.product.Product_id.toString() === data) {
                    const newCount = item.quantity + 1;
                    return { ...item, quantity: newCount };
                } else {
                    return item;
                }
            });
            setResponses(updateResponses);
        } else {
            // 제품이 없으면 새로운 제품 추가
            try {
                setLoading(true);
                setError(null);

                const jsonResponse = {
                    Product_id: 12345678,
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
                setResponses([...initialResponses, newItem]);
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
