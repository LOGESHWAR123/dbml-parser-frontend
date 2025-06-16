import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { lintGutter, linter } from '@codemirror/lint';
import type { Diagnostic } from '@codemirror/lint';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { EditorView } from '@codemirror/view';
import type { dbmlEditor } from '../interface/dbmlEditor';

// DBML tokenizer
const dbmlLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.match(/TablePartial|Table|Ref|Project|Enum/i)) return "keyword";
    if (stream.match(/".*?"/)) return "string";
    if (stream.match(/\/\/.*/)) return "comment";
    if (stream.match(/\b\d+\b/)) return "number";
    if (stream.match(/\b(int|varchar|timestamp|datetime)\b/i)) return "typeName";
    stream.next();
    return null;
  }
});

// DBML theme
const dbmlTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#1e1e1e",
      color: "#d4d4d4",
    },
    ".cm-content": {
      caretColor: "#ffffff"
    },
    ".cm-keyword": {
      color: "#569CD6"
    },
    ".cm-string": {
      color: "#D69D85"
    },
    ".cm-number": {
      color: "#B5CEA8"
    },
    ".cm-typeName": {
      color: "#4EC9B0"
    },
    ".cm-comment": {
      color: "#6A9955",
      fontStyle: "italic"
    }
  },
  { dark: true }
);

// DBML brace linter
function dbmlLinter() {
  return (view: any) => {
    const text = view.state.doc.toString();
    const diagnostics: Diagnostic[] = [];
    let openBraces = 0;

    const lines = text.split('\n');
    lines.forEach((line, index) => {
      for (let char of line) {
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
        if (openBraces < 0) {
          diagnostics.push({
            from: view.state.doc.line(index + 1).from,
            to: view.state.doc.line(index + 1).to,
            severity: 'error',
            message: 'Unexpected closing brace "}"'
          });
          openBraces = 0;
        }
      }
    });

    if (openBraces > 0) {
      diagnostics.push({
        from: 0,
        to: 0,
        severity: 'error',
        message: 'Unmatched opening brace "{"'
      });
    }

    return diagnostics;
  };
}

// Schema extractor
function extractSchema(docText: string) {
  const tables: Record<string, string[]> = {};
  const aliasMap: Record<string, string> = {};
  let currentTable = '';

  const lines = docText.split('\n');
  for (let line of lines) {
    line = line.trim();

    const tableMatch = line.match(/^Table\s+((\w+)\.)?(\w+)(?:\s+as\s+(\w+))?/i);
    if (tableMatch) {
      const schema = tableMatch[2] || 'public';
      const table = tableMatch[3];
      const alias = tableMatch[4];
      const fullName = `${schema}.${table}`;
      currentTable = fullName;
      tables[fullName] = [];
      if (alias) aliasMap[alias] = fullName;
      continue;
    }

    if (currentTable) {
      const colMatch = line.match(/^([\w"]+)/);
      if (colMatch) {
        const col = colMatch[1].replace(/"/g, '');
        tables[currentTable].push(col);
      }
    }

    if (line === '}') {
      currentTable = '';
    }
  }

  Object.entries(aliasMap).forEach(([alias, full]) => {
    if (tables[full]) tables[alias] = tables[full];
  });

  return tables;
}

// Completion
function dbmlCompletion(getDoc: () => string) {
  return (context: CompletionContext) => {
    const word = context.matchBefore(/\w*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    const schema = extractSchema(getDoc());
    const tableOptions = Object.keys(schema).map(t => ({
      label: t,
      type: 'class'
    }));
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

// Component
const DbmlEditor = ({ dbmltext, setDbmlText, setIsDbmlEditorOpened }: dbmlEditor) => {
  const [isOpen, setIsOpen] = useState(true);
  const [doc, setDoc] = useState(dbmltext);

  useEffect(() => {
    setDoc(dbmltext);
  }, [dbmltext]);

  useEffect(() => {
    setIsDbmlEditorOpened(isOpen);
  }, [isOpen]);

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', height: '100vh', width: '100%' }}>
      {isOpen && (
        <div
          style={{
          width: '100%',
          height: '100%',
          transition: 'width 0.3s ease',
          overflow: 'auto',
         background: '#1e1e1e',
        }}
        > 
          <CodeMirror
            value={doc}
            height="100%"
            width="100%"
            extensions={[
              dbmlLanguage,
              autocompletion({ override: [dbmlCompletion(() => doc)] }),
              lintGutter(),
              linter(dbmlLinter()),
              dbmlTheme,
              keymap.of(defaultKeymap)
            ]}
            theme="dark"
            onChange={(value) => {
              setDoc(value);
              setDbmlText(value);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DbmlEditor;
