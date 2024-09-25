// console.log('前端已加載');
const searchBox = document.getElementById('search-input');
const resultContainer = document.getElementById('result-container');
function searchWord() {
    console.log('searchWord');
    const word = document.getElementById('search-input').value.trim().toLowerCase();
    const resultContainer = document.getElementById('result-container');
    if (word === '') {
        resultDiv.innerHTML = '';
        return;
    }
    console.log('搜尋:', word);
    const results = dictionary.filter(item => item.english.toLowerCase().includes(word));
    displayResults(results);

}

function displayResults(results) {
    if (results.length === 0) {
        resultContainer.innerHTML = '<p>未找到對應的單字。</p>';
        return;
    }

    let tableHTML = `
        <table>
            <colgroup>
                <col>
                <col>
                <col>
            </colgroup>
            <thead>
                <tr>
                    <th>#</th>
                    <th>英文</th>
                    <th>中文</th>
                </tr>
            </thead>
            <tbody>
    `;

    results.forEach((entry, index) => {
        tableHTML += `
            <tr class="${index % 2 === 0 ? 'odd-row' : ''}">
                <td>${index + 1}</td>
                <td>${entry.english}</td>
                <td>${entry.chinese}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    resultContainer.innerHTML = tableHTML;
}



document.getElementById('search-button').addEventListener('click', searchWord);
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchWord();
    }
});

