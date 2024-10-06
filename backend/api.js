const express = require('express');
const app = express();
const uuidAPIKey = require('uuid-apikey');
const mysql = require('mysql2/promise'); // mysql2/promise를 사용하여 async/await를 지원
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();


const PORT = 3001;
const key = {
    apiKey: process.env.PERSONAL_API_KEY,
    uuid: process.env.UUID
};



// MariaDB 연결 설정
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME, // MariaDB 사용자 이름
    password: process.env.MYSQL_PASSWORD, // MariaDB 사용자 비밀번호
    database: process.env.MYSQL_DATABASE, // 사용할 데이터베이스 이름
    port: process.env.MYSQL_PORT
});

app.use(cors());

// JSON 요청 본문 파싱을 위한 미들웨어 추가
app.use(express.json());
// JSON 요청 본문을 파싱할 수 있도록 설정
app.use(bodyParser.json());

app.listen(3001, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3001');
});


// API 키 유효성 검증
async function checkApiKey(apikey) {
    const [rows] = await db.query(`SELECT * FROM apikeys WHERE apiKey = ?`, [apikey]);
    return rows.length > 0;
}

// API 키 검증 미들웨어
async function verifyApiKey(req, res, next) {
    const apikey = req.params.apikey || req.query.apikey;

    if (!apikey) {
        return res.status(400).send('API key is missing.');
    }

    if (!await checkApiKey(apikey)) {
        return res.status(403).send('API key is not valid.');
    }

    next();
}


