import type { dbmlEditor } from "../interface/dbmlEditor";
import { useState } from "react";
import DbmlEditor from "./DbmlEditor";
import DiagramCanvas from "./DiagramCanvas";
import Toolbar from "./Toolbar";
import type { diagramcanvas } from "../interface/diagramcanvas";

const MainScreen = () => {
  const [isdbmlEditorOpened, setIsDbmlEditorOpened] = useState(false);
  const [dbmltext, setDbmlText] = useState('');

  const DbmlEditorProp : dbmlEditor = {
    dbmltext : dbmltext,
    isdbmlEditorOpened : isdbmlEditorOpened,
    setDbmlText : setDbmlText,
    setIsDbmlEditorOpened : setIsDbmlEditorOpened,
  }

  const DiagramCanvasProp : diagramcanvas = {
    dbmltext : dbmltext
  }

  return (
    <>
    <Toolbar/>
    <div style={{ display: 'flex', width: '100vw',height: '100vh', margin: 0, }}>
      <div style={{ width: '30%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DbmlEditor {...DbmlEditorProp} />
      </div>
      <div style={{  width: '70%', height: '100%',  }}>
        <DiagramCanvas {...DiagramCanvasProp} />
      </div>
    </div>
  </>
  );
};

export default MainScreen;
