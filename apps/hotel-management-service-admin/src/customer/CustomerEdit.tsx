import * as React from "react";

import {
  Edit,
  EditProps,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";

import { SaveShortcutForm } from "../Components/SaveShortcutForm";
import { ReservationTitle } from "../reservation/ReservationTitle";

export const CustomerEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SaveShortcutForm>
        <TextInput label="email" source="email" type="email" />
        <TextInput label="firstName" source="firstName" />
        <TextInput label="lastName" source="lastName" />
        <TextInput label="phoneNumber" source="phoneNumber" />
        <ReferenceArrayInput source="reservations" reference="Reservation">
          <SelectArrayInput
            optionText={ReservationTitle}
            parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
            format={(value: any) => value && value.map((v: any) => v.id)}
          />
        </ReferenceArrayInput>
      </SaveShortcutForm>
    </Edit>
  );
};
