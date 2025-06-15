import DbmlEditor from "./DbmlEditor";
import DiagramCanvas from "./DiagramCanvas";
import Toolbar from "./Toolbar";

const MainScreen = () => {
  return (
    <>
    <Toolbar/>
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        margin: 0,
      }}
    >

      <div 
        style={{ 
          width: '30%', 
          height: '100%', 
          display: 'flex',     
          flexDirection: 'column' 
        }}
      >
        <DbmlEditor />
      </div>
      <div 
        style={{ 
          width: '70%', 
          height: '100%', 
        }}
      >
        <DiagramCanvas />
      </div>
    </div>
        </>
  );
};

export default MainScreen;
