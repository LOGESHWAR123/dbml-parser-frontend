import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { lintGutter } from '@codemirror/lint';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import type { dbmlEditor } from '../interface/dbmlEditor';


const dbmlLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.match(/Table|Ref|Project|Enum/i)) return "keyword";
    if (stream.match(/".*?"/)) return "string";
    if (stream.match(/\/\/.*/)) return "comment";
    if (stream.match(/\d+/)) return "number";
    stream.next();
    return null;
  }
});


function extractSchema(docText: string) {
  const tables: Record<string, string[]> = {};
  let currentTable = '';

  const lines = docText.split('\n');
  for (let line of lines) {
    line = line.trim();
    const tableMatch = line.match(/^Table\s+(\w+)/i);
    if (tableMatch) {
      currentTable = tableMatch[1];
      tables[currentTable] = [];
      continue;
    }

    if (currentTable) {
      const colMatch = line.match(/^(\w+)/);
      if (colMatch) {
        tables[currentTable].push(colMatch[1]);
      }
    }

    if (line === '}') {
      currentTable = '';
    }
  }

  return tables;
}

function dbmlCompletion(getDoc: () => string) {
  return (context: CompletionContext) => {
    const word = context.matchBefore(/\w*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    const schema = extractSchema(getDoc());

    // Collect all table names + columns
    const tableOptions = Object.keys(schema).map(t => ({ label: t, type: 'class' }));
    const fieldOptions = Object.entries(schema).flatMap(([table, cols]) =>
      cols.map(col => ({
        label: col,
        type: 'property',
        info: `Column of ${table}`
      }))
    );

    return {
      from: word.from,
      options: [
        { label: "Table", type: "keyword" },
        { label: "Ref", type: "keyword" },
        { label: "Project", type: "keyword" },
        { label: "Enum", type: "keyword" },
        ...tableOptions,
        ...fieldOptions
      ]
    };
  };
}



const DbmlEditor = ({setDbmlText , setIsDbmlEditorOpened} : dbmlEditor ) => {
  const [isOpen, setIsOpen] = useState(true);
  const [doc, setDoc] = useState('');

  useEffect(() =>{
    setDbmlText(doc);
    setIsDbmlEditorOpened(isOpen);
  },[doc , isOpen])


  return (
    <div style={{ display: 'flex', alignItems: 'stretch', height: '100vh', width: '100%' }}>
      <div
        style={{
          width: isOpen ? '400px' : '0px',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          background: '#1e1e1e',
        }}
      >
        <CodeMirror
        value=""
        height="100%"
        width="100%"
        extensions={[
          dbmlLanguage,
          autocompletion({ override: [dbmlCompletion(() => doc)] }),
          lintGutter(),
          keymap.of(defaultKeymap)
        ]}
        theme="dark"
        onChange={(value) => setDoc(value)}
      />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', background: '#333', padding: '4px' }}>
        <button
          onClick={() => setIsOpen(prev => !prev)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
          }}
          title={isOpen ? 'Slide Left (Hide Editor)' : 'Slide Right (Show Editor)'}
        >
          {isOpen ? '⮜' : '⮞'}
        </button>
      </div>
    </div>
  );
};

export default DbmlEditor;
