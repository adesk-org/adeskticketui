/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
module.exports = {
    schemaFile: "./openapi/adeskticketsvc.openapi.yaml",
    apiFile: "./src/services/baseApi.ts",
    apiImport: "baseApi",
    outputFile: "./src/services/tickets.generated.ts",
    exportName: "ticketsApi",
    hooks: true,
};
