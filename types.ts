//클래스 다이어그램 설계와 동일하게 인터페이스 정의

export interface Product {
    pNum: string,
    category?: string,
    pName?: string,
    price?: number,
    count?: number,
    discount?: number,
    pMainImage?: string,
    location?: string,
}

export interface Order {
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