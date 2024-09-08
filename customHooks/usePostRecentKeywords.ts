import { useEffect, useRef } from "react";
import axios from "axios";

interface Keyword {
    pNum: string,
    pName: string
}

function usePostRecentKeywords(
    keywordArray: Keyword[],
    setKeywordArray: React.Dispatch<React.SetStateAction<Keyword[]>>) 
{
    const isInitialMount = useRef(true);

    useEffect(() => {
        if(isInitialMount.current){
            isInitialMount.current = false;
            return;
        }

        const postRecentKeywords = async () => {
            try {
                // 서버에 장바구니 상태를 POST
                console.log("Posting keywords ...");
                console.log(keywordArray);
            } catch (error) {
                console.error("Fail to update keywords:", error);
            } finally {
                console.log("Successfully posted keywords.");
            }
        };

        postRecentKeywords();

    }, [keywordArray, setKeywordArray])
}
export default usePostRecentKeywords;