const express = require('express');
const app = express();
const uuidAPIKey = require('uuid-apikey');

const PORT = 3001;
const key = {
    apiKey: 'PFVBWWH-MDH49MC-J43VBCM-CSS8P1D',
    uuid: 'b3f6be72-a362-44d1-9107-b5b266728b05'
};

/* console.log(uuidAPIKey.create()); // API key 생성 */

/*app.listen(PORT, () => {
    console.log(Server running on http://localhost:${PORT});
});*/

app.listen(3001, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3001');
});

// 사용자 정보를 반환하는 API 예시
app.get('/api/users/:apikey/type/:type', async (req, res) => {
    let { apikey, type } = req.params;

    // API 키 유효성 검증
    if (!uuidAPIKey.check(apikey, key.uuid)) {
        return res.status(403).send('API key is not valid.');
    }

    if (type === 'seoul') {
        const data = [
            { name: "홍길동", city: "seoul" },
            { name: "김철수", city: "seoul" }
        ];
        res.send(data);
    } else if (type === 'jeju') {
        const data = [
            { name: "박지성", city: "jeju" },
            { name: "손흥민", city: "jeju" }
        ];
        res.send(data);
    } else {
        res.status(400).send('Type is not correct.');
    }
});

// 매출 정보를 반환하는 API 예시
app.get('/api/sales/:apikey/type/:year', async (req, res) => {
    let { apikey, year } = req.params;

    // API 키 유효성 검증
    if (!uuidAPIKey.check(apikey, key.uuid)) {
        return res.status(403).send('API key is not valid.');
    }

    if (year === '2019') {
        const data = [
            { product: "사과", amount: "1000" },
            { product: "바나나", amount: "2000" }
        ];
        res.send(data);
    } else if (year === '2020') {
        const data = [
            { product: "사과", amount: "3000" },
            { product: "손흥민", amount: "jeju" }
        ];
        res.send(data);
    } else {
        res.status(400).send('Year is not correct.');
    }
});