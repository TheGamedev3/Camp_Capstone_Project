"use client";

import React, {
  createContext,
  useContext,
  useId,
  useState,
  ReactNode,
} from "react";

/* -------------------- Edit area context -------------------- */

type EditAreaCtx = {
  selected: string | null;
  select: (id: string | null) => void;
  isEditing: (id: string) => boolean;
};

const EditAreaContext = createContext<EditAreaCtx | null>(null);

export function EditArea({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <EditAreaContext.Provider
      value={{
        selected,
        select: setSelected,
        isEditing: (id: string) => selected === id,
      }}
    >
      {children}
    </EditAreaContext.Provider>
  );
}

/* -------------------- Editable wrapper -------------------- */

type EditableProps = {
  id?: string;
  view: ReactNode;
  edit: ReactNode;
};

type EditableCxt = {
  stableId: string;
};

const EditableContext = createContext<EditableCxt | null>(null);

export function Editable({ id, view, edit }: EditableProps) {
  const generated = useId();
  const stableId = id ?? generated;
  const { isEditing } = useEditArea();

  return(
    <EditableContext.Provider value={{stableId}}>
        {isEditing(stableId) ? edit : view}
    </EditableContext.Provider>
  );
}

/* -------------------- Edit Hook -------------------- */

export function useEditArea() {
  const selectionArea = useContext(EditAreaContext);
  if (!selectionArea) throw new Error("useEditArea must be used inside <EditAreaProvider>");
  
  const editParent = useContext(EditableContext);
  return { ...selectionArea, stableId: editParent?.stableId }
}


/* -------------------- Edit button -------------------- */

type EditBtnProps = {
  targetId?: string;
  text?: string;
  className?: string;
};

export function EditBtn({
  targetId,
  text = "Edit",
  className,
}: EditBtnProps) {
  const { isEditing, select, stableId } = useEditArea();
  if(!stableId && !targetId){throw new Error("No target parent for the EditBtn!")}
  const editing = isEditing(targetId || stableId);

  const onClick = () => {
    if (editing) select(null);
    else select(targetId || stableId);
  };

  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
}
