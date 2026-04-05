declare module "node-ical" {
  export const sync: {
    parseICS: (body: string) => Record<string, unknown>;
  };
  export const async: {
    fromURL: (
      url: string,
      callback?: (err: unknown, data: unknown) => void
    ) => Promise<Record<string, unknown>>;
  };
}
