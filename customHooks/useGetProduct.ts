// usePostCartList.ts
import { useState, useCallback } from 'react';

interface Product {
    pNum: string;
    pName: string;
    count: number;
    price: number;
    discount: number;
    total: number;
}

function useGetProduct(initialResponses: Product[], setResponses: (responses: Product[]) => void) {
    const [barcodeData, setBarcodeData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    const handleBarcodeScan = useCallback(async (data: string) => {
        console.log(`Scanned: ${data}`);
        setBarcodeData(data);

        // 기존 response 배열에서 제품 찾기
        const foundProduct = initialResponses.find(product => product.pNum === data);

        if (foundProduct) {
            // 제품이 있으면 수량 업데이트
            const updateResponses = initialResponses.map(product => {
                if (product.pNum === data) {
                    const newCount = product.count + 1;
                    const newTotal = newCount * (product.price - product.discount);
                    return { ...product, count: newCount, total: newTotal };
                } else {
                    return product;
                }
            });
            setResponses(updateResponses);
        } else {
            // 제품이 없으면 새로운 제품 추가
            try {
                setLoading(true);
                setError(null);

                const jsonResponse = {
                    pNum: 'as123121412123',
                    pName: '이건 상품명ssssssssssssssssssssssssssss이다',
                    count: 1,
                    price: 100000,
                    discount: 10000,
                };
                const total = jsonResponse.price - jsonResponse.discount;
                const newProduct = {
                    pNum: jsonResponse.pNum,
                    pName: jsonResponse.pName,
                    count: jsonResponse.count,
                    price: jsonResponse.price,
                    discount: jsonResponse.discount,
                    total: total
                };
                setResponses([...initialResponses, newProduct]);
            } catch (error: any) {
                setError(error);
            } finally { 
                setLoading(true);
            }
        }
    }, [initialResponses, setResponses]);

    return {
        handleBarcodeScan,
        barcodeData,
    };
}

export default useGetProduct;
