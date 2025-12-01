declare module "node-ical" {
  export const sync: {
    parseICS: (body: string) => Record<string, any>;
  };
  export const async: {
    fromURL: (url: string, callback?: (err: any, data: any) => void) => Promise<Record<string, any>>;
  };
}
