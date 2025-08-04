exports.processEvents = async (event) => {
  // Input validation
  if (!event?.payload?.body) {
    throw new Error('Invalid event payload');
  }

  const eventBody = event.payload.body;
  const sp = buildPayload(eventBody);
  const eventName = setEventName(eventBody);
  const order = eventBody;

  return {
    events: [
      {
        type: 'track',
        event: eventName,
        userId: String(order.customer.id),
        properties: sp
      }
    ]
  };
};

//---------------------------------------------------------------------
//                        HELPERS
//---------------------------------------------------------------------
const setEventName = (order) => {
  const { financial_status, fulfillment_status } = order;

  if (financial_status === "refunded") return "Order Refunded";
  if (financial_status === "voided") return "Order Cancelled";
  if (financial_status === "paid" && fulfillment_status === "fulfilled") return "Order Completed";
  return "Order Updated";
};

// helper function to build track call properties based on order and products data
const buildPayload = (order) => {
  const { line_items } = order;

  const sp = {
    order_id: order.id,
    order_number: order.number,
    financial_status: order.financial_status,
    fulfillment_status: order.fulfillment_status,
    currency: order.currency,
    products: line_items.map(item => ({
      productId: item.product_id,
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      variant_id: item.variant_id,
      variant_title: item.variant_title,
      total_discount: item.total_discount,
      productSku: item.sku,
      productUpc: item.upc,
      productType: item.type,
      productExcludingTax: item.price_ex_tax,
      productIncludingTax: item.price_inc_tax
    }))
  };

  return sp;
};
