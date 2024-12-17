let express = require('express');
let cors = require('cors');
const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(cors());

let taxRate = 5; // 5%
let discountPercentage = 10; // 10%
let loaltyRate = 2; // 2%

function getCartTotal(newItemPrice, cartTotal) {
  let newTotal = newItemPrice + cartTotal;
  return newTotal.toString();
}

function getMembershipDiscount(cartTotal, isMember) {
  let finalPrice;
  if (isMember === 'true') {
    finalPrice = cartTotal - (cartTotal * discountPercentage) / 100;
    return finalPrice.toString();
  } else {
    return cartTotal.toString();
  }
}

function calculateTax(cartTotal) {
  let tax = (taxRate * cartTotal) / 100;
  return tax.toString();
}

function estimatedDelivery(shippingMethod, distance) {
  if (shippingMethod === 'standard') {
    return Math.round(distance / 50).toString();
  } else if (shippingMethod === 'express') {
    return Math.round(distance / 100).toString();
  }
}

function calculateShippingCost(weight, distance) {
  return (weight * distance * 0.1).toString();
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);

  res.send(getCartTotal(newItemPrice, cartTotal));
});

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;

  res.send(getMembershipDiscount(cartTotal, isMember));
});

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);

  res.send(calculateTax(cartTotal));
});

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);

  res.send(estimatedDelivery(shippingMethod, distance));
});

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);

  res.send(calculateShippingCost(weight, distance));
});

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);

  res.send((purchaseAmount * loaltyRate).toString());
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
