import { MedusaError, MedusaService } from "@medusajs/framework/utils";
import { NovaPoshta, initNovaPoshta } from "xnovaposhtajs";

class NovaPoshtaModuleService extends MedusaService({}) {
  private client: NovaPoshta;

  constructor(container, options) {
    super(container, options);
    this.client = initNovaPoshta(options.ApiKey);
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.apiKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "APIKEY is required in novaposhta module options."
      );
    }
  }

  async getCities({ s, limit, page }) {
    const result = await this.client.address.getCities({
      findByString: s,
      limit: limit,
      page: page,
    });

    return result;
  }

  async getWarehouses({ cityId, limit, page, s }) {
    const result = await this.client.address.getWarehouses({
      cityRef: cityId,
      limit: limit,
      page: page,
      findByString: s,
    });

    return result;
  }
}

export default NovaPoshtaModuleService;
