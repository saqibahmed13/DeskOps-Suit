import { useEffect, useState } from 'react';
import excelData from '../assets/data.xlsx';
import readXlsxFile from 'read-excel-file';
import { useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import "./System.css";
import Header from './Header';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const createDefaultItem = () => ({
  selectedSystem: '',
  selectedSharing: '',
  dimensions: [],
  selectedDimension: '',
  quantity: 1,
  unitPrice: null,
  price: null,
});

// ---- INR formatter (UI only) ----
const formatINR = (n) =>
  n == null
    ? ''
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(n);

const System = ({ customer, handleCustomerUpdate }) => {
  const [items, setItems] = useState(customer?.systemItems || [createDefaultItem()]);
  const [rows, setRows] = useState([]);
  const [systems, setSystems] = useState([]);
  const [showQuotation, setShowQuotation] = useState(false);
  const navigate = useNavigate();

  const ADD_ITEM_TOAST_ID = "add-item-toast";

  const handleNext = () => {
    navigate('/addon');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const canNavigate = () => {
    return items.every(item => item.selectedSystem && item.selectedSharing && item.selectedDimension && item.price !== null);
  };

  const goToAddon = () => {
    if (canNavigate()) {
      navigate('/addon');
    }
  };

  const deleteItem = (index) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, idx) => idx !== index);
      setItems(updatedItems);
    } else {
      toast.warning('Cannot delete the default item.', {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  async function fetchData() {
    try {
      const response = await fetch(excelData);
      const blob = await response.blob();
      const data = await readXlsxFile(blob, { sheet: 'System' });

      const systemsData = [];
      const dimensionTypes = data[1].slice(1);
      data.slice(2).forEach((priceRow) => {
        const systemName = priceRow[0];
        priceRow.slice(1).forEach((price, priceIndex) => {
          systemsData.push({
            systemName: systemName,
            sharingType: data[0][priceIndex + 1].trim() === 'Sharing' ? 'Sharing' : 'Non-Sharing',
            dimension: dimensionTypes[priceIndex],
            price: Number(price) || 0
          });
        });
      });
      const uniqueSystems = Array.from(new Set(systemsData.map(row => row.systemName)));
      setSystems(uniqueSystems);
      setRows(systemsData);
    } catch (error) {
      console.error(error);
    }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'selectedSystem') {
      newItems[index].selectedSharing = '';
      newItems[index].dimensions = [];
      newItems[index].selectedDimension = '';
      newItems[index].unitPrice = null;
      newItems[index].price = null;
    }

    if (field === 'selectedSharing') {
      const filteredDimensions = rows
        .filter(row => row.systemName === newItems[index].selectedSystem && row.sharingType === value)
        .map(row => row.dimension);
      newItems[index].dimensions = Array.from(new Set(filteredDimensions));
      newItems[index].selectedDimension = '';
      newItems[index].unitPrice = null;
      newItems[index].price = null;
    }

    if (field === 'selectedDimension') {
      const selectedRow = rows.find(row =>
        row.systemName === newItems[index].selectedSystem &&
        row.sharingType === newItems[index].selectedSharing &&
        row.dimension === value
      );
      if (selectedRow) {
        newItems[index].unitPrice = Number(selectedRow.price) || 0;
        newItems[index].price = newItems[index].unitPrice * (Number(newItems[index].quantity) || 1);
      } else {
        newItems[index].unitPrice = null;
        newItems[index].price = null;
      }
    }

    if (field === 'quantity') {
      const newQuantity = Math.max(1, parseInt(value) || 1);
      newItems[index].quantity = newQuantity;

      const selectedRow = rows.find(row =>
        row.systemName === newItems[index].selectedSystem &&
        row.sharingType === newItems[index].selectedSharing &&
        row.dimension === newItems[index].selectedDimension
      );
      if (selectedRow) {
        const unit = Number(selectedRow.price) || 0;
        newItems[index].unitPrice = unit;
        newItems[index].price = unit * newQuantity;
      }
    }

    setItems(newItems);
  };

  const addItem = () => {
    if (!items) {
      console.error('Items is undefined or null');
      return;
    }

    const lastItem = items.length > 0 ? items[items.length - 1] : undefined;

    if (lastItem?.selectedSystem && lastItem?.selectedSharing && lastItem?.selectedDimension && lastItem?.price !== null) {
      setItems([
        ...items,
        createDefaultItem(),
      ]);
    } else {
      if (!toast.isActive(ADD_ITEM_TOAST_ID)) {
        toast.error(`Please complete Item ${items.length} before adding another item.`, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          toastId: ADD_ITEM_TOAST_ID,
        });
      }
    }
  };

  const updateQuantity = (index, value) => {
    const newItems = [...items];
    const newQuantity = Math.max(1, parseInt(value) || 1);
    newItems[index].quantity = newQuantity;

    // Recalculate price based on the new quantity using unitPrice (if available) or fallback to rows
    if (newItems[index].unitPrice !== null && newItems[index].unitPrice !== undefined) {
      newItems[index].price = Number(newItems[index].unitPrice) * newQuantity;
    } else {
      const selectedRow = rows.find(row =>
        row.systemName === newItems[index].selectedSystem &&
        row.sharingType === newItems[index].selectedSharing &&
        row.dimension === newItems[index].selectedDimension
      );
      if (selectedRow) {
        const unit = Number(selectedRow.price) || 0;
        newItems[index].unitPrice = unit;
        newItems[index].price = unit * newQuantity;
      }
    }

    setItems(newItems);
  };

  const exportToExcel = () => {
    const data = [];
    data.push(['QUOTATION NUMBER:', customer?.quotationNumber ?? 'N/A']);
    data.push([]); // spacing

    // Customer Details
    data.push(['CUSTOMER DETAILS']);
    data.push(['Customer Name:', customer?.customerDetails?.customerName || '']);
    data.push(['Date:', customer?.customerDetails?.date || '']);
    data.push(['Phone Number:', customer?.customerDetails?.phoneNumber || '']);
    data.push(['Location:', customer?.customerDetails?.location || '']);
    data.push(['Email:', customer?.customerDetails?.email || '']);
    data.push([]); // spacing

    // Items Header
    data.push(['ITEM DETAILS']);
    data.push(['Type', 'Component/System', 'Size/Option/Diameter', 'Sharing Type', 'Quantity', 'Price']);

    items.forEach((item) => {
      if (item.selectedSystem && item.selectedDimension && item.quantity) {
        data.push([
          'System',
          item.selectedSystem,
          item.selectedDimension,
          item.selectedSharing || '',
          Number(item.quantity) || 0,
          Number(item.price) || 0, // keep numeric for Excel math; we'll apply INR format below
        ]);
      }
    });

    const grandTotal = items.reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);
    data.push(['', '', '', '', 'Grand Total', Number(grandTotal) || 0]); // numeric

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Apply INR number format (lakhs/crores) to numeric cells in column F (index 5)
    if (ws['!ref']) {
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const addr = XLSX.utils.encode_cell({ r: R, c: 5 }); // column F
        const cell = ws[addr];
        if (cell && typeof cell.v === 'number') {
          cell.z = '₹ #,##,##0.00';
        }
      }
    }

    // Optional: set a comfy width for each column
    ws['!cols'] = [
      { wch: 12 }, // Type
      { wch: 25 }, // Component/System
      { wch: 24 }, // Size/Option/Diameter
      { wch: 16 }, // Sharing Type
      { wch: 10 }, // Quantity
      { wch: 18 }, // Price (₹)
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quotation');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'quotation.xlsx');
  };

  // Update parent when local items change.
  useEffect(() => {
    handleCustomerUpdate?.({ ...customer, systemItems: items });
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPrice = items.reduce((total, item) => total + (Number(item.price) || 0), 0);

  return (
    <>
      <Header/>
      <ToastContainer />
      <div className="container">
        <h1 className="title">Select the System</h1>
        {!showQuotation && (
          <>
            {items?.map((item, index) => (
              <div key={index} className="item-container">
                <h2 className="item-title">Item {index + 1}</h2>

                {/* System Dropdown */}
                <div className="dropdown-container">
                  <label htmlFor={`system-select-${index}`} className="label">Select System:</label>
                  <select
                    id={`system-select-${index}`}
                    value={item.selectedSystem}
                    onChange={(e) => handleItemChange(index, 'selectedSystem', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">-- Select System --</option>
                    {systems.map(system => (
                      <option key={system} value={system}>
                        {system}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sharing Type Dropdown */}
                <div className="dropdown-container">
                  <label htmlFor={`sharing-select-${index}`} className="label">Select Sharing Type:</label>
                  <select
                    id={`sharing-select-${index}`}
                    value={item.selectedSharing}
                    onChange={(e) => handleItemChange(index, 'selectedSharing', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">-- Select Sharing Type --</option>
                    <option value="Sharing">Sharing</option>
                    <option value="Non-Sharing">Non-Sharing</option>
                  </select>
                </div>

                {/* Dimension Dropdown */}
                <div className="dropdown-container">
                  <label htmlFor={`dimension-select-${index}`} className="label">Select Dimension:</label>
                  <select
                    id={`dimension-select-${index}`}
                    value={item.selectedDimension}
                    onChange={(e) => handleItemChange(index, 'selectedDimension', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">-- Select Dimension --</option>
                    {item.dimensions?.map((dimension, i) => (
                      <option key={i} value={dimension}>
                        {dimension}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Input */}
                <div className="input-container">
                  <label htmlFor={`quantity-input-${index}`} className="label">Quantity:</label>
                  <input
                    id={`quantity-input-${index}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(index, e.target.value)}
                    className="input"
                    min="1"
                  />
                </div>

                {/* Display Price (formatted INR) */}
                {item.price !== null && (
                  <div className="price-container">
                    <p className="price-text">
                      <strong>Total Price:</strong> {formatINR(item.price)}
                    </p>
                  </div>
                )}

                {items.length > 1 && (
                  <button onClick={() => deleteItem(index)} className='delete-btn'>Delete</button>
                )}
              </div>
            ))}

            {/* Add More Button */}
            <button onClick={addItem} className="button add-button">
              Add More
            </button>

            {/* Next Button */}
            {items?.some((item) => item.price !== null) && (
              <button
                onClick={() => {
                  goToAddon();
                  handleNext();
                }}
                className="button generate-button"
              >
                Next
              </button>
            )}
          </>
        )}

        {/* Quotation Table */}
        {showQuotation && (
          <div className="table-container">
            <h2 className="table-title">Quotation</h2>
            <h2>Quotation No #{customer?.quotationNumber}</h2>
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Item</th>
                  <th className="th">System</th>
                  <th className="th">Sharing Type</th>
                  <th className="th">Dimension</th>
                  <th className="th">Quantity</th>
                  <th className="th">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => item.price !== null && (
                  <tr key={index}>
                    <td className="td">{index + 1}</td>
                    <td className="td">{item.selectedSystem}</td>
                    <td className="td">{item.selectedSharing}</td>
                    <td className="td">{item.selectedDimension}</td>
                    <td className="td">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, e.target.value)}
                        className="input"
                        min="1"
                      />
                    </td>
                    <td className="td">{formatINR(item.price)}</td>
                  </tr>
                ))}
                {/* Total Price */}
                <tr className="total-row">
                  <td className="td" colSpan="5">Total:</td>
                  <td className="td">{formatINR(totalPrice)}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={exportToExcel}>Export</button>
            {!showQuotation && (
              <button onClick={() => setShowQuotation(false)}>Back</button>
            )}
            <button onClick={() => navigate('/system')}>Edit</button>
            <button onClick={() => navigate('/')}>Home</button>
          </div>
        )}
      </div>
    </>
  );
};

export default System;
