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

export function useEditArea() {
  const ctx = useContext(EditAreaContext);
  if (!ctx) throw new Error("useEditArea must be used inside <EditAreaProvider>");
  return ctx;
}

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

export function Editable({ id, view, edit }: EditableProps) {
  const generated = useId();
  const stableId = id ?? generated;
  const { isEditing } = useEditArea();

  return <>{isEditing(stableId) ? edit : view}</>;
}

/* -------------------- Edit button -------------------- */

type EditBtnProps = {
  targetId: string;
  editText?: string;
  viewText?: string;
  className?: string;
  toggle?: boolean; // allow deselect on second click
};

export function EditBtn({
  targetId,
  editText = "Edit",
  viewText = "Done",
  className,
  toggle = true,
}: EditBtnProps) {
  const { isEditing, select } = useEditArea();
  const editing = isEditing(targetId);

  const onClick = () => {
    if (editing && toggle) select(null);
    else select(targetId);
  };

  return (
    <button className={className} onClick={onClick}>
      {editing ? viewText : editText}
    </button>
  );
}
