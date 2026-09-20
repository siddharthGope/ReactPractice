
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useWorkerParser } from '../composition/useWorkerParser';

export default function UserListView() {
  const { data, loading, error, parseUrl, parseFile } = useWorkerParser();
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Fixed estimated row height in px
    overscan: 5,
  });

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => parseUrl('../api/dummy-10000-records.json')}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Fetch & Parse 20MB Dataset'}
        </button>

        <input
          type="file"
          accept=".json"
          onChange={(e) => e.target.files?.[0] && parseFile(e.target.files[0])}
        />
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data.length > 0 && <p>Loaded {data.length.toLocaleString()} records.</p>}

      {/* Virtualized Container */}
      <div
        ref={parentRef}
        style={{
          height: '600px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: 4,
    contain: 'strict', // Optional: optimizes scroll performance
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const user = data[virtualRow.index];
            return (
              <div
                key={user.id || virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  borderBottom: '1px solid #eee',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ width: 80, color: '#666' }}>#{user.id}</span>
                <span style={{ flex: 1, fontWeight: 500 }}>{user.name}</span>
                <span style={{ flex: 1, color: '#444' }}>{user.email}</span>
                <span style={{ width: 100 }}>{user.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}