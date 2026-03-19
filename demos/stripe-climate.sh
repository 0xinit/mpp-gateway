#!/usr/bin/env bash
# Stripe Climate via MPP — agents donate to carbon removal
# Pays with Tempo stablecoins, Stripe processes the climate order

GATEWAY="${MPP_GATEWAY:-http://localhost:3000}"

echo "=== Stripe Climate via MPP ==="
echo ""

echo "1. Listing available carbon removal products..."
tempo request -t -X GET "$GATEWAY/stripe/v1/climate/products"
echo ""

echo "2. Creating a climate order (1 tonne CO2 removal)..."
tempo request -t -X POST --json '{
  "metric_tons": "1",
  "currency": "usd"
}' "$GATEWAY/stripe/v1/climate/orders"
echo ""

echo "3. Listing your climate orders..."
tempo request -t -X GET "$GATEWAY/stripe/v1/climate/orders"
echo ""

echo "Done. Carbon removal funded via MPP stablecoins."
