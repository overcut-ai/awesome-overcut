// Type augmentation for @prisma/client used only during test compilation.
// We declare an index signature on PrismaClient so generated service code that
// accesses model delegates via `this.prisma.<model>` does not raise TypeScript
// errors when the Prisma schema / generated client are not present.

declare module "@prisma/client" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  class PrismaClient {
    [key: string]: any; // allow arbitrary model delegate properties
    $connect: () => Promise<void>;
    $disconnect: () => Promise<void>;
    $on: (...args: any[]) => void;
  }

  // Prisma namespace placeholder so code importing `Prisma` compiles
  namespace Prisma {
    // Delegate arg types – we just alias to any to satisfy compiler
    type CustomerCountArgs = any;
    type CustomerFindManyArgs = any;
    type CustomerFindUniqueArgs = any;
    type CustomerCreateArgs = any;
    type CustomerUpdateArgs = any;
    type CustomerDeleteArgs = any;

    type ReservationCountArgs = any;
    type ReservationFindManyArgs = any;
    type ReservationFindUniqueArgs = any;
    type ReservationCreateArgs = any;
    type ReservationUpdateArgs = any;
    type ReservationDeleteArgs = any;

    type HotelCountArgs = any;
    type HotelFindManyArgs = any;
    type HotelFindUniqueArgs = any;
    type HotelCreateArgs = any;
    type HotelUpdateArgs = any;
    type HotelDeleteArgs = any;

    type RoomCountArgs = any;
    type RoomFindManyArgs = any;
    type RoomFindUniqueArgs = any;
    type RoomCreateArgs = any;
    type RoomUpdateArgs = any;
    type RoomDeleteArgs = any;
  }

  // Export Prisma namespace as a value so it can be imported
  export const Prisma: any;

  // Model type placeholders
  type Customer = any;
  type Hotel = any;
  type Reservation = any;
  type Room = any;
}
