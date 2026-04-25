import * as React from "react";

import {
  Create,
  CreateProps,
  DateTimeInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

import { SaveShortcutForm } from "../Components/SaveShortcutForm";
import { CustomerTitle } from "../customer/CustomerTitle";
import { RoomTitle } from "../room/RoomTitle";

export const ReservationCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SaveShortcutForm>
        <DateTimeInput label="checkIn" source="checkIn" />
        <DateTimeInput label="checkOut" source="checkOut" />
        <ReferenceInput
          source="customer.id"
          reference="Customer"
          label="Customer"
        >
          <SelectInput optionText={CustomerTitle} />
        </ReferenceInput>
        <ReferenceInput source="room.id" reference="Room" label="Room">
          <SelectInput optionText={RoomTitle} />
        </ReferenceInput>
      </SaveShortcutForm>
    </Create>
  );
};
