import * as React from "react";
import { SaveContextProvider, SimpleForm, SimpleFormProps, useSaveContext } from "react-admin";

type SaveShortcutFormProps = SimpleFormProps;

const SaveShortcutFormInner = (
  props: SaveShortcutFormProps,
): React.ReactElement => {
  const saveContext = useSaveContext();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "s") {
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!document.contains(target)) {
        return;
      }

      event.preventDefault();
      // Reuse React-Admin's existing save context so shortcut saves follow the
      // same controller and GraphQL data-provider path as the built-in SaveButton.
      saveContext.save();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveContext]);

  return <SimpleForm {...props} />;
};

export const SaveShortcutForm = (
  props: SaveShortcutFormProps,
): React.ReactElement => {
  const saveContext = useSaveContext();

  return (
    <SaveContextProvider value={saveContext}>
      <SaveShortcutFormInner {...props} />
    </SaveContextProvider>
  );
};
