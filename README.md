# DeskOps Quotation Suite

A React/Vite app for building professional workspace quotations. It reads price lists from an Excel workbook, lets users configure systems and add-ons, tracks quotations locally, and exports a branded Excel quote.

---

## 🌐 Live Demo & Video

- **Live (hosting) link:** https://YOUR-LIVE-HOSTING-LINK.example.com
- **Demo video:** https://YOUR-DEMO-VIDEO-LINK.example.com


---

## ✨ Features

- **Quotation builder** for Systems and Add-ons powered by `data.xlsx`
- **Dynamic Home metrics** (keep purple theme, structure intact):
  - Total quotations
  - This week (rolling last 7 days)
  - Items quoted
  - Total value
  - Avg / quotation
- **Products gallery** with lazy-loaded images & route prefetch for snappy navigation
- **Export to Excel** (via `xlsx` + `file-saver`)
- **Local persistence** in `localStorage`
- **Toast notifications** for validation and guidance
- **Purple theme** with easy CSS tokens

---

## 🧱 Tech Stack

- React 18 + Vite
- React Router
- React Bootstrap + Bootstrap CSS
- react-icons
- read-excel-file (parse pricing workbook)
- xlsx + file-saver (export)
- react-toastify (toasts)

---

## 📁 Project Structure

