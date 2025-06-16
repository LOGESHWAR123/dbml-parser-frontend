import type { dbmlEditor } from "../interface/dbmlEditor";
import { useState } from "react";
import DbmlEditor from "./DbmlEditor";
import DiagramCanvas from "./DiagramCanvas";
import Toolbar from "./Toolbar";
import type { diagramcanvas } from "../interface/diagramcanvas";

const MainScreen = () => {
  const [isdbmlEditorOpened, setIsDbmlEditorOpened] = useState(false);
  const [dbmltext, setDbmlText] = useState('');

  const DbmlEditorProp: dbmlEditor = {
    dbmltext: dbmltext,
    isdbmlEditorOpened: isdbmlEditorOpened,
    setDbmlText: setDbmlText,
    setIsDbmlEditorOpened: setIsDbmlEditorOpened,
  };

  const DiagramCanvasProp: diagramcanvas = {
    dbmltext: dbmltext
  };

  return (
    <>
      <Toolbar />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100vw',
          height: '100vh',
          margin: 0,
          overflow: 'hidden'
        }}
      >
        {isdbmlEditorOpened && (
          <div
            style={{
              width: '40%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <DbmlEditor {...DbmlEditorProp} />
          </div>
        )}

        <div
          style={{
            width: isdbmlEditorOpened ? '70%' : '100%',
            height: '100%'
          }}
        >
          <DiagramCanvas {...DiagramCanvasProp} />
        </div>

        {/* Toggle button positioned absolutely */}
        <div
          onClick={() => setIsDbmlEditorOpened(prev => !prev)}
          style={{
            position: 'absolute',
            left: isdbmlEditorOpened ? '36%' : '0',
            zIndex: 100,
            background: '#333',
            padding: '2px',
            cursor: 'pointer',
          }}
        >
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
            }}
            title={isdbmlEditorOpened ? 'Slide Left (Hide Editor)' : 'Slide Right (Show Editor)'}
          >
            {isdbmlEditorOpened ? '⮜' : '⮞'}
          </button>
        </div>
      </div>
    </>
  );
};

export default MainScreen;