// 로그인 API ---- 연결 완
app.post('/api/login', async (req, res) => {
    const { Userid, Password } = req.body;  // Userid로 변경

    if (!Userid || !Password) {
        return res.status(400).send('User ID and password are required.');
    }

    try {
        const [rows] = await db.query('SELECT * FROM User3 WHERE Userid = ? AND Password = ?', [Userid, Password]);

        if (rows.length > 0) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid user ID or Password.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// 회원가입 API ---- 연결 완
app.post('/api/register', async (req, res) => {
    const { Userid, Name, Password, Birthdate, Gender, Phone_num, Email } = req.body;

    // 입력 검증
    if (!Userid || !Name || !Password || !Birthdate || !Gender || !Phone_num || !Email) {
        return res.status(400).json({ message: '모든 필드를 입력해 주세요.' });
    }

    try {
        // 데이터베이스에 데이터 삽입
        const [result] = await db.query(
            'INSERT INTO User3 (Userid, Name, Birthdate, Gender, Phone_num, Email, Password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Userid, Name, Birthdate, Gender, Phone_num, Email, Password]
        );

        res.status(201).json({ message: '회원가입 성공!' });
    } catch (error) {
        console.error('Failed to register User:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- android ip connection test --- //
// app.get('/api/login', (req, res) => {
//     res.send('This route only supports POST requests');
// });


//카트 아이템 조회 API --- 연결 완
app.get('/api/cart/:apikey/:Userid', verifyApiKey, async (req, res) => {
    const { apikey, Userid } = req.params;

    try {
        // Cart2와 Cart_Item, Product3을 조인하여 유저의 카트에 담긴 상품 정보 조회
        const [rows] = await db.query(
            `SELECT ci.Product_id, p.Product_name, p.Price, p.Discount, ci.Quantity FROM Cart_Item ci
            JOIN Cart2 c ON ci.Cart_id = c.Cart_id
            JOIN Product3 p ON ci.Product_id = p.Product_id
            WHERE c.Userid = ?`,
            [Userid]
        );

        //조회 했는데 cart가 있으면
        if (rows.length > 0) {
            res.json(rows); // 유저의 카트에 담긴 상품 정보 반환
        } else { //cart가 없으면 cart 생성            
            const result = await db.query(
                `INSERT INTO Cart2 (Userid) VALUES (?)`,[Userid]
            );
            const newCartId = result.insertId;
            res.status(201).json({ messege: `Cannot Find Cart_id, Cart Created Successfully: ${newCartId}`});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 카트 아이템 업데이트 API --- 연결 완
app.post('/api/cart', async (req, res) => {
    const { Userid, items } = req.body;

    if ( !Userid || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'User_id and items are required.' });
    }

    try {
        // 1. Cart2 테이블에 Userid에 해당하는 Cart가 있는지 확인
        const [cartRows] = await db.query('SELECT Cart_id FROM Cart2 WHERE Userid = ?', [Userid]);

        let Cart_id;

        if (cartRows.length === 0) {
            // 해당 Userid로 Cart가 없다면 새로운 Cart 생성
            console.log('Cannot find Cart_id from Userid, Generate new Cart_id...');
            const [result] = await db.query('INSERT INTO Cart2 (Userid) VALUES (?)', [Userid]);
            Cart_id = result.insertId; // 새로 생성된 Cart_id 가져오기
        } else {
            // Cart가 있으면 Cart_id 가져오기
            Cart_id = cartRows[0].Cart_id;
        }

        // 2. 아이템 삽입 (또는 업데이트)
        for (const item of items){
            console.log('Updating cart items...');
            await db.query(
                'INSERT INTO Cart_Item (Cart_id, Product_id, Quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Quantity = ?',
                [Cart_id, item.Product_id, item.Quantity, item.Quantity]
            );
        }
        console.log('Update Done.');
        res.status(201).json({ message: '장바구니가 성공적으로 업데이트되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 카트 아이템 삭제 API -- 연결 완
app.delete('/api/cart', async (req, res) => {
    const { Userid, Product_id } = req.body;

    // Userid와 Product_id가 제공되었는지 확인
    if (!Userid || !Product_id) {
        return res.status(400).json({ message: 'User_id, Product_id are required.' });
    }

    try {
        // User에 해당하는 Cart_id 조회
        const [cartRows] = await db.query('SELECT Cart_id FROM Cart2 WHERE Userid = ?', [Userid]);
        
        if (cartRows.length === 0) {
            return res.status(404).json({ message: 'Cart not found for this user.' });
        }
        
        const Cart_id = cartRows[0].Cart_id;

        // 삭제할 아이템 존재 여부 확인
        const [itemCheck] = await db.query(
            'SELECT * FROM Cart_Item WHERE Cart_id = ? AND Product_id = ?',
            [Cart_id, Product_id]
        );

        if (itemCheck.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }
        
        // Cart_Item 테이블에서 특정 상품 삭제
        console.log('Deleting cart item...');
        const result = await db.query(
            'DELETE FROM Cart_Item WHERE Cart_id = ? AND Product_id = ?',
            [Cart_id, Product_id]
        );
        console.log('Deletion Done.');
        // 성공 메세지 반환
        res.status(200).json({ message: 'Item deleted from cart.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// 제품 세부정보 조회 API -- 연결 완
app.get('/api/products/:Product_id', async (req, res) => {
    const { Product_id } = req.params;

    try {
        // 특정 Product_id에 해당하는 제품 정보 조회
        const [rows] = await db.query(
            `SELECT * FROM Product3 WHERE Product_id = ?`,
            [Product_id]
        );

        if (rows.length > 0) {
            res.json(rows[0]); // JSON 형태로 제품 정보 반환
        } else {
            res.status(404).send('Product not found.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// 검색 기록 조회 API
app.get('/api/search/keywords/:User_id', async (req, res) => {
    const {User_id} = req.params;

    try{
        const [rows] = await db.query()
    }catch(err){

    }

});

/*
// 카트에 항목 추가 API
app.post('/api/cart-item', async (req, res) => {
    const { Product_id, User_id, Quantity } = req.body;

    // 입력 검증
    if (!Product_id || !User_id || !Quantity) {
        return res.status(400).json({ message: 'Product_id, User_id, and Quantity are required.' });
    }

    try {
        // Cart_Item 테이블에 데이터 삽입
        const [result] = await db.query(
            'INSERT INTO Cart_Item (Product_id, User_id, Quantity) VALUES (?, ?, ?)',
            [Product_id, User_id, Quantity]
        );

        // 삽입 결과 응답
        res.status(201).json({ message: 'Cart item added successfully', cartItemId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
*/

/*상품 목록 조회 API
app.get('/api/products/:apikey', verifyApiKey, async (req, res) => {
    try {
        // 필요한 제품 정보를 선택합니다. 
        const [rows] = await db.query('SELECT Product_id, Product_Name, Price, Category FROM Product2');

        if (rows.length > 0) {
            res.json(rows); // JSON 형태로 데이터 전송
        } else {
            res.status(404).send('No products found.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}); */


/* 상품 추가 API
app.post('/api/products/:apikey/add', async (req, res) => {
    const { apikey } = req.params;
    const { Product_Name, Price, Category } = req.body;

    // API 키 유효성 검증
    if (!await checkApiKey(apikey)) {
        return res.status(403).send('API key is not valid.');
    }

    try {
        // 새 상품 데이터 삽입
        const [result] = await db.query(
            'INSERT INTO Product2 (Product_Name, Price, Category) VALUES (?, ?, ?)',
            [Product_Name, Price, Category]
        );

        res.status(201).send({ message: 'Product added successfully', productId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}); */



