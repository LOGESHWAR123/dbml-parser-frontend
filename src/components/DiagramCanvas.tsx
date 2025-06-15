import React, { useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type { Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import DBTableNodes from './DbTableNodes';

const nodeTypes = {
  dbTable: DBTableNodes,
};

const initialNodes = [
  {
    id: 'follows',
    type: 'dbTable',
    position: { x: 0, y: 100 },
    data: {
      tableName: 'follows',
      columns: [
        { name: 'following_user_id', type: 'integer', key: 'FK' },
        { name: 'followed_user_id', type: 'integer', key: 'FK' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  },
  {
    id: 'users',
    type: 'dbTable',
    position: { x: 300, y: 100 },
    data: {
      tableName: 'users',
      columns: [
        { name: 'id', type: 'integer', key: 'PK' },
        { name: 'username', type: 'varchar' },
        { name: 'role', type: 'varchar' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  },
  {
    id: 'posts',
    type: 'dbTable',
    position: { x: 600, y: 100 },
    data: {
      tableName: 'posts',
      columns: [
        { name: 'id', type: 'integer', key: 'PK' },
        { name: 'title', type: 'varchar' },
        { name: 'body', type: 'text' },
        { name: 'user_id', type: 'integer', key: 'FK' },
        { name: 'status', type: 'varchar' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e-follows-following',
    source: 'follows',
    sourceHandle: 'source-following_user_id',
    target: 'users',
    targetHandle: 'target-id',
    label: 'following_user_id → id',
    animated: true,
  },
  {
    id: 'e-follows-followed',
    source: 'follows',
    sourceHandle: 'source-followed_user_id',
    target: 'users',
    targetHandle: 'target-id',
    label: 'followed_user_id → id',
    animated: true,
  },
  {
    id: 'e-posts-user',
    source: 'posts',
    sourceHandle: 'source-user_id',
    target: 'users',
    targetHandle: 'target-id',
    label: 'user_id → id',
    animated: true,
  },
];

const DiagramCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = (changes: NodeChange[]) =>
    setNodes((nds) => applyNodeChanges(changes, nds));

  const onEdgesChange = (changes: EdgeChange[]) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const onConnect = (connection: Connection) => {
    if (connection.source && connection.target) {
      const newEdge: Edge = {
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        animated: true,
        label: `${connection.sourceHandle?.replace('source-', '')} → ${connection.targetHandle?.replace('target-', '')}`,
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={12} color="#eee" />
      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;
