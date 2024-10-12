//클래스 다이어그램 설계와 동일하게 인터페이스 정의

export interface Product {
    Product_id: string,
    Product_name: string,
    Price: number,
    Category: string,
    Main_image?: string,
    Discount: number | undefined,
    Description: string,
    Location_id?: number,
}

export interface Keyword {
    Keyword_id: number,
    Keyword_name: string,
}

export interface Order {
    id: string;
    orderDate: string;
    orderItems: OrderItem[];
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
    Floor_info: string,
    Location_name: string,
    Beacon_id: string,
}


export interface User{
    Userid: string, 
    Password: string,
    Name: string,
    Birthdate: Date,
    Gender: string,
    Phone_num: string,
    Email: string,
}