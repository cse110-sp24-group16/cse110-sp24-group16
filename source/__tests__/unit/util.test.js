const { convertTo12Hour } = require("../../util.js");

test("convert 24-hour time to 12-hour time", () => {
    expect(convertTo12Hour("00:00")).toBe("12:00 AM");
    expect(convertTo12Hour("12:00")).toBe("12:00 PM");
    expect(convertTo12Hour("13:00")).toBe("1:00 PM");
    expect(convertTo12Hour("23:59")).toBe("11:59 PM");
    expect(convertTo12Hour("abc")).toBeNull();
    expect(convertTo12Hour("12")).toBeNull();
    expect(convertTo12Hour("00")).toBeNull();
    expect(convertTo12Hour("12:00 AM")).toBeNull();
    expect(convertTo12Hour("12:00 PM")).toBeNull();
});