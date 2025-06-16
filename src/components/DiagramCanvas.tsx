import { useState, useEffect, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  ReactFlowProvider,
  Panel
} from 'reactflow';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import DBTableNodes from './DbTableNodes';
import type { diagramcanvas } from '../interface/diagramcanvas';
import { Parser } from '@dbml/core';

const nodeTypes = { dbTable: DBTableNodes };

const DiagramCanvasCore = ({ dbmltext }: diagramcanvas) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dbmltext || dbmltext.trim() === '') {
      setNodes([]);
      setEdges([]);
      setParseError(null);
      return;
    }
    try {
      const dbmlAst = Parser.parse(dbmltext, 'dbml');
      setParseError(null);

      // Extract tableGroups as partials
      const tableGroups: Record<string, any[]> = {};
      (dbmlAst.tableGroups || []).forEach(g => {
        tableGroups[g.name] = g.fields;
      });

      // Collect tables
      const schemaTables = (dbmlAst.schemas || []).flatMap(s => s.tables || []);
      const rootTables = dbmlAst.tables || [];
      const allTables = [...schemaTables, ...rootTables];

      // Expand partials within fields
      const expandedTables = allTables.map(table => {
        const fields = table.fields.flatMap(f => {
          if (f.name?.startsWith('~')) {
            const groupName = f.name.substring(1);
            return tableGroups[groupName] || [];
          }
          return [f];
        });
        return { ...table, fields };
      });

      // Nodes
      const generatedNodes: Node[] = expandedTables.map((table, index) => {
        const tableId = `${table.schemaName || 'public'}.${table.name}`;
        return {
          id: tableId,
          type: 'dbTable',
          position: { x: (index % 4) * 300, y: Math.floor(index / 4) * 220 },
          data: {
            tableName: tableId,
            columns: table.fields.map(f => ({
              name: f.name,
              type: f.type?.type_name || 'unknown',
              key: f.pk ? 'PK' : f.ref ? 'FK' : f.unique ? 'UNIQUE' : undefined,
              note: f.note
            }))
          }
        };
      });

      // Collect refs (root + schema)
      const allRefs = [
        ...(dbmlAst.refs || []),
        ...(dbmlAst.schemas || []).flatMap(s => s.refs || [])
      ];

      // Edges
      const generatedEdges: Edge[] = allRefs.flatMap((ref, refIdx) => {
        const src = ref.endpoints[0];
        const tgt = ref.endpoints[1];

        const srcTable = `${src.schemaName || 'public'}.${src.tableName}`;
        const tgtTable = `${tgt.schemaName || 'public'}.${tgt.tableName}`;

        const srcFields = src.fieldNames || [''];
        const tgtFields = tgt.fieldNames || [''];

        return srcFields.map((sf, i) => ({
          id: `e-${srcTable}-${tgtTable}-${refIdx}-${i}`,
          source: srcTable,
          target: tgtTable,
          sourceHandle: `source-${sf}`,
          targetHandle: `target-${tgtFields[i] || tgtFields[0]}`,
          label: `${sf} → ${tgtFields[i] || tgtFields[0]}`,
          animated: true,
          style: { stroke: '#007acc', strokeWidth: 2 },
          markerEnd: { type: 'arrowclosed' },
          labelBgStyle: { fill: '#fff' }
        }));
      });

      setNodes(generatedNodes);
      setEdges(generatedEdges);
    } catch (err: any) {
      console.error('DBML parse error:', err);
      setParseError(err.message || 'Invalid DBML');
      setNodes([]);
      setEdges([]);
    }
  }, [dbmltext]);

  const onNodesChange = (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds));
  const onConnect = (connection: Connection) => {
    if (connection.source && connection.target) {
      setEdges(eds => [
        ...eds,
        {
          id: `e-${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          label: `${connection.sourceHandle?.replace('source-', '')} → ${connection.targetHandle?.replace('target-', '')}`,
          animated: true,
          style: { stroke: '#28a745' }
        }
      ]);
    }
  };

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {parseError && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(255,0,0,0.85)',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: 4,
          zIndex: 10
        }}>
          {parseError}
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        snapToGrid
        snapGrid={[15, 15]}
        multiSelectionKeyCode="Shift"
        panOnScroll
        zoomOnScroll
        fitView
      >
        <MiniMap nodeStrokeColor="#007acc" nodeColor="#d9f0ff" />
        <Controls />
        <Background gap={15} color="#f0f0f0" />
        
      </ReactFlow>
    </div>
  );
};

const DiagramCanvas = (props: diagramcanvas) => (
  <ReactFlowProvider>
    <DiagramCanvasCore {...props} />
  </ReactFlowProvider>
);

export default DiagramCanvas;
