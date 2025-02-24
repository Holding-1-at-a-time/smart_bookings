import { updateBookingStatus } from "../bookings";

jest.mock("../_generated/server", () => ({
  mutation: jest.fn(),
}));

describe("updateBookingStatus() updateBookingStatus method", () => {
  let ctx: any;
  let args: any;

  beforeEach(() => {
    ctx = {
      db: {
        get: jest.fn(),
        patch: jest.fn(),
      },
    };
    args = {
      bookingId: "booking123",
      status: "confirmed",
    };
  });

  describe("Happy paths", () => {
    it("should update the booking status successfully when booking exists", async () => {
      // Arrange: Mock the database to return a booking
      ctx.db.get.mockResolvedValue({ id: "booking123", status: "pending" });

      // Act: Call the updateBookingStatus function
      const result = await updateBookingStatus.handler(ctx, args);

      // Assert: Ensure the booking status is updated and the function returns true
      expect(ctx.db.get).toHaveBeenCalledWith("booking123");
      expect(ctx.db.patch).toHaveBeenCalledWith("booking123", {
        status: "confirmed",
      });
      expect(result).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should throw an error if the booking does not exist", async () => {
      // Arrange: Mock the database to return null (booking not found)
      ctx.db.get.mockResolvedValue(null);

      // Act & Assert: Expect an error to be thrown
      await expect(updateBookingStatus.handler(ctx, args)).rejects.toThrow(
        "Booking not found",
      );
      expect(ctx.db.get).toHaveBeenCalledWith("booking123");
      expect(ctx.db.patch).not.toHaveBeenCalled();
    });

    it("should handle an invalid status gracefully", async () => {
      // Arrange: Mock the database to return a booking
      ctx.db.get.mockResolvedValue({ id: "booking123", status: "pending" });
      args.status = ""; // Invalid status

      // Act: Call the updateBookingStatus function
      const result = await updateBookingStatus.handler(ctx, args);

      // Assert: Ensure the booking status is updated to an empty string
      expect(ctx.db.get).toHaveBeenCalledWith("booking123");
      expect(ctx.db.patch).toHaveBeenCalledWith("booking123", { status: "" });
      expect(result).toBe(true);
    });

    it("should handle a status update to the same current status", async () => {
      // Arrange: Mock the database to return a booking with the same status
      ctx.db.get.mockResolvedValue({ id: "booking123", status: "confirmed" });

      // Act: Call the updateBookingStatus function
      const result = await updateBookingStatus.handler(ctx, args);

      // Assert: Ensure the booking status is updated even if it's the same
      expect(ctx.db.get).toHaveBeenCalledWith("booking123");
      expect(ctx.db.patch).toHaveBeenCalledWith("booking123", {
        status: "confirmed",
      });
      expect(result).toBe(true);
    });
  });
});
