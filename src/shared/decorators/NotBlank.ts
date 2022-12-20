// maybe you can write Array<null | undefined | {} | 0 | T>, but it is dynamic
const tags = ['null', 'undefined', '{}', '', '0'] as const;
export const NotBlank =
  (...args: ReadonlyArray<typeof tags[number]>) =>
  (target: any, method: string | symbol, descriptor: PropertyDescriptor) => {
    if (args.length === 0) {
      args = tags;
    }

    const fn = descriptor.value as Function;

    const check = (value: any): { isBlank: boolean; msg: string } => {
      let tag: string, msg: string;
      switch (Object.prototype.toString.call(value)) {
        case '[object Undefined]':
          tag = 'undefined';
          msg = 'undefined';
          break;
        case '[object Null]':
          tag = 'null';
          msg = 'null';
          break;
        case '[object Number]':
          if (value === 0) {
            tag = '0';
            msg = 'zero | 0';
          }
          break;
        case '[object String]':
          if (value.length === 0) {
            tag = '';
            msg = "empty string like ''";
          }
        case '[object Object]':
          if (Object.keys(value).length === 0) {
            tag = '{}';
            msg = 'empty object like {}';
          }
          break;
      }
      if (args.findIndex((target: string) => target === tag) === -1) {
        return { isBlank: false, msg };
      }
      return {
        isBlank: true,
        msg,
      };
    };

    descriptor.value = async function (...args: any[]) {
      const res = await fn.apply(this, args);
      const { isBlank, msg } = check(res);
      if (isBlank) {
        throw new Error(
          `\n@NotBlankError: function ${String(
            method,
          )} was correctly executed, but it returns a blank! The blank result is ${msg}`,
        );
      }
      return res;
    };
  };
