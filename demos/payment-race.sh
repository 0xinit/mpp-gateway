#!/usr/bin/env bash
# Payment Race — Tempo vs direct API speed comparison
# Shows how fast MPP payment negotiation + proxy is

GATEWAY="${MPP_GATEWAY:-http://localhost:3000}"

echo "=== Payment Race: MPP Gateway vs Direct ==="
echo ""

# Race 1: Free endpoint (no payment overhead)
echo "--- Race 1: Free endpoint (no payment) ---"
echo ""

echo "MPP Gateway (Massive market status):"
time tempo request -t -X GET "$GATEWAY/massive/v1/marketstatus/now" > /dev/null 2>&1
echo ""

echo "Direct API (Massive market status):"
time curl -s -H "Authorization: Bearer $MASSIVE_API_KEY" \
  "https://api.massive.com/v1/marketstatus/now" > /dev/null 2>&1
echo ""

# Race 2: Paid endpoint (includes 402 → pay → retry)
echo "--- Race 2: Paid endpoint (includes payment) ---"
echo ""

echo "MPP Gateway (Massive ticker lookup — \$0.005 via Tempo):"
time tempo request -t -X GET "$GATEWAY/massive/v3/reference/tickers?ticker=AAPL&limit=1" > /dev/null 2>&1
echo ""

echo "Direct API (same query, no payment):"
time curl -s -H "Authorization: Bearer $MASSIVE_API_KEY" \
  "https://api.massive.com/v3/reference/tickers?ticker=AAPL&limit=1" > /dev/null 2>&1
echo ""

# Race 3: Stripe endpoint
echo "--- Race 3: Stripe balance check ---"
echo ""

echo "MPP Gateway (Stripe balance — \$0.005 via Tempo):"
time tempo request -t -X GET "$GATEWAY/stripe/v1/balance" > /dev/null 2>&1
echo ""

echo "Direct Stripe API (no payment):"
time curl -s -H "Authorization: Bearer $STRIPE_SECRET_KEY" \
  "https://api.stripe.com/v1/balance" > /dev/null 2>&1
echo ""

echo "=== Race complete ==="
echo "Note: MPP adds ~500ms for on-chain payment settlement."
echo "The trade-off: no API keys needed on the client side."
