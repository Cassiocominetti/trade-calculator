# Trade Calculator ++Live On Crypto++

## Overview

This web application helps traders calculate positions, margins, and profit targets based on maximum loss, stop loss, leverage, risk:reward ratio, and optionally the entry price.

---

## How to Use

1. Enter the **Max Loss** value in dollars.
2. Set the **Stop Loss (%)** percentage.
3. Choose the **Leverage (x)** multiplier.
4. Optionally, enter the **Entry Price ($)** to automatically calculate **Stop-Loss (SL)** and **Take-Profit (TP)** prices.
   - If not provided, the calculator works normally without showing SL and TP prices.
5. Choose the **Risk:Reward (1:X)** ratio as your target.
6. Click **Calculate** to get:
   - Position size.
   - Margin used.
   - Target value.
   - (Optional) Entry price, Stop-Loss, and Take-Profit.

---

## Understanding the Results

- **Position Size:** Total position value that can be opened while respecting the maximum risk.
- **Margin Used:** Capital required to open the position considering the leverage.
- **Target Value:** Expected profit based on the risk:reward ratio.
- **Entry Price (optional):** Entry price provided.
- **Stop-Loss (optional):** Exit price if the trade goes wrong.
- **Take-Profit (optional):** Target price based on the risk:reward ratio.

---

## Calculation History

The system automatically saves inputs and results from each calculation in the browser's local storage.  
In the **History** tab you can:

- View all calculations performed.
- Export history in Excel format.
- Clear all history.

---

## Export to Excel

In the **History** tab, use the **Export** button to download an `.xlsx` file containing your calculation history, ready for analysis or backup.

In the **Documentation** tab, you can download a pre-formatted reference spreadsheet, ideal for those who prefer to work directly in Excel.  
This spreadsheet comes with pre-configured formulas. Simply fill in the input fields with your data. If you need to add new rows, drag the formulas down to apply them correctly.

---

## Language Toggle (PT/EN)

In the header, there is a toggle to switch between Portuguese and English.  
Your choice is remembered for future visits.

---

## Theme Toggle (Dark/Light)

In the header, there is a toggle to switch between light and dark themes according to your preference.  
Your choice is remembered for future visits.

---

## Disclaimer

The calculations are estimates only and do not constitute financial advice.  
Always consider fees, liquidation price, and market risks before trading.

---

### Links

For questions, suggestions, or support, get in touch:

- <a href="mailto:wgrazioli@gmail.com">Contact</a>
- <a href="mailto:cassianocmt@gmail.com">Support</a>
- <a href="https://hub.la/g/O2aJwMBhQupqoZiKjsPy" target="_blank">Learn about the "Live On Crypto" course</a>
- <a href="https://www.youtube.com/@willgrazioli" target="_blank">Visit the "Live On Crypto" channel</a>

---

© 2025 Viver de Cripto - All rights reserved.
