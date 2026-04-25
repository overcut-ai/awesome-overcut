import * as React from "react";

import {
  Edit,
  EditProps,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";

import { SaveShortcutForm } from "../Components/SaveShortcutForm";
import { RoomTitle } from "../room/RoomTitle";

export const HotelEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SaveShortcutForm>
        <TextInput label="address" source="address" />
        <TextInput label="description" multiline source="description" />
        <TextInput label="name" source="name" />
        <ReferenceArrayInput source="rooms" reference="Room">
          <SelectArrayInput
            optionText={RoomTitle}
            parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
            format={(value: any) => value && value.map((v: any) => v.id)}
          />
        </ReferenceArrayInput>
      </SaveShortcutForm>
    </Edit>
  );
};
