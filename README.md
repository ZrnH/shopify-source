# Shopify Webhooks to Segment

A Node.js webhook handler that processes Shopify order events and forwards them to Segment for analytics tracking. This service acts as a bridge between Shopify's webhook system and Segment's tracking API.

## 🎯 Purpose

This application listens for Shopify order webhooks and transforms them into Segment tracking events, enabling comprehensive order analytics and customer journey tracking.

## 🏗️ Architecture

```
Shopify Order Event → Webhook Handler → Segment Tracking Event
```

The handler processes various order status changes:
- **Order Refunded** - When `financial_status` is "refunded"
- **Order Cancelled** - When `financial_status` is "voided"  
- **Order Completed** - When `financial_status` is "paid" AND `fulfillment_status` is "fulfilled"
- **Order Updated** - For all other order status changes

## 📋 Features

- **Real-time Order Tracking**: Captures order events as they happen in Shopify
- **Comprehensive Order Data**: Includes order details, customer information, and product line items
- **Flexible Event Mapping**: Maps different order statuses to appropriate Segment events
- **Error Handling**: Validates input and provides meaningful error messages
- **Performance Optimized**: Efficient processing with minimal overhead

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Shopify store with webhook access
- Segment workspace configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ZrnH/shopify-source.git
cd shopify-source
```

2. Install dependencies (if any):
```bash
npm install
```

### Configuration

1. **Shopify Webhook Setup**:
   - Configure order webhooks in your Shopify admin
   - Point webhook URL to your deployed handler endpoint
   - Ensure webhook includes order data

2. **Segment Configuration**:
   - Set up your Segment workspace
   - Configure the tracking endpoint in your deployment

## 📖 Usage

### Handler Function

The main handler function `processEvents` accepts a Shopify webhook event and returns a Segment-compatible tracking event:

```javascript
const result = await processEvents(shopifyWebhookEvent);
// Returns: { events: [{ type: 'track', event: 'Order Completed', ... }] }
```

### Input Format

The handler expects a Shopify order webhook payload with the following structure:

```javascript
{
  payload: {
    body: {
      id: "order_id",
      number: "order_number", 
      financial_status: "paid",
      fulfillment_status: "fulfilled",
      currency: "USD",
      customer: { id: "customer_id" },
      line_items: [
        {
          product_id: "product_id",
          title: "Product Name",
          sku: "SKU123",
          quantity: 1,
          price: "29.99",
          // ... other product fields
        }
      ]
    }
  }
}
```

### Output Format

Returns a Segment tracking event:

```javascript
{
  events: [
    {
      type: 'track',
      event: 'Order Completed', // or other event names
      userId: 'customer_id',
      properties: {
        order_id: 'order_id',
        order_number: 'order_number',
        financial_status: 'paid',
        fulfillment_status: 'fulfilled',
        currency: 'USD',
        products: [
          {
            productId: 'product_id',
            title: 'Product Name',
            sku: 'SKU123',
            quantity: 1,
            price: '29.99',
            // ... other product properties
          }
        ]
      }
    }
  ]
}
```

## 🔧 Technical Details

### Event Mapping Logic

The `setEventName` function maps Shopify order statuses to Segment events:

| Shopify Status | Segment Event |
|----------------|---------------|
| `financial_status: "refunded"` | "Order Refunded" |
| `financial_status: "voided"` | "Order Cancelled" |
| `financial_status: "paid"` + `fulfillment_status: "fulfilled"` | "Order Completed" |
| All other cases | "Order Updated" |

### Data Transformation

The `buildPayload` function transforms Shopify order data into Segment-compatible properties:

- **Order Information**: ID, number, financial status, fulfillment status, currency
- **Product Details**: Product ID, title, SKU, quantity, price, variant information
- **Customer Data**: Customer ID for user identification

### Performance Optimizations

- **Async/Await Removal**: Eliminated unnecessary async operations in helper functions
- **Array Processing**: Uses `map()` instead of `for` loops for better performance
- **Input Validation**: Validates payload structure before processing
- **Memory Efficiency**: Optimized object creation and data handling

## 🛠️ Development

### Code Structure

```
handler.js
├── processEvents()     # Main handler function
├── setEventName()      # Event mapping logic
└── buildPayload()      # Data transformation
```

### Testing

To test the handler locally:

```javascript
const testEvent = {
  payload: {
    body: {
      // ... mock Shopify order data
    }
  }
};

const result = await processEvents(testEvent);
console.log(result);
```

## 📦 Deployment

This handler can be deployed to various serverless platforms:

- **AWS Lambda**
- **Google Cloud Functions**
- **Azure Functions**
- **Vercel Functions**
- **Netlify Functions**

### Environment Variables

Configure the following environment variables in your deployment:

- `SEGMENT_WRITE_KEY`: Your Segment write key
- `SEGMENT_ENDPOINT`: Segment tracking endpoint (optional, defaults to Segment's API)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create an issue in this repository
- Check the Shopify webhook documentation
- Review Segment's tracking API documentation

---

**Note**: This handler is specifically designed for Shopify order webhooks. For other Shopify webhook types (products, customers, etc.), additional handlers would need to be implemented.
