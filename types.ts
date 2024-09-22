//클래스 다이어그램 설계와 동일하게 인터페이스 정의

export interface Product {
    Product_id: number,
    Product_name: string,
    Price: number,
    Category: string,
    Main_image?: string,
    Discount?: number,
    Description: string,
    Location_id?: string,
}

export interface Order {
    id: string;
    orderDate: string;
    productList: OrderItem[];
    tag: boolean; // true: online, false: offline
    totalProductPrice: number;
    totalDiscountPrice: number;
    totalPaymentPrice: number;
    paymentCard: string;
    paymentCardNum: string;
}

export interface OrderItem {
    product: Product,
    quantity: number,
}

export interface Cart {
    Cart_id: number,
    items: CartItem[],
}

export interface CartItem {
    product: Product,
    quantity: number,
}

export interface Location {
    Location_id: number,
    Location_Name: string,
    Floor_info: string,
    Beacon_id: string,
}
