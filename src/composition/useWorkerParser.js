// useWorkerParser.js
import { useState, useEffect, useRef } from 'react';

export function useWorkerParser() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => {
    // Vite / Webpack 5 standard worker instantiation
    workerRef.current = new Worker(
      new URL('./dataWorker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event) => {
      const { status, data: parsedData, error: parseError } = event.data;
      if (status === 'success') {
        setData(parsedData);
      } else {
        setError(parseError);
      }
      setLoading(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const parseUrl = (url) => {
    setLoading(true);
    setError(null);
    workerRef.current.postMessage({ url });
  };

  const parseFile = (file) => {
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      workerRef.current.postMessage({ rawText: reader.result });
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return { data, loading, error, parseUrl, parseFile };
}