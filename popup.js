document.addEventListener('DOMContentLoaded', () => {
  const earnedAmountElement = document.getElementById('earnedAmount');
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');

  const hourlyRate = 1150; // 時給
  let startTime = null;
  let timerInterval = null;

  // 勤務開始時刻を保存・読み込み
  chrome.storage.local.get(['startTime'], (result) => {
    if (result.startTime) {
      startTime = result.startTime;
      startTimer();
    }
  });

  startButton.addEventListener('click', () => {
    if (!startTime) {
      startTime = Date.now();
      chrome.storage.local.set({ startTime: startTime });
      startTimer();
    }
  });

  stopButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    startTime = null;
    chrome.storage.local.remove('startTime');
    earnedAmountElement.textContent = '0円';
  });

  function startTimer() {
    timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime; // 経過ミリ秒
      const elapsedSeconds = elapsedTime / 1000; // 経過秒
      const earned = (hourlyRate / 3600) * elapsedSeconds; // 1秒あたりの給料 × 経過秒
      earnedAmountElement.textContent = `${Math.floor(earned)}円`; // 小数点以下を切り捨てて表示
    }, 1000); // 1秒ごとに更新
  }
});