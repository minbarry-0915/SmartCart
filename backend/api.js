const express = require('express');
const app = express();
const uuidAPIKey = require('uuid-apikey');
const mysql = require('mysql2/promise'); // mysql2/promise를 사용하여 async/await를 지원
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const PORT = 3001;
const key = {
    apiKey: process.env.PERSONAL_API_KEY,
    uuid: process.env.UUID
};

/* console.log(uuidAPIKey.create()); // API key 생성 */

/*app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});*/


// MariaDB 연결 설정
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME, // MariaDB 사용자 이름
    password: process.env.MYSQL_PASSWORD, // MariaDB 사용자 비밀번호
    database: process.env.MYSQL_DATABASE, // 사용할 데이터베이스 이름
    port: process.env.MYSQL_PORT
});

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

// 로그인 API
app.post('/api/login', async (req, res) => {
    const { userid, password } = req.body;

    if (!userid || !password) {
        return res.status(400).send('User ID and password are required.');
    }

    try {
        // 사용자 입력값을 SQL 쿼리에 안전하게 삽입하기 위해 준비된 쿼리 사용
        const [rows] = await db.query('SELECT * FROM User WHERE userid = ? AND password = ?', [userid, password]);

        if (rows.length > 0) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid user ID or password.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 회원가입 API
app.post('/api/register', async (req, res) => {
    const { userId, password, phoneNumber, name, email } = req.body;

    // 입력 검증
    if (!userId || !password || !phoneNumber || !name || !email) {
        return res.status(400).json({ message: '모든 필드를 입력해 주세요.' });
    }

    try {
        // 데이터베이스에 데이터 삽입
        const [result] = await db.query(
            'INSERT INTO User (userid, password, Phone_Num, Name, Email) VALUES (?, ?, ?, ?, ?)',
            [userId, password, phoneNumber, name, email]
        );

        res.status(201).json({ message: '회원가입 성공!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});


// (디비연결 test용) 사용자 정보 반환 API
app.get('/api/users/:apikey/type/:type', async (req, res) => {
    let { apikey, type } = req.params;

  /*  // API 키 유효성 검증
    if (!uuidAPIKey.check(apikey, key.uuid)) {
        return res.status(403).send('API key is not valid.');
    }*/

    if (!await checkApiKey(apikey)) {
        return res.status(403).send('API key is not valid.');
    }


    try {
        const [rows] = await db.query('SELECT Name FROM User WHERE Gender = "Male"', [type]);
        
        if (rows.length > 0) {
            res.send(rows);
        } else {
            res.status(400).send('Type is not correct.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 상품 목록 조회 API
app.get('/api/products/:apikey', verifyApiKey, async (req, res) => {
    try {
        // 필요한 제품 정보를 선택합니다. 
        const [rows] = await db.query('SELECT Product_id, Product_Name, Price, Category FROM Product');

        if (rows.length > 0) {
            res.json(rows); // JSON 형태로 데이터 전송
        } else {
            res.status(404).send('No products found.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// 상품 추가 API
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
            'INSERT INTO Product (Product_Name, Price, Category) VALUES (?, ?, ?)',
            [Product_Name, Price, Category]
        );

        res.status(201).send({ message: 'Product added successfully', productId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// 매출 정보를 반환하는 API 예시
app.get('/api/sales/:apikey/type/:year', async (req, res) => {
    let { apikey, year } = req.params;

    // API 키 유효성 검증
    if (!uuidAPIKey.check(apikey, key.uuid)) {
        return res.status(403).send('API key is not valid.');
    }

    try {
        const [rows] = await db.query('SELECT Product_Name FROM Product Where ~~수정~~', [year]);

        if (rows.length > 0) {
            res.send(rows);
        } else {
            res.status(400).send('Year is not correct.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});