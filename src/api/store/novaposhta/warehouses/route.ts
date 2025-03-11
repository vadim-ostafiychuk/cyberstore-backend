import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import NovaPoshtaModuleService from "../../../../modules/nova-poshta/service";
import { NOVAPOSHTA_MODULE } from "../../../../modules/nova-poshta";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { cityId, limit, page, s } = req.query;

  const novaPoshtaModuleService: NovaPoshtaModuleService =
    req.scope.resolve(NOVAPOSHTA_MODULE);

  const result = await novaPoshtaModuleService.getWarehouses({
    cityId,
    limit,
    page,
    s,
  });

  res.status(200).json(result);
}
