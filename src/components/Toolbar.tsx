import React from 'react';

const Toolbar = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#1f1f1f',
        padding: '4px 8px',
        height: '40px',
        gap: '6px',
        color: '#ddd',
      }}
    >
      {/* Left icon */}
      <button
        style={{
          background: '#007aff',
          border: 'none',
          borderRadius: '4px',
          color: '#fff',
          padding: '4px 8px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        ⬈
      </button>

      {/* Title input */}
      <input
        type="text"
        placeholder="Untitled Diagram"
        style={{
          background: '#2b2b2b',
          border: 'none',
          borderRadius: '4px',
          color: '#ddd',
          padding: '4px 8px',
          width: '200px',
        }}
      />

      {/* Buttons */}
      <button className="toolbar-btn">💾 Save</button>
      <button className="toolbar-btn">🔗 Share</button>

      <div className="toolbar-btn">⬆ Import ⌄</div>
      <div className="toolbar-btn">⬇ Export</div>

      <div className="toolbar-btn">
        🌙 <input type="checkbox" />
      </div>

      <div className="toolbar-btn">📘 Publish to dbdocs</div>

      <button
        style={{
          border: '1px solid #007aff',
          color: '#007aff',
          borderRadius: '4px',
          padding: '4px 8px',
          background: 'transparent',
        }}
      >
        ⚡ RunSQL
      </button>

      <div style={{ flex: 1 }} />

      <div className="toolbar-btn">❓ Help ⌄</div>
      <div className="toolbar-btn">🔑 Sign in</div>

      <style jsx>{`
        .toolbar-btn {
          background: #2b2b2b;
          border: none;
          border-radius: 4px;
          color: #ddd;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .toolbar-btn:hover {
          background: #3a3a3a;
        }
      `}</style>
    </div>
  );
};

export default Toolbar;
