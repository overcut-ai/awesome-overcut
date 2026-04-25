import React from "react";
import { Admin, Resource } from "react-admin";
import dataProvider from "./data-provider/graphqlDataProvider";
import { theme } from "./theme/theme";
import Login from "./Login";
import "./App.scss";
import Dashboard from "./pages/Dashboard";
import { HotelList } from "./hotel/HotelList";
import { HotelCreate } from "./hotel/HotelCreate";
import { HotelEdit } from "./hotel/HotelEdit";
import { HotelShow } from "./hotel/HotelShow";
import { RoomList } from "./room/RoomList";
import { RoomCreate } from "./room/RoomCreate";
import { RoomEdit } from "./room/RoomEdit";
import { RoomShow } from "./room/RoomShow";
import { ReservationList } from "./reservation/ReservationList";
import { ReservationCreate } from "./reservation/ReservationCreate";
import { ReservationEdit } from "./reservation/ReservationEdit";
import { ReservationShow } from "./reservation/ReservationShow";
import { CustomerList } from "./customer/CustomerList";
import { CustomerCreate } from "./customer/CustomerCreate";
import { CustomerEdit } from "./customer/CustomerEdit";
import { CustomerShow } from "./customer/CustomerShow";
import { jwtAuthProvider } from "./auth-provider/ra-auth-jwt";

const saveEnabledResources = [
  {
    name: "Hotel",
    list: HotelList,
    edit: HotelEdit,
    create: HotelCreate,
    show: HotelShow,
  },
  {
    name: "Room",
    list: RoomList,
    edit: RoomEdit,
    create: RoomCreate,
    show: RoomShow,
  },
  {
    name: "Reservation",
    list: ReservationList,
    edit: ReservationEdit,
    create: ReservationCreate,
    show: ReservationShow,
  },
  {
    name: "Customer",
    list: CustomerList,
    edit: CustomerEdit,
    create: CustomerCreate,
    show: CustomerShow,
  },
] as const;

const App = (): React.ReactElement => {
  return (
    <div className="App">
      <Admin
        title={"Hotel Management Service"}
        dataProvider={dataProvider}
        authProvider={jwtAuthProvider}
        theme={theme}
        dashboard={Dashboard}
        loginPage={Login}
      >
        {saveEnabledResources.map((resource) => (
          <Resource key={resource.name} {...resource} />
        ))}
      </Admin>
    </div>
  );
};

export default App;
