// API
const API_URL = 'https://opensheet.elk.sh/14yiC0kHoWzoDLSLByLNat8AHVfTrbgOj9y797G3o_Zg/syh_chiikawa';

let allData = [];
let currentCharacterData = []; 

// 1. load data
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();

        if (json.error) {
            document.getElementById('loading').innerText = "錯誤：讀取失敗，請確認分頁名稱";
            return;
        }

        allData = json;
        document.getElementById('loading').style.display = 'none';
        
        filterData('吉伊');

    } catch (e) {
        console.error(e);
        document.getElementById('loading').innerText = "連線失敗，請稍後再試";
    }
}

// 2. Character
function filterData(targetName) {
    // 變更主選單按鈕顏色
    document.querySelectorAll('.tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText === targetName) btn.classList.add('active');
    });

    // 篩選出該角色的所有資料
    // 注意：這裡假設你的 Sheet 欄位是 Character (若為中文請改 item.角色)
    currentCharacterData = allData.filter(item => item.Character === targetName);

    // 自動產生 Type 子分類按鈕
    generateTypeButtons();

    // 預設顯示「全部」類型
    renderGallery(currentCharacterData);
}

// 3. 產生子分類按鈕
function generateTypeButtons() {
    const subTabsContainer = document.getElementById('sub-tabs');
    subTabsContainer.innerHTML = ''; // 清空舊按鈕

    // 找出目前角色有哪些 Type (使用 Set 去除重複)
    // 注意：這裡假設你的 Sheet 欄位是 Type (若為中文請改 item.分類)
    const types = ['全部', ...new Set(currentCharacterData.map(item => item.Type || '未分類'))];

    // 如果只有「全部」或沒有 Type，就不用顯示子選單了
    if (types.length <= 2 && types.includes('未分類')) {
        return; 
    }

    types.forEach(type => {
        const btn = document.createElement('button');
        btn.className = 'sub-tab-btn';
        if (type === '全部') btn.classList.add('active'); // 預設選中全部
        btn.innerText = type;
        
        // 按下按鈕的事件
        btn.onclick = () => filterByType(type, btn);
        
        subTabsContainer.appendChild(btn);
    });
}

// 4. ✨ 第二層過濾：切換類型 (Type)
function filterByType(targetType, clickedBtn) {
    // 變更子選單按鈕顏色
    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    // 根據 Type 篩選資料
    let filteredItems;
    if (targetType === '全部') {
        filteredItems = currentCharacterData;
    } else {
        filteredItems = currentCharacterData.filter(item => (item.Type || '未分類') === targetType);
    }

    renderGallery(filteredItems);
}

// 5. 渲染卡片 (原本的邏輯移到這裡)
function renderGallery(items) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    if (items.length === 0) {
        gallery.innerHTML = '<p style="grid-column: 1/-1; color: #888;">沒有找到相關資料</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        const isOwned = String(item.Own).toLowerCase() === 'true'; // 檢查是否擁有
        
        card.className = `card ${isOwned ? 'owned' : ''}`;
        
        // 處理 undefined 的圖片
        const imgUrl = item.Image ? item.Image : 'https://placehold.co/150x150?text=No+Image';

        card.innerHTML = `
            <img src="${imgUrl}" loading="lazy">
            <h3>${item.Name}</h3>
        `;
        gallery.appendChild(card);
    });
}

// 執行
fetchData();