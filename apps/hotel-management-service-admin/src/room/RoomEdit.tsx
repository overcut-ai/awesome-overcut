import * as React from "react";

import {
  Edit,
  EditProps,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";

import { SaveShortcutForm } from "../Components/SaveShortcutForm";
import { HotelTitle } from "../hotel/HotelTitle";
import { ReservationTitle } from "../reservation/ReservationTitle";

export const RoomEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SaveShortcutForm>
        <NumberInput step={1} label="floor" source="floor" />
        <ReferenceInput source="hotel.id" reference="Hotel" label="Hotel">
          <SelectInput optionText={HotelTitle} />
        </ReferenceInput>
        <TextInput label="number" source="numberField" />
        <ReferenceArrayInput source="reservations" reference="Reservation">
          <SelectArrayInput
            optionText={ReservationTitle}
            parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
            format={(value: any) => value && value.map((v: any) => v.id)}
          />
        </ReferenceArrayInput>
        <TextInput label="type" source="typeField" />
      </SaveShortcutForm>
    </Edit>
  );
};
