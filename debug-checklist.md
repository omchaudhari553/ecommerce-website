# Payment System Debug Checklist

## 1. Frontend Issues to Check:

### Payment Component:
- [ ] Check if Razorpay script loads properly
- [ ] Verify createPaymentOrder method works
- [ ] Check if openRazorpayCheckout is called
- [ ] Verify verifyPayment method is called after payment
- [ ] Check if processing flag is managed correctly

### Orders Service:
- [ ] Check if getUserOrders fetches from correct endpoint
- [ ] Verify transformBackendOrder handles data correctly
- [ ] Check if clearOrders method works

### Order Confirmation:
- [ ] Check if navigation state is passed correctly
- [ ] Verify localStorage fallback works
- [ ] Check if bill displays order items

## 2. Backend Issues to Check:

### Payment Controller:
- [ ] Check if /verify-debug endpoint exists
- [ ] Verify OrderRepository is injected
- [ ] Check if order is saved to database

### Order Controller:
- [ ] Check if /user/{email} endpoint works
- [ ] Verify orders are returned with proper structure
- [ ] Check if /clear endpoint works

## 3. Database Issues to Check:
- [ ] Verify orders are being saved after payment
- [ ] Check if order items are linked correctly
- [ ] Verify user association

## 4. Common Issues:
- [ ] CORS configuration
- [ ] Authentication headers
- [ ] API endpoint URLs
- [ ] Data transformation between backend and frontend

## Test Steps:
1. Clear all orders
2. Add items to cart
3. Proceed to payment
4. Complete payment
5. Check order confirmation
6. Check My Orders section
