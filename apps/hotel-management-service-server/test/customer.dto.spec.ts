import { validate } from "class-validator";
import { CustomerCreateInput } from "../src/customer/CustomerCreateInput";
import { CustomerUpdateInput } from "../src/customer/CustomerUpdateInput";

describe("Customer DTO Email Validation", () => {
  describe("CustomerCreateInput", () => {
    it("should pass validation when email is valid", async () => {
      const dto = new CustomerCreateInput();
      dto.email = "john.doe@example.com";
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("should fail validation when email is invalid", async () => {
      const dto = new CustomerCreateInput();
      dto.email = "not-an-email";
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("email");
    });

    it("should pass validation when email is undefined", async () => {
      const dto = new CustomerCreateInput();
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe("CustomerUpdateInput", () => {
    it("should pass validation when email is valid", async () => {
      const dto = new CustomerUpdateInput();
      dto.email = "jane.doe@example.com";
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("should fail validation when email is invalid", async () => {
      const dto = new CustomerUpdateInput();
      dto.email = "invalid";
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("email");
    });

    it("should pass validation when email is null", async () => {
      const dto = new CustomerUpdateInput();
      dto.email = null;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
