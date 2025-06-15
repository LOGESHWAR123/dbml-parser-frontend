import { useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import DBTableNodes from './DbTableNodes';
import type { diagramcanvas } from '../interface/diagramcanvas';

import { Parser } from '@dbml/core';

const nodeTypes = {
  dbTable: DBTableNodes,
};

const DiagramCanvas = ({ dbmltext }: diagramcanvas) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!dbmltext || dbmltext.trim() === '') {
      console.warn('Empty DBML text provided');
      setNodes([]);
      setEdges([]);
      return;
    }

    try {
      const dbmlAst = Parser.parse(dbmltext, 'dbml');

      // Handle no schema found
      const schemas = dbmlAst.schemas;
      if (!schemas || schemas.length === 0) {
        console.warn('No schema found in DBML');
        setNodes([]);
        setEdges([]);
        return;
      }

      const schema = schemas[0];

      const tables = schema.tables ?? [];
      const refs = schema.refs ?? [];

      const generatedNodes: Node[] = tables.map((table, index) => ({
        id: table.name ?? `table-${index}`,
        type: 'dbTable',
        position: { x: index * 300, y: 100 },
        data: {
          tableName: table.name ?? `Table${index}`,
          columns: (table.fields ?? []).map((field: any) => ({
            name: field.name ?? 'unknown',
            type: field.type?.type_name ?? 'unknown',
            key: field.pk
              ? 'PK'
              : field.unique
              ? 'UNIQUE'
              : field.ref
              ? 'FK'
              : undefined,
          })),
        },
      }));

      const generatedEdges: Edge[] = refs.map((ref: any, idx: number) => {
        const sourceEndpoint = ref.endpoints?.[0];
        const targetEndpoint = ref.endpoints?.[1];

        if (!sourceEndpoint || !targetEndpoint) {
          console.warn(`Skipping ref ${idx} due to missing endpoints`);
          return null;
        }

        const sourceTable = sourceEndpoint.tableName ?? `unknown_source_${idx}`;
        const sourceField = sourceEndpoint.fieldNames?.[0] ?? 'unknown_field';
        const targetTable = targetEndpoint.tableName ?? `unknown_target_${idx}`;
        const targetField = targetEndpoint.fieldNames?.[0] ?? 'unknown_field';

        return {
          id: `e-${sourceTable}-${targetTable}-${idx}`,
          source: sourceTable,
          sourceHandle: `source-${sourceField}`,
          target: targetTable,
          targetHandle: `target-${targetField}`,
          label: `${sourceField} → ${targetField}`,
          animated: true,
        };
      }).filter((edge) => edge !== null) as Edge[];

      setNodes(generatedNodes);
      setEdges(generatedEdges);
    } catch (err) {
      console.error('Failed to parse DBML:', err);
      setNodes([]);
      setEdges([]);
    }
  }, [dbmltext]);

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
