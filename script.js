document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('titleInput');
  const startDateInput = document.getElementById('startDate');
  const startTimeInput = document.getElementById('startTime');
  const titleText = document.getElementById('titleText');
  const daysCountElement = document.getElementById('daysCount');
  const timeDetailElement = document.getElementById('timeDetail');
  const shareBtn = document.getElementById('shareBtn');

  // 1. 解析網址上的參數 (URL Parameters)
  const urlParams = new URLSearchParams(window.location.search);
  const paramTitle = urlParams.get('title');
  const paramDate = urlParams.get('date');
  const paramTime = urlParams.get('time');

  // 預設值（當網址沒有帶參數時使用）
  const DEFAULT_TITLE = '我們相識的時間';
  const DEFAULT_DATE = '2024-02-14';
  const DEFAULT_TIME = '13:14';

  // 載入優先順序：網址參數 > 瀏覽器紀錄 > 預設值
  titleInput.value = paramTitle || localStorage.getItem('anniversaryTitle') || '';
  startDateInput.value = paramDate || localStorage.getItem('anniversaryDate') || DEFAULT_DATE;
  startTimeInput.value = paramTime || localStorage.getItem('anniversaryTime') || DEFAULT_TIME;

  function updateTimer() {
    const titleVal = titleInput.value.trim();
    const dateStr = startDateInput.value;
    const timeStr = startTimeInput.value || '00:00';

    if (!dateStr) return;

    // 更新標題
    titleText.textContent = titleVal ? `💕 ${titleVal}` : `💕 ${DEFAULT_TITLE}`;

    // 儲存至本地，方便使用者下次直接開啟
    localStorage.setItem('anniversaryTitle', titleVal);
    localStorage.setItem('anniversaryDate', dateStr);
    localStorage.setItem('anniversaryTime', timeStr);

    // 計算時間差
    const startDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const now = new Date();
    const diffMs = now - startDateTime;

    if (diffMs >= 0) {
      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      daysCountElement.textContent = days.toLocaleString();
      timeDetailElement.textContent = `${hours} 小時 ${minutes} 分 ${seconds} 秒`;
    } else {
      daysCountElement.textContent = '0';
      timeDetailElement.textContent = '0 小時 0 分 0 秒（時間在未來喔！）';
    }
  }

  // 複製分享連結功能
  shareBtn.addEventListener('click', () => {
    const titleVal = encodeURIComponent(titleInput.value.trim());
    const dateVal = startDateInput.value;
    const timeVal = startTimeInput.value;

    // 建立帶有參數的完整 URL
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?title=${titleVal}&date=${dateVal}&time=${timeVal}`;

    // 複製到剪貼簿
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('✨ 專屬連結已複製！發送給對方打開即可看到這個紀念日。');
    }).catch(err => {
      alert('複製失敗，請手動複製網址。');
    });
  });

  // 監聽輸入框變更
  titleInput.addEventListener('input', updateTimer);
  startDateInput.addEventListener('change', updateTimer);
  startTimeInput.addEventListener('change', updateTimer);

  // 定時器每秒更新
  updateTimer();
  setInterval(updateTimer, 1000);
});
