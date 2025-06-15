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

      <div className="toolbar-btn">⬆ Import</div>
      <div className="toolbar-btn">⬇ Export</div>

      <div className="toolbar-btn">
        🌙 <input type="checkbox" />
      </div>


      <div style={{ flex: 1 }} />
      <button className="toolbar-btn">🔑 Sign in</button>

      <style>{`
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
