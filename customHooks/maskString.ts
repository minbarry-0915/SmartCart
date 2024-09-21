const maskNumber = (number: string) => {
    const visibleDigits = number.slice(0, 7); // 처음 7자리
    const maskedDigits = '*'.repeat(number.length - 7); // 나머지를 *로 대체

    // 하이픈을 추가하는 함수
    /*
    정규 표현식 /(.{4})/g, '$1-'의 의미는 다음과 같습니다:

    /: 정규 표현식의 시작과 끝을 나타냅니다.

    (.{4}):

    .는 어떤 문자든 하나를 의미합니다.
    {4}는 바로 앞의 문자가 정확히 4개 연속으로 나타나는 경우를 찾겠다는 의미입니다.
    따라서, (.{4})는 4개의 문자를 하나의 그룹으로 캡처합니다.
    g: 전역 검색 플래그입니다. 문자열 전체에서 일치하는 모든 부분을 찾아야 함을 나타냅니다.

    '$1-':

    $1은 첫 번째 캡처 그룹 (즉, (.{4})로 캡처된 4개의 문자)을 의미합니다.
    그 뒤에 하이픈 -을 추가합니다
    */
    const addHyphens = (num: string) => {
        const withHyphens = num.replace(/(.{4})/g, '$1-'); // 4자리마다 하이픈 추가
        return withHyphens.endsWith('-') ? withHyphens.slice(0, -1) : withHyphens; // 마지막 하이픈 제거
    };

    // 결과 생성
    const maskedNumber = `${visibleDigits}${maskedDigits}`;
    return addHyphens(maskedNumber);
};

export default maskNumber;
