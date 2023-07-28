/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
import { RUNTIME_MIN_CODE_GEN_SUPPORTED_VERSION } from "../runtime/index.js";
import {
  printComments,
  printHeading,
  printIfTypescript,
  type Plugin,
  type PluginOpts,
} from "protoscript/plugin";

function lowerCase(str: string): string {
  return str[0].toLowerCase() + str.slice(1);
}

function formatParameterName(param: string): string {
  return lowerCase(param.split(".").pop() ?? "");
}

function writeClients({ services, packageName }: PluginOpts["ast"]): string {
  let result = "";

  services.forEach((service) => {
    result += printHeading(`${service.name} Protobuf Client`);

    service.methods.forEach((method) => {
      if (method.comments?.leading) {
        result += printComments(method.comments.leading);
      }
      const input = formatParameterName(method.input ?? "");
      const path = `/${packageName ? packageName + "." : ""}${service.name}/${
        method.name
      }`;

      result += `\
export async function ${method.name}(${input}${printIfTypescript(
        `: ${method.input}`,
      )}, config${printIfTypescript(
        `?: ClientConfiguration`,
      )})${printIfTypescript(`: Promise<${method.output}>`)} {
  const response = await PBrequest('${path}', ${
    method.input
  }.encode(${input}), config);
  return ${method.output}.decode(response);
}

`;
    });
  });

  services.forEach((service) => {
    result += printHeading(`${service.name} JSON Client`);

    service.methods.forEach((method) => {
      if (method.comments?.leading) {
        result += printComments(method.comments.leading);
      }
      const input = formatParameterName(method.input ?? "");
      const path = `/${packageName ? packageName + "." : ""}${service.name}/${
        method.name
      }`;

      result += `\
export async function ${method.name}JSON(${input}${printIfTypescript(
        `: ${method.input}`,
      )}, config${printIfTypescript(
        `?: ClientConfiguration`,
      )})${printIfTypescript(`: Promise<${method.output}>`)} {
  const response = await JSONrequest('${path}', ${
    method.inputJSON
  }.encode(${input}), config);
  return ${method.outputJSON}.decode(response);
}

`;
    });
  });

  return result;
}

function writeServers({
  ast: { services, packageName },
  config,
}: PluginOpts): string {
  let result = "";

  services.forEach((service) => {
    // print service types
    if (config.isTS) {
      result += printHeading(`${service.name}`);

      if (service.comments?.leading) {
        result += printComments(service.comments.leading);
      }
      result += `export interface ${service.name}<Context = unknown> {\n`;
      service.methods.forEach((method) => {
        if (method.comments?.leading) {
          result += printComments(method.comments.leading);
        }
        const input = formatParameterName(method.input ?? "");
        result += `${method.name}: (${input}: ${method.input}, context: Context) => Promise<${method.output}> | ${method.output};\n`;
      });
      result += "}\n";
    }

    result += "\n";

    result += `export function create${service.name}${printIfTypescript(
      "<Context>",
    )}(service${printIfTypescript(`: ${service.name}<Context>`)}) { return {
    name: '${[packageName, service.name].filter(Boolean).join(".")}',
    methods: {\n`;
    service.methods.forEach((method) => {
      result += `${method.name}: { name: '${method.name}', handler: service.${method.name}, input: { protobuf: ${method.input}, json: ${method.inputJSON} }, output: { protobuf: ${method.output}, json: ${method.outputJSON} } },`;
    });
    result += "}\n";
    result += `} ${printIfTypescript("as const")}\n`;
    result += "}\n";
    result += "\n";
  });

  return result;
}

export const plugin: Plugin = ({ ast, config }) => {
  const hasServices =
    !config.typescript.emitDeclarationOnly && ast.services.length > 0;

  if (!hasServices) {
    return;
  }

  return {
    imports: `\
import { JSONrequest, PBrequest } from "twirpscript";
// This is the minimum version supported by the current runtime.
// If this line fails typechecking, breaking changes have been introduced and this
// file needs to be regenerated by running \`npx twirpscript\`.
export { ${RUNTIME_MIN_CODE_GEN_SUPPORTED_VERSION} } from "twirpscript";
${printIfTypescript(
  'import type { ClientConfiguration } from "twirpscript";',
)}`,
    services: [writeClients(ast), writeServers({ ast, config })].join("\n"),
  };
};
