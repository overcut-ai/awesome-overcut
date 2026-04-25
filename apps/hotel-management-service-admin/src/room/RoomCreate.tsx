import * as React from "react";

import {
  Create,
  CreateProps,
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

export const RoomCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
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
    </Create>
  );
};
