const userText = document.getElementById('userText');
const runButton = document.getElementById('runButton');
const status = document.getElementById('status');
const resultContainer = document.getElementById('resultContainer');
const result = document.getElementById('result');

runButton.addEventListener('click', async () => {
  const text = userText.value.trim();
  if (!text) {
    status.textContent = 'Please enter some text to proofread.';
    return;
  }

  status.textContent = 'Sending text to proofreader...';
  resultContainer.classList.add('hidden');
  result.textContent = '';

  try {
    const response = await fetch('/api/proofread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (!response.ok) {
      status.textContent = data.error || 'Server error. Check the terminal for details.';
      return;
    }

    result.textContent = data.result || 'No result returned.';
    resultContainer.classList.remove('hidden');
    status.textContent = 'Proofreading complete.';
  } catch (err) {
    status.textContent = 'Network error. Could not reach the server.';
    console.error(err);
  }
});
