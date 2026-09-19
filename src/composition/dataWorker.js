// Web Worker
// dataWorker.js
self.onmessage = async (e) => {
  const { url, rawText } = e.data;

  try {
    let rawData;

    if (url) {
      // Stream or fetch directly inside worker
      const response = await fetch(url);
      rawData = await response.json();
    } else if (rawText) {
      rawData = JSON.parse(rawText);
    }

    // Projection / Normalization: Drop unneeded properties immediately
    // to minimize structured cloning time between threads
    const normalized = rawData.map((item) => ({
      id: item.id,
      name: item.fullName || item.name,
      email: item.email,
      status: item.status,
    }));

    self.postMessage({ status: 'success', data: normalized });
  } catch (error) {
    self.postMessage({ status: 'error', error: error.message });
  }
};