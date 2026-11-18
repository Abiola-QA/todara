#!/usr/bin/env bash
# Compares every page of the build with its view in the v4 design at three widths and prints one line per block
# that is not a match. Usage: tools/compare-all.sh [base-url]   (default http://localhost:5192)
set -u
BASE="${1:-http://localhost:5192}"
D="Todara Website v4.dc.html"
pairs=(
  "#/|/"
  "#/products|/products"
  "#/product/hass|/products/hass-avocado"
  "#/product/greenskin|/products/fuerte-green-skin-avocado"
  "#/product/mango|/products/mango"
  "#/product/iqf-avo-halves|/products/iqf-avocado-halves"
  "#/product/iqf-avo-dice|/products/iqf-avocado-dice"
  "#/product/iqf-mango-dice|/products/iqf-mango-dice"
  "#/product/iqf-mango-halves|/products/iqf-mango-halves-and-cheeks"
  "#/product/mango-puree|/products/mango-puree"
  "#/product/avo-pulp|/products/avocado-puree-and-pulp"
  "#/season|/seasonality"
  "#/compliance|/compliance"
  "#/about|/about"
  "#/faq|/faq"
  "#/legal|/privacy"
  "#/quote|/quote"
)
for pair in "${pairs[@]}"; do
  hash="${pair%%|*}"; route="${pair##*|}"
  out=".compare/all/$(echo "$route" | tr '/' '_' | sed 's/^_$/home/; s/^_//')"
  echo "### $route"
  node tools/compare.mjs "$D$hash" "$BASE$route" --widths 1440,768,390 --out "$out" 2>&1 | grep -E "===|<-- check|design-only|build-only|errors|worst"
done
