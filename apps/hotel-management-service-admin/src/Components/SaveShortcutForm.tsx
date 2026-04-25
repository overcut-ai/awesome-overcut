import * as React from "react";
import { SimpleForm, SimpleFormProps } from "react-admin";

type SaveShortcutFormProps = SimpleFormProps;

export const SaveShortcutForm = (
  props: SaveShortcutFormProps,
): React.ReactElement => {
  return <SimpleForm {...props} />;
};
