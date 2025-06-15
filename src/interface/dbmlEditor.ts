export interface dbmlEditor {
  dbmltext: string;
  isdbmlEditorOpened: boolean;
  setDbmlText: React.Dispatch<React.SetStateAction<string>>;
  setIsDbmlEditorOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
