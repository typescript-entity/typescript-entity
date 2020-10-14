export const toString = (value: unknown): string => (
  "string" === typeof value
    ? value
    : (
      undefined === value || null === value
        ? ""
        : String(value)
    )
);
