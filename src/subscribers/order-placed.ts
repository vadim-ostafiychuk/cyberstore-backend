import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { INotificationModuleService } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // @ts-ignore
  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "email", "currency_code", "total", "items.*"],
    filters: {
      id: data.id,
    },
  });

  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);

  const order = orders[0];

  await notificationModuleService.createNotifications({
    // @ts-ignore
    to: order.email,
    channel: "email",
    template: "orderPlaced",
    data: {
      name: "good!",
    },
  });
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
