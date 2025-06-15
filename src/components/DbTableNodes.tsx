import { Handle, Position } from 'reactflow';

const DBTableNodes = ({ data }: any) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: 8,
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        minWidth: 180,
        fontSize: 12,
      }}
    >
      <div
        style={{
          background: '#2d3748',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '8px 8px 0 0',
          fontWeight: 'bold',
        }}
      >
        {data.tableName}
      </div>
      <div style={{ padding: '4px 8px' }}>
        {data.columns.map((col: any, idx: number) => {
          const dotColor =
            col.key === 'PK'
              ? '#38a169'
              : col.key === 'FK'
              ? '#3182ce'
              : '#4a5568';
          return (
            <div
              key={idx}
              style={{
                position: 'relative',
                padding: '2px 6px',
                margin: '2px 0',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f7fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={`target-${col.name}`}
                style={{
                  background: dotColor,
                  width: 8,
                  height: 8,
                  left: -8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <Handle
                type="source"
                position={Position.Right}
                id={`source-${col.name}`}
                style={{
                  background: dotColor,
                  width: 8,
                  height: 8,
                  right: -8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <span style={{ marginRight: 2 }}>
              {col.key === 'PK' && '🔑'}
              {col.key === 'FK' && '🔗'}
            </span>
              <span style={{ flexGrow: 1 }}>
                <strong>{col.name}</strong>: {col.type}
              </span>
              {col.key && (
                <span
                  style={{
                    background: col.key === 'PK' ? '#38a169' : '#3182ce',
                    color: '#fff',
                    fontSize: 10,
                    padding: '0 4px',
                    borderRadius: 4,
                    marginLeft: 4,
                  }}
                >
                  {col.key}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DBTableNodes;
