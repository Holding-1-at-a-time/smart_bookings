import { deleteService } from "../services";

describe("deleteService() deleteService method", () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      db: {
        get: jest.fn(),
        query: jest.fn(),
        delete: jest.fn(),
      },
    };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should delete a service successfully when it exists and belongs to the organization", async () => {
      // Arrange
      const serviceId = "service123";
      const organizationId = "org123";
      const service = { organizationId, name: "Test Service" };
      mockCtx.db.get.mockResolvedValue(service);
      mockCtx.db.query.mockResolvedValue([service]);

      // Act
      const result = await deleteService.handler(mockCtx, {
        serviceId,
        organizationId,
      });

      // Assert
      expect(result).toEqual({ success: true });
      expect(mockCtx.db.delete).toHaveBeenCalledWith(serviceId);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should throw an error if the service does not exist", async () => {
      // Arrange
      const serviceId = "service123";
      const organizationId = "org123";
      mockCtx.db.get.mockResolvedValue(null);

      // Act & Assert
      await expect(
        deleteService.handler(mockCtx, { serviceId, organizationId }),
      ).rejects.toThrow("Failed to delete service");
    });

    it("should throw an error if the service belongs to a different organization", async () => {
      // Arrange
      const serviceId = "service123";
      const organizationId = "org123";
      const service = { organizationId: "otherOrg", name: "Test Service" };
      mockCtx.db.get.mockResolvedValue(service);

      // Act & Assert
      await expect(
        deleteService.handler(mockCtx, { serviceId, organizationId }),
      ).rejects.toThrow("Failed to delete service");
    });

    it("should throw an error if there is another service with the same name in the organization", async () => {
      // Arrange
      const serviceId = "service123";
      const organizationId = "org123";
      const service = { organizationId, name: "Test Service" };
      mockCtx.db.get.mockResolvedValue(service);
      mockCtx.db.query.mockResolvedValue([
        service,
        { ...service, id: "service456" },
      ]);

      // Act & Assert
      await expect(
        deleteService.handler(mockCtx, { serviceId, organizationId }),
      ).rejects.toThrow("Failed to delete service");
    });
  });
});
