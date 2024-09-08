import { useState } from "react";

function useGetProductDetail(){
    

    const getProductDetail = async() => {
        const response = {
            "pNum": "1234",
            "category": "마이프로틴",
            "pName": "퓨처 웨이(Future Whey) 스트로베리 맛 ",
            "pMainImage": "https://static.thcdn.com/images/large/webp//productimg/1600/1600/13687585-1625000373316641.jpg",
            //상세페이지 이미지는 string array형태로 받음
            "pDetailImage": ["https://shop-phinf.pstatic.net/20230511_154/1683785993017aMJOa_PNG/%EC%9E%90%EC%82%B0_19.png?type=w860",
            // "https://shop-phinf.pstatic.net/20240418_53/17134278662846L3Ei_JPEG/%EC%9E%90%EC%82%B0_33x-100.jpg?type=w860"
            ],
            "price": 38900,
            "location": "e3",
        };  
    }
};
export default useGetProductDetail;