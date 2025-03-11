import NovaPoshtaModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const NOVAPOSHTA_MODULE = "novaPoshta";

export default Module(NOVAPOSHTA_MODULE, {
  service: NovaPoshtaModuleService,
});
