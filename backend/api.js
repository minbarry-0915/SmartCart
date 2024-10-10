const express = require('express');
const app = express();
const uuidAPIKey = require('uuid-apikey');
const mysql = require('mysql2/promise'); // mysql2/promise를 사용하여 async/await를 지원
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
                `INSERT INTO Cart2 (Userid) VALUES (?)`, [Userid]
            );
            const newCartId = result.insertId;
            res.status(201).json({ messege: `Cannot Find Cart_id, Cart Created Successfully: ${newCartId}` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 카트 아이템 업데이트 API --- 연결 완
app.post('/api/cart', async (req, res) => {
    const { Userid, items } = req.body;

    if (!Userid || !Array.isArray(items) || items.length === 0) {
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
        for (const item of items) {
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
        return res.status(400).json({ message: 'User_id and Product_id are required.' });
    }

    // 트랜잭션 수행 시에 충돌을 방지하기 위해 새로운 db연결을 가져옴
    const connection = await db.getConnection(); // 데이터베이스 연결 가져오기
    await connection.beginTransaction(); // 트랜잭션 시작

    try {
        // User에 해당하는 Cart_id 조회
        const [cartRows] = await connection.query('SELECT Cart_id FROM Cart2 WHERE Userid = ?', [Userid]);

        if (cartRows.length === 0) {
            return res.status(404).json({ message: 'Cart not found for this user.' });
        }

        const Cart_id = cartRows[0].Cart_id;

        // 삭제할 아이템 존재 여부 확인
        const [itemCheck] = await connection.query(
            'SELECT * FROM Cart_Item WHERE Cart_id = ? AND Product_id = ?',
            [Cart_id, Product_id]
        );

        if (itemCheck.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }

        // Cart_Item 테이블에서 특정 상품 삭제
        console.log('Deleting cart item...');
        await connection.query(
            'DELETE FROM Cart_Item WHERE Cart_id = ? AND Product_id = ?',
            [Cart_id, Product_id]
        );

        console.log('Deletion Done.');

        await connection.commit(); // 트랜잭션 커밋
        res.status(200).json({ message: 'Item deleted from cart.' });
    } catch (err) {
        await connection.rollback(); // 에러 발생 시 트랜잭션 롤백
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        connection.release(); // 데이터베이스 연결 해제
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

// 제품 위치정보 조회 API -- 연결 완
app.get('/api/locations/:Location_id', async (req, res) => {
    const { Location_id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT * FROM Location WHERE Location_id = ?`,
            [Location_id]
        );

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Location not found.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

// 검색 기록 조회 API -- 연결 완
app.get('/api/search/history/:User_id', async (req, res) => {
    const { User_id } = req.params;

    try {
        console.log('Getting Search Keywords...');
        const [rows] = await db.query('SELECT * FROM Search_History WHERE Userid = ?', [User_id]);

        res.json(rows);
        console.log('Done.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 검색 기록 업데이트 API -- 연결 완
app.post('/api/search/history', async (req, res) => {
    const { Userid, Keyword } = req.body;

    // Userid와 Keyword가 제공되었는지 확인
    if (!Userid || !Keyword) {
        return res.status(400).json({ message: 'User_id and Keyword are required.' });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction(); // 트랜잭션 시작

    try {
        console.log('Updating Search Keywords...');

        // 검색 기록 업데이트 (INSERT 쿼리)
        const result = await connection.query('INSERT INTO Search_History (Keyword_name, Userid) VALUES (?, ?)', [Keyword, Userid]);

        // 삽입 결과에 따라 트랜잭션 커밋
        if (result[0].affectedRows > 0) {
            await connection.commit(); // 트랜잭션 커밋
            res.status(201).json({ message: 'Search keyword updated successfully.' });
        } else {
            await connection.rollback(); // 트랜잭션 롤백
            res.status(500).json({ message: 'Failed to update search history.' });
        }

    } catch (error) {
        console.error('Failed to update search history: ', error);
        await connection.rollback(); // 에러 발생 시 롤백
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        connection.release(); // 연결 해제
        console.log('Update Done.');
    }
});

// 검색 기록 삭제 API -- 연결 완
app.delete('/api/search/history', async (req, res) => {
    const { Userid, Keyword_id } = req.body;

    if (!Userid || !Keyword_id) {
        return res.status(400).json({ message: 'Userid and Keyword_id are required.' });
    }

    const connection = await db.getConnection(); // DB 연결 가져오기
    await connection.beginTransaction(); // 트랜잭션 시작

    try {
        console.log('Deleting Search Keyword: ', Keyword_id);
        const [result] = await connection.query( // connection 사용
            'DELETE FROM Search_History WHERE Keyword_id = ? AND Userid = ?',
            [Keyword_id, Userid]
        );

        // result.affectedRows가 0이면 삭제된 항목이 없음
        if (result.affectedRows > 0) {
            await connection.commit(); // 성공 시 트랜잭션 커밋
            res.status(200).json({ message: 'Item deleted from Search_History.' });
        } else {
            console.log('Cannot find keyword matched to keyword_id');
            res.status(404).json({ message: 'No matching keyword found to delete.' });
        }
    } catch (error) {
        console.error('Failed to delete keyword: ', error);
        await connection.rollback(); // 에러 발생 시 트랜잭션 롤백
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        connection.release(); // 연결 반환
        console.log('Deletion Done.');
    }
});

// 키워드 기반 검색 결과 반환 API -- 진행 중
/* ex) "코카" || "마" 만 입력해도 결과 반환됨 */
app.get('/api/search', async (req, res) => {
    const { keyword } = req.query;

    try {
        // 검색 키워드가 없으면 오류 반환
        if (!keyword) {
            return res.status(400).json({ error: '검색 키워드가 필요합니다.' });
        }

        console.log(`Keyword: ${keyword}로 검색 결과를 조회합니다.`);

        // 예시 더미 데이터
        const searchResults = [
            {
                Product_id: 1234,
                Product_name: '코카콜라',
                Price: 1320,
                Category: '음료',
                Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                Discount: 0,
                Description: 'Refreshing soft drink',
            },
            {
                Product_id: 21321,
                Product_name: '마이프로틴',
                Price: 18000,
                Category: '단백질',
                Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                Discount: 2000,
                Description: 'High-quality protein powder',
            },
            {
                Product_id: 32523523,
                Product_name: '초코바',
                Price: 2500,
                Category: '간식',
                Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                Discount: 500,
                Description: 'Delicious chocolate snack',
            },
            // 추가 데이터...
        ];

        // 검색 키워드와 일치하는 결과 필터링 (이 예시에서는 더미 데이터 반환)
        const filteredResults = searchResults.filter(product =>
            product.Product_name.includes(keyword)
        );

        res.json({ data: filteredResults });
    } catch (err) {
        console.error('검색 결과 조회 실패:', err);
        res.status(500).json({ error: '검색 결과를 조회하는 중 오류가 발생했습니다.' });
    }
});

let verificationCodes = {};

// 아이디 찾기 API
app.get('/api/request_verification/:Email', async (req, res) => {
    const { Email } = req.params;

    try {
        // 이메일 조회
        const [rows] = await db.query('SELECT Userid, Email FROM User3 WHERE Email = ?', [Email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: '이메일을 찾을 수 없습니다.' });
        }

        // 인증 코드 생성
        const verificationCode = crypto.randomBytes(3).toString('hex'); // 6자리 인증 코드 생성

        // 인증 객체에 코드와 만료 시간 저장 (10분 유효)
        verificationCodes[Email] = { code: verificationCode, expires: Date.now() + 600000 };

        // 이메일 전송을 위한 nodemailer 설정
        const transporter = nodemailer.createTransport({
            pool: true,
            maxConnections: 1,
            service: 'naver',
            host: 'smtp.naver.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER, // 발신자 이메일 주소
            to: Email, // 사용자가 입력한 이메일 주소
            subject: 'SMART CART 인증 관련 메일입니다.',
            html: `<h1>10분 안에 하단의 인증번호를 입력해주세요</h1><p>인증번호: ${verificationCode}</p>`, // 인증 코드 포함
        };

        // 이메일 전송
        await transporter.sendMail(mailOptions);
        res.json({ ok: true, message: '메일 전송에 성공하였습니다.', authNum: verificationCode });
    } catch (err) {
        console.error('메일 전송 오류:', err);
        res.status(500).json({ ok: false, message: '메일 전송에 실패하였습니다.' });
    }
});

// 인증 코드 확인 및 아이디 반환 API
app.post('/api/verify_code/id', async (req, res) => {
    const { Email, Code } = req.body;

    try {
        const savedCode = verificationCodes[Email]; // email로 가지고 있던 코드 조회
        if (!savedCode || savedCode.expires < Date.now()) {
            return res.status(400).json({ message: '인증 코드가 유효하지 않거나 만료되었습니다.' });
        }

        if (savedCode.code !== Code) {
            return res.status(400).json({ message: '잘못된 인증 코드입니다.' });
        }

        const [rows] = await db.query('SELECT Userid FROM User3 WHERE Email = ?', [Email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // 인증 완료 후 인증 코드 삭제 (메모리 관리)
        delete verificationCodes[Email];

        const user = rows[0];
        res.status(200).json({ userId: user.Userid });
    } catch (err) {
        console.error('데이터베이스 오류:', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 비밀번호 찾기 API
app.get('/api/verificataion_requset/:Userid', async (req, res) => {
    const Userid = req.params;

    try {
        const [rows] = await db.query('SELECT Email FROM User3 WHERE Userid = ?', [Userid]);

        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const user = rows[0];
        // 인증 코드 생성
        const verificationCode = crypto.randomBytes(3).toString('hex'); // 6자리 인증 코드 생성

        // 인증 객체에 코드와 만료 시간 저장 (10분 유효)
        verificationCodes[Userid] = { code: verificationCode, expires: Date.now() + 600000 };
        // 이메일 전송을 위한 nodemailer 설정
        const transporter = nodemailer.createTransport({
            pool: true,
            maxConnections: 1,
            service: 'naver',
            host: 'smtp.naver.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER, // 발신자 이메일 주소
            to: user.Email, // 사용자가 입력한 이메일 주소
            subject: 'SMART CART 인증 관련 메일입니다.',
            html: `<h1>10분 안에 하단의 인증번호를 입력해주세요</h1><p>인증번호: ${verificationCode}</p>`, // 인증 코드 포함
        };

        // 이메일 전송
        await transporter.sendMail(mailOptions);
        res.json({ ok: true, message: '메일 전송에 성공하였습니다.', authNum: verificationCode });
    } catch (err) {
        console.error('메일 전송 오류:', err);
        res.status(500).json({ ok: false, message: '메일 전송에 실패하였습니다.' });
    }
})

// 인증 코드 확인 및 비밀번호 반환 API
app.post('/api/verify_code/password', async (req, res) => {
    const {Userid, Code } = req.body;

    try {
        const savedCode = verificationCodes[Userid]; // email로 가지고 있던 코드 조회
        if (!savedCode || savedCode.expires < Date.now()) {
            return res.status(400).json({ message: '인증 코드가 유효하지 않거나 만료되었습니다.' });
        }

        if (savedCode.code !== Code) {
            return res.status(400).json({ message: '잘못된 인증 코드입니다.' });
        }

        const [rows] = await db.query('SELECT Password FROM User3 WHERE Userid = ?', [Userid]);

        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // 인증 완료 후 인증 코드 삭제 (메모리 관리)
        delete verificationCodes[Userid];

        const user = rows[0];
        res.status(200).json({ userId: user.Password });
    } catch (err) {
        console.error('데이터베이스 오류:', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 유저 정보 조회 API -- 연결 완
app.get('/api/user/:Userid', async (req, res) => {
    const { Userid } = req.params; // 요청에서 Userid 추출

    try {
        // 데이터베이스에서 유저 정보 조회
        const [rows] = await db.query(
            'SELECT Userid, Password, Name, Birthdate, Gender, Phone_num, Email FROM User3 WHERE Userid = ?',
            [Userid]
        );

        // 유저 정보가 존재하는지 확인
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 유저 정보 반환
        const user = rows[0];
        res.json({
            Userid: user.Userid,
            Password: user.Password,
            Name: user.Name,
            Birthdate: user.Birthdate,
            Gender: user.Gender,
            Phone_num: user.Phone_num,
            Email: user.Email
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Failed to fetch user information' });
    }
});

// 유저 정보 업데이트 API -- 연결 완
app.patch('/api/user/:Userid', async (req, res) => {
    const { Userid } = req.params;
    const { Name, Birthdate, Gender, Phone_num, Email, Password } = req.body;

    // 업데이트할 필드를 객체로 만들기
    const updatedFields = {};
    if (Name) updatedFields.Name = Name;
    if (Birthdate) updatedFields.Birthdate = Birthdate;
    if (Gender) updatedFields.Gender = Gender;
    if (Phone_num) updatedFields.Phone_num = Phone_num;
    if (Email) updatedFields.Email = Email;
    if (Password) updatedFields.Password = Password;

    // 업데이트 쿼리 작성
    const query = `UPDATE User3 SET ? WHERE Userid = ?`;

    try {
        console.log('Patching userinfo: ', Userid);
        const [result] = await db.query(query, [updatedFields, Userid]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'User information updated successfully.' });
        } else {
            res.status(404).send('User not found.');
        }
    } catch (err) {
        console.error('Failed to patch userinfo', err);
        res.status(500).send('Internal Server Error');
    } finally {
        console.log('Patch done.');
    }
});

// 주문 목록 조회 API
app.get('/api/orders/orderList', async (req, res) => {
    try {
        const orders = [
            {
                id: "order12345",
                orderDate: "2024-05-28",
                orderItems: [
                    {
                        product: {
                            Product_id: 1,
                            Product_name: "Smartphone",
                            Price: 4845484,
                            Category: "Electronics",
                            Main_image: "https://static.thcdn.com/images/large/webp//productimg/1600/1600/13687585-1625000373316641.jpg",
                            Discount: undefined,
                            Description: "Latest smartphone",
                        },
                        quantity: 1,
                    },
                    {
                        product: {
                            Product_id: 2,
                            Product_name: "Blender",
                            Price: 4861315,
                            Category: "Home Appliance",
                            Main_image: "https://example.com/images/blender.jpg",
                            Discount: undefined,
                            Description: "High-quality blender",
                        },
                        quantity: 1,
                    }
                ],
                tag: true,
                totalProductPrice: 1000000,
                totalDiscountPrice: 100,
                paymentCard: '신한카드',
                paymentCardNum: '4221555845457878',
                totalPaymentPrice: 999900,
            },
            {
                id: "order12346",
                orderDate: "2024-05-27T11:23:45.678Z",
                orderItems: [
                    {
                        product: {
                            Product_id: 3,
                            Product_name: "TypeScript Handbook",
                            Price: 2999,
                            Category: "Books",
                            Main_image: "https://example.com/images/typescript_handbook.jpg",
                            Discount: undefined,
                            Description: "Learn TypeScript",
                        },
                        quantity: 1,
                    },
                    {
                        product: {
                            Product_id: 4,
                            Product_name: "T-shirt",
                            Price: 1999,
                            Category: "Clothing",
                            Main_image: "https://example.com/images/tshirt.jpg",
                            Discount: undefined,
                            Description: "Comfortable t-shirt",
                        },
                        quantity: 5,
                    }
                ],
                tag: false,
                totalProductPrice: 1000000,
                totalDiscountPrice: 100,
                paymentCard: '신한카드',
                paymentCardNum: '4221555845457878',
                totalPaymentPrice: 999900,
            }
        ];

        // 주문 목록 반환
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Failed to fetch order list: ', error);
        res.status(500).json({ message: 'Failed to fetch order list' });
    }
});




// 상품 스캔 결과 반환 API -- 프론트 처리 예정
/* 바코드 스캔에 따라 상품 정보 업데이트하거나 새로운 상품을 추가 */

// let cartItems = []; // 이 배열에 장바구니 아이템들을 저장 
// app.post('/api/products/scan', (req, res) => {
//     const { barcode } = req.body;

//     if (!barcode) {
//         return res.status(400).json({ error: 'Barcode is required.' });
//     }

//     // 기존 장바구니에서 상품 찾기
//     const foundItem = cartItems.find(item => item.product.Product_id.toString() === barcode);

//     if (foundItem) {
//         // 제품이 있으면 수량 업데이트
//         foundItem.quantity += 1;
//         return res.status(200).json({ message: 'Quantity updated', cartItems });
//     } else {
//         // 제품이 없으면 새로운 상품 추가
//         const newItem = {
//             product: {
//                 Product_id: 530244373975,
//                 Product_name: "Product 12345678",
//                 Price: 150,
//                 Discount: 5,
//                 Description: "Description of Product 5",
//                 Category: "Category 5",
//             },
//             quantity: 1,
//         };

//         cartItems.push(newItem);
//         return res.status(201).json({ message: 'New item added', cartItems });
//     }
// });




// 추천 제품 목록 반환 API -- 진행 중
app.get('/api/recommend-products', async (req, res) => {
    try {
        // 더미 데이터 대신 데이터베이스에서 추천 제품을 조회할 수 있습니다.
        const recommendedProducts = [
            {
                Product_id: 1234,
                Product_name: '코카콜라',
                Price: 1320,
                Category: '음료',
                Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                Discount: undefined,
                Description: 'Refreshing beverage',
            },
            {
                Product_id: 21321,
                Product_name: '마이프로틴',
                Price: 18000,
                Category: '단백질',
                Main_image: 'https://static.thcdn.com/images/small/webp/widgets/83-kr/16/mp-core-10530943-437x437-124817-120616.jpg',
                Discount: undefined,
                Description: 'High-quality protein powder',
            },
            // 추가 데이터...
        ];

        // 응답으로 추천 제품 목록을 전송
        res.json({ data: recommendedProducts });
    } catch (error) {
        console.error('Failed to fetch recommended products:', error);
        res.status(500).json({ message: 'Failed to fetch recommended products' });
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



