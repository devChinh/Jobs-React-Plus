export type TStatus = "success" | "error" | "warning";

export type TButton = "save" | "cancel" | "ok" | "delete" | "edit";

export type TButtonType = "button" | "submit" | "reset" | undefined;

export type HeadCell = {
  disablePadding?: boolean;
  id?: string;
  label?: string;
  numeric?: boolean;
  disableSort?: boolean;
  dataType?: string;
};
