export type FieldType = "text" | "textarea" | "color" | "url";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
}

export interface SectionDef {
  type: string;
  label: string;
  defaultProps: Record<string, string>;
  fields: FieldDef[];
}

export interface Block {
  id: string;
  type: string;
  props: Record<string, string>;
}
