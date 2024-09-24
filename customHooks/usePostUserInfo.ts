import { User } from "../types";

function usePostUserInfo({Userid, Password, Name, BirthDate, Gender, Phone_Num, Email}: User){
    const postUserInfo = async() =>{
        const jsonResponse = {
            'body':{
                'Userid': {Userid},
                'Password': {Password},
                'BirthDate': {BirthDate},
                'Gender': {Gender},
                'Phone_Num': {Phone_Num},
                'Email': {Email}
            }
        }
    }
}
export default usePostUserInfo;