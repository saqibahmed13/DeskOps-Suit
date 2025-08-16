import { useEffect, useState } from 'react';
import excelData from '../assets/data.xlsx';
import readXlsxFile from 'read-excel-file';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import PropTypes from 'prop-types';
import './Addon.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---- INR formatter for UI ----
const formatINR = (n) =>
  n == null
    ? ''
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(Number(n));

export default function Addon({ customer, handleCustomerUpdate }) {
  const [components, setComponents] = useState({});
  const [showQuotation, setShowQuotation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [addOnItems, setAddOnItems] = useState(
    customer?.addOnItems || [
      {
        selectedCategory: '',
        selectedSubCategory: '',
        selectedItem: '',
        selectedSize: '',
        selectedOption: '',
        selectedDiameter: '',
        quantity: 1,
        price: null,
      },
    ]
  );

  const ADD_ITEM_TOAST_ID = 'add-item-toast';

  const handleBack = () => {
    navigate('/system');
  };

  const handleHome = () => {
    navigate('/');
  };

  // Fetch and parse the Excel data
  async function fetchData() {
    try {
      const response = await fetch(excelData);
      const blob = await response.blob();

      // List of sheets to read
      const sheets = [
        'System-Components',
        'Switch-Access-Gormet-Hole',
        'Storage-Prelam-Pedastal',
        'CRCA-Metal-Pedastal',
        'Partition-High-Storage',
        'Prelam',
        'Credenza',
        'Locker-Units',
        'Meeting-Table-Without-Flip-lid',
        'Accessory-Name-Plate',
        'Accessory-Planter-Box',
        'Accessory-Ladder-Graphics',
      ];

      // Category and subcategory mapping
      const categoryMapping = {
        'System-Components': 'System Components',
        'Switch-Access-Gormet-Hole': { category: 'Switch Access', subcategory: 'Gormet Hole' },
        'Storage-Prelam-Pedastal': { category: 'Storage', subcategory: 'Prelam Pedastal' },
        'CRCA-Metal-Pedastal': { category: 'Storage', subcategory: 'CRCA Metal Pedastal' },
        'Partition-High-Storage': { category: 'Storage', subcategory: 'Partition High Storage' },
        'Prelam': { category: 'Storage', subcategory: 'Prelam' },
        'Credenza': { category: 'Storage', subcategory: 'Credenza' },
        'Locker-Units': { category: 'Storage', subcategory: 'Locker Units' },
        'Accessory-Name-Plate': { category: 'Accessory', subcategory: 'Name Plate' },
        'Accessory-Planter-Box': { category: 'Accessory', subcategory: 'Planter Box' },
        'Accessory-Ladder-Graphics': { category: 'Accessory', subcategory: 'Ladder Graphics' },
        'Meeting-Table-Without-Flip-lid': 'Meeting Table Without Flip Lid',
      };

      const tempComponents = {};

      for (const sheet of sheets) {
        const data = await readXlsxFile(blob, { sheet });
        if (!data || !data.length) continue;

        // Filter out empty rows
        const filteredData = data.filter((row) => row.some((cell) => cell != null && cell !== ''));
        if (!filteredData.length) continue;

        const mapping = categoryMapping[sheet];
        if (!mapping) continue;

        // Handle Switch Access → Gormet Hole separately
        if (sheet === 'Switch-Access-Gormet-Hole') {
          const firstHeaderRow = filteredData[0];
          const secondHeaderRow = filteredData[1];

          if (firstHeaderRow[0] === 'Gormet Hole') {
            const diameters = secondHeaderRow.slice(1);

            const items = filteredData.slice(2).map((row) => {
              return {
                componentName: row[0],
                prices: row.slice(1),
              };
            });

            if (!tempComponents['Switch Access']) {
              tempComponents['Switch Access'] = { subcategories: {} };
            }

            tempComponents['Switch Access'].subcategories['Gormet Hole'] = {
              heading: 'Gormet Hole',
              diameters,
              items,
            };
          }
          continue;
        }

        // If mapping is a string, it's a top-level category without subcategories
        if (typeof mapping === 'string') {
          if (sheet === 'System-Components') {
            const headerRow = filteredData[0];
            const sizes = headerRow.slice(1).map((size) => size.toString());

            const items = filteredData.slice(1).map((row) => ({
              componentName: row[0],
              prices: row.slice(1),
            }));

            tempComponents[mapping] = {
              heading: mapping,
              sizes,
              items,
            };
          } else {
            const headerRow = filteredData[0];
            const items = filteredData.slice(1).map((row) => {
              const item = {};
              headerRow.forEach((colName, idx) => {
                const key = colName || `Column${idx}`;
                item[key] = row[idx];
              });
              return item;
            });

            tempComponents[mapping] = {
              heading: mapping,
              header: headerRow,
              items,
            };
          }
        } else {
          // Categories with subcategories
          const { category, subcategory } = mapping;

          if (!tempComponents[category]) {
            tempComponents[category] = { subcategories: {} };
          }

          const headerRow = filteredData[0];
          const items = filteredData.slice(1).map((row) => {
            const item = {};
            headerRow.forEach((colName, idx) => {
              const key = colName || `Column${idx}`;
              item[key] = row[idx];
            });
            return item;
          });

          tempComponents[category].subcategories[subcategory] = {
            heading: subcategory,
            header: headerRow,
            items,
          };
        }
      }

      setComponents(tempComponents);
    } catch (error) {
      console.error('Error reading Excel data:', error);
    }
  }

  useEffect(() => {
    if (location.state?.showQuotation) {
      setShowQuotation(true);
    }
    fetchData();
    // eslint-disable-next-line
  }, [location.state]);

  useEffect(() => {
    setAddOnItems(
      customer?.addOnItems || [
        {
          selectedCategory: '',
          selectedSubCategory: '',
          selectedItem: '',
          selectedSize: '',
          selectedOption: '',
          selectedDiameter: '',
          quantity: 1,
          price: null,
        },
      ]
    );
    // eslint-disable-next-line
  }, []);

  const calculatePriceForAddon = (item) => {
    const {
      selectedCategory,
      selectedSubCategory,
      selectedItem,
      selectedSize,
      selectedOption,
      selectedDiameter,
      quantity,
    } = item;

    if (!selectedCategory || !selectedItem || !quantity) {
      return null;
    }

    let categoryData = components[selectedCategory];
    if (!categoryData) return null;

    // If we have subcategories
    if (selectedSubCategory) {
      categoryData = categoryData.subcategories && categoryData.subcategories[selectedSubCategory];
      if (!categoryData) return null;
    }

    // 1) System Components
    if (selectedCategory === 'System Components') {
      if (!selectedSize) return null;
      const comp = categoryData.items.find((i) => i.componentName === selectedItem);
      if (!comp) return null;
      const sizeIndex = categoryData.sizes.indexOf(selectedSize);
      if (sizeIndex === -1) return null;
      const priceVal = comp.prices[sizeIndex];
      return parseFloat(priceVal || 0) * quantity;
    }

    // 2) Switch Access → Gormet Hole
    if (selectedCategory === 'Switch Access' && selectedSubCategory === 'Gormet Hole') {
      if (!selectedDiameter) return null;
      const foundItem = categoryData.items.find((row) => row.componentName === selectedItem);
      if (!foundItem) return null;
      const diamIndex = categoryData.diameters.indexOf(selectedDiameter);
      if (diamIndex === -1) return null;

      const priceVal = foundItem.prices[diamIndex];
      return parseFloat(priceVal || 0) * quantity;
    }

    // 3) Meeting Table Without Flip Lid (if it has diameters or options)
    if (selectedCategory === 'Meeting Table Without Flip Lid') {
      const firstHeader = categoryData.header?.[0];
      const foundRow = categoryData.items.find((row) => row[firstHeader] === selectedItem);
      if (!foundRow) return null;
      if (selectedDiameter) {
        const priceVal = foundRow[selectedDiameter];
        return parseFloat(priceVal || 0) * quantity;
      }
      if (selectedOption) {
        const priceVal = foundRow[selectedOption];
        return parseFloat(priceVal || 0) * quantity;
      }
      return null;
    }

    // 4) For other subcategories (e.g. Storage, Accessory, etc.),
    if (categoryData.header && categoryData.header.length > 1) {
      const nameKey = categoryData.header[0];
      const foundRow = categoryData.items.find(
        (row) => row[nameKey] === selectedItem || row.componentName === selectedItem
      );
      if (!foundRow) return null;

      if (selectedOption) {
        const val = foundRow[selectedOption];
        return parseFloat(val || 0) * quantity;
      }
    }

    if (selectedCategory === 'Storage') {
      if (
        selectedSubCategory === 'Partition High Storage' ||
        selectedSubCategory === 'Prelam Pedestal' ||
        selectedSubCategory === 'Storage' ||
        selectedSubCategory === 'Prelam'
      ) {
        const foundItem = categoryData.items.find((it) => it.description === selectedItem);
        if (!foundItem) return null;
        if (selectedOption) {
          const priceVal = foundItem[selectedOption];
          return parseFloat(priceVal || 0) * quantity;
        }
      }
    }

    return null;
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...addOnItems];
    updated[index][field] = value;

    // reset dependent fields if certain fields change
    if (field === 'selectedCategory') {
      updated[index].selectedSubCategory = '';
      updated[index].selectedItem = '';
      updated[index].selectedSize = '';
      updated[index].selectedOption = '';
      updated[index].selectedDiameter = '';
      updated[index].price = null;
    }
    if (field === 'selectedSubCategory') {
      updated[index].selectedItem = '';
      updated[index].selectedSize = '';
      updated[index].selectedOption = '';
      updated[index].selectedDiameter = '';
      updated[index].price = null;
      const selectedCategory = updated[index].selectedCategory;
      if (value === 'Partition High Storage' || value === 'Prelam Pedestal' || value === 'Storage') {
        updated[index].items = components[selectedCategory].subcategories[value].items;
      }
    }
    if (field === 'selectedItem') {
      updated[index].selectedSize = '';
      updated[index].selectedOption = '';
      updated[index].selectedDiameter = '';
      updated[index].price = null;
    }
    if (field === 'quantity') {
      const qty = parseInt(value, 10) || 1;
      updated[index].quantity = qty < 1 ? 1 : qty;
    }

    // recalc price
    const newPrice = calculatePriceForAddon(updated[index]);
    updated[index].price = newPrice;

    setAddOnItems(updated);
  };

  // For system items
  const updateQuantity = (index, value, type) => {
    const validQty = parseInt(value, 10) || 1;
    if (type === 'system') {
      const sysCopy = [...customer.systemItems];
      sysCopy[index].quantity = validQty;
      if (sysCopy[index].unitPrice) {
        sysCopy[index].price = sysCopy[index].unitPrice * validQty;
      }
      handleCustomerUpdate({ ...customer, systemItems: sysCopy });
    } else {
      const addOnCopy = [...addOnItems];
      addOnCopy[index].quantity = validQty;
      const newPrice = calculatePriceForAddon(addOnCopy[index]);
      addOnCopy[index].price = newPrice;
      setAddOnItems(addOnCopy);
    }
  };

  const addItem = () => {
    if (addOnItems.length === 0) {
      setAddOnItems([
        ...addOnItems,
        {
          selectedCategory: '',
          selectedSubCategory: '',
          selectedItem: '',
          selectedSize: '',
          selectedOption: '',
          selectedDiameter: '',
          quantity: 1,
          price: null,
        },
      ]);
    } else {
      const lastItem = addOnItems[addOnItems.length - 1];
      if (
        lastItem.selectedCategory &&
        lastItem.selectedItem &&
        lastItem.quantity &&
        lastItem.price !== null
      ) {
        setAddOnItems([
          ...addOnItems,
          {
            selectedCategory: '',
            selectedSubCategory: '',
            selectedItem: '',
            selectedSize: '',
            selectedOption: '',
            selectedDiameter: '',
            quantity: 1,
            price: null,
          },
        ]);
      } else {
        if (!toast.isActive(ADD_ITEM_TOAST_ID)) {
          toast.error(`Please complete Item ${addOnItems.length}  before adding another item.`, {
            position: 'top-right',
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            toastId: ADD_ITEM_TOAST_ID,
          });
        }
      }
    }
  };

  const generateUniqueNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const handleGenerateQuotation = () => {
    const uniqueNumber = generateUniqueNumber();
    if (!customer?.quotationNumber) {
      const updatedCustomer = {
        ...customer,
        quotationNumber: uniqueNumber,
        quotationCreatedAt: new Date().toISOString(),
      };
      handleCustomerUpdate(updatedCustomer);
    }
    setShowQuotation(true);
  };

  const exportToExcel = () => {
    const data = [];

    data.push(['QUOTATION NUMBER:', customer?.quotationNumber ?? 'N/A']);
    data.push([]);

    // Customer Details Header
    data.push(['CUSTOMER DETAILS']);
    data.push(['Customer Name:', customer?.customerDetails?.customerName || '']);
    data.push(['Date:', customer?.customerDetails?.date || '']);
    data.push(['Phone Number:', customer?.customerDetails?.phoneNumber || '']);
    data.push(['Location:', customer?.customerDetails?.location || '']);
    data.push(['Email:', customer?.customerDetails?.email || '']);
    data.push([]);

    // Combined header
    data.push(['ITEM DETAILS']);
    data.push(['Type', 'Component/System', 'Size/Option/Diameter', 'Sharing Type', 'Quantity', 'Price']);

    // System items (keep numeric; fill Sharing Type correctly)
    customer?.systemItems?.forEach((item) => {
      if (item.selectedSystem && item.selectedDimension && item.quantity) {
        data.push([
          'System',
          item.selectedSystem,
          item.selectedDimension,
          item.selectedSharing || '',
          Number(item.quantity) || 0,
          Number(item.price) || 0,
        ]);
      }
    });

    // Add-on items (Sharing Type N/A)
    addOnItems.forEach((item) => {
      if (item.selectedCategory && item.selectedItem && item.quantity && item.price != null) {
        data.push([
          'Add-On',
          item.selectedSubCategory
            ? `${item.selectedCategory} - ${item.selectedSubCategory} - ${item.selectedItem}`
            : `${item.selectedCategory} - ${item.selectedItem}`,
          getDisplayValue(item),
          '',
          Number(item.quantity) || 0,
          Number(item.price) || 0,
        ]);
      }
    });

    // Grand total (numeric)
    const grandTotal =
      (customer?.systemItems || []).reduce((acc, cur) => acc + (Number(cur.price) || 0), 0) +
      addOnItems.reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);

    data.push(['', '', '', '', 'Grand Total', Number(grandTotal) || 0]);

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Apply INR number format to Price column (F / index 5)
    if (ws['!ref']) {
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const addr = XLSX.utils.encode_cell({ r: R, c: 5 });
        const cell = ws[addr];
        if (cell && typeof cell.v === 'number') {
          cell.z = '₹ #,##,##0.00'; // Indian grouping
        }
      }
    }

    // Optional: column widths
    ws['!cols'] = [
      { wch: 10 }, // Type
      { wch: 32 }, // Component/System
      { wch: 26 }, // Size/Option/Diameter
      { wch: 16 }, // Sharing Type
      { wch: 10 }, // Quantity
      { wch: 18 }, // Price (₹)
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quotation');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'quotation.xlsx');
  };

  // Function to extract option labels from category data
  const getOptionLabels = (categoryData) => {
    if (categoryData.items && categoryData.items.length > 0) {
      const optionLabels = [];
      const firstItem = categoryData.items[0];
      Object.keys(firstItem).forEach((key, index) => {
        if (index > 0) {
          const label = typeof firstItem[key] === 'string' ? firstItem[key] : key;
          optionLabels.push({ key, label });
        }
      });
      return optionLabels;
    }
    return [];
  };

  // Helper function to get the display value for Size/Option/Diameter
  const getDisplayValue = (item) => {
    if (item.selectedSize) return item.selectedSize;
    if (item.selectedDiameter) return item.selectedDiameter;
    if (item.selectedOption) {
      const catData = item.selectedSubCategory
        ? components[item.selectedCategory]?.subcategories[item.selectedSubCategory]
        : components[item.selectedCategory];
      if (catData) {
        const options = getOptionLabels(catData);
        const found = options.find((o) => o.key === item.selectedOption);
        if (found) return found.label;
      }
      return item.selectedOption;
    }
    return '';
  };

  const deleteAddonItem = (index) => {
    if (addOnItems.length > 1) {
      const updatedItems = addOnItems.filter((_, idx) => idx !== index);
      setAddOnItems(updatedItems);
    } else {
      toast.warning('Cannot delete the default item.', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    handleCustomerUpdate({ ...customer, addOnItems });
    // eslint-disable-next-line
  }, [addOnItems]);

  // Precompute grand total for UI (formatted)
  const uiGrandTotal =
    (customer?.systemItems || []).reduce((sum, i) => sum + (Number(i.price) || 0), 0) +
    addOnItems.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

  return (
    <>
      <ToastContainer />
      <Header />
      <div className="container">
        <h1 className="title">{showQuotation ? 'Generated Quotation' : 'Select Add-On Items'}</h1>
        {!showQuotation && (
          <>
            {addOnItems.map((item, index) => {
              const categoryData = components[item.selectedCategory];
              const hasSubcategories = categoryData?.subcategories;
              let subcatData = null;
              if (item.selectedSubCategory && hasSubcategories) {
                subcatData = categoryData.subcategories[item.selectedSubCategory];
              }

              return (
                <div key={index} className="item-container">
                  <h2 className="item-title">Item {index + 1}</h2>

                  <div className="dropdown-container select-category">
                    <label className="label">Select Category:</label>
                    <select
                      className="select"
                      value={item.selectedCategory}
                      onChange={(e) => handleItemChange(index, 'selectedCategory', e.target.value)}
                    >
                      <option value="">-- Select Category --</option>
                      {Object.keys(components).map((catKey) => (
                        <option key={catKey} value={catKey}>
                          {catKey}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory Select */}
                  {item?.selectedCategory && hasSubcategories && (
                    <div className="dropdown-container">
                      <label className="label">Select Subcategory:</label>
                      <select
                        className="select"
                        value={item.selectedSubCategory}
                        onChange={(e) => handleItemChange(index, 'selectedSubCategory', e.target.value)}
                      >
                        <option value="">-- Select Subcategory --</option>
                        {Object.keys(categoryData?.subcategories || {}).map((subKey) => (
                          <option key={subKey} value={subKey}>
                            {subKey}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Component/Item Select */}
                  {((item?.selectedCategory && !hasSubcategories && categoryData?.items) ||
                    (item?.selectedSubCategory && subcatData?.items)) ? (
                    <div className="dropdown-container">
                      <label className="label">Select Component:</label>
                      <select
                        className="select"
                        value={item.selectedItem}
                        onChange={(e) => handleItemChange(index, 'selectedItem', e.target.value)}
                      >
                        <option value="">-- Select Component --</option>
                        {(subcatData ? subcatData.items : categoryData.items)
                          .filter((row) => {
                            const headingToExclude = subcatData ? subcatData.heading : categoryData.heading;
                            const firstColumn =
                              row.componentName ||
                              row[(subcatData ? subcatData.header : categoryData.header)?.[0]];
                            return (
                              !headingToExclude ||
                              !firstColumn ||
                              firstColumn.toLowerCase().trim() !== headingToExclude.toLowerCase().trim()
                            );
                          })
                          .map((comp, idx) => {
                            const firstColKey = subcatData ? subcatData.header?.[0] : categoryData.header?.[0];
                            const displayName = comp.componentName || comp[firstColKey] || '';
                            return (
                              <option key={displayName + idx} value={displayName}>
                                {displayName}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  ) : null}

                  {/* Switch Access -> Gormet Hole: Diameter Select */}
                  {item.selectedCategory === 'Switch Access' &&
                    item.selectedSubCategory === 'Gormet Hole' &&
                    item.selectedItem &&
                    subcatData && (
                      <div className="dropdown-container">
                        <label className="label">Select Diameter:</label>
                        <select
                          className="select"
                          value={item.selectedDiameter}
                          onChange={(e) => handleItemChange(index, 'selectedDiameter', e.target.value)}
                        >
                          <option value="">-- Select Diameter --</option>
                          {subcatData.diameters.map((diam, idx) => (
                            <option key={diam + idx} value={diam}>
                              {diam}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                  {/* Options Dropdown for other subcategories */}
                  {item.selectedItem &&
                    ((categoryData?.header?.length > 1 && !subcatData) ||
                      (subcatData?.header?.length > 1 && !subcatData.diameters)) && (
                      <div className="dropdown-container">
                        <label className="label">Select Option:</label>
                        <select
                          className="select"
                          value={item.selectedOption}
                          onChange={(e) => handleItemChange(index, 'selectedOption', e.target.value)}
                        >
                          <option value="">-- Select Option --</option>
                          {getOptionLabels(subcatData || categoryData).map(({ key, label }, idx) => (
                            <option key={key + idx} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                  {/* Size Select for System Components */}
                  {item.selectedCategory === 'System Components' && item.selectedItem && (
                    <div className="dropdown-container">
                      <label className="label">Select Size:</label>
                      <select
                        className="select"
                        value={item.selectedSize}
                        onChange={(e) => handleItemChange(index, 'selectedSize', e.target.value)}
                      >
                        <option value="">-- Select Size --</option>
                        {components['System Components']?.sizes?.map((sizeVal, idx) => (
                          <option key={sizeVal + idx} value={sizeVal}>
                            {sizeVal}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity Input */}
                  {item.selectedCategory && item.selectedItem && (
                    <div className="input-container">
                      <label className="label">Quantity:</label>
                      <input
                        type="number"
                        className="input"
                        value={item.quantity}
                        min={1}
                        onChange={(e) => updateQuantity(index, e.target.value, 'addon')}
                      />
                    </div>
                  )}

                  {/* Display Price (formatted INR) */}
                  {item.price != null && (
                    <div className="price-container">
                      <p className="priceText">
                        <strong>Total Price:</strong> {formatINR(item.price)}
                      </p>
                    </div>
                  )}

                  {addOnItems.length > 1 && (
                    <button onClick={() => deleteAddonItem(index)} className="delete-button">
                      Delete
                    </button>
                  )}
                </div>
              );
            })}

            {/* Add More Button and Navigation Buttons */}
            <button className="add-more-button" onClick={addItem}>
              Add More
            </button>
            <div className="btn-row">
              <button className="back-button" onClick={handleBack}>
                Back
              </button>
              {addOnItems.length > 0 && (
                <button className="generate-button" onClick={handleGenerateQuotation}>
                  Generate Quotation
                </button>
              )}
            </div>
          </>
        )}

        {/* Quotation Table */}
        {showQuotation && (
          <div className="table-container">
            <h2 className="table-title">Quotation No #{customer.quotationNumber}</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Component/System</th>
                  <th>Size/Option/Diameter</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {customer.systemItems
                  .filter((item) => item.selectedSystem && item.selectedDimension && item.quantity)
                  .map((item, idx) => (
                    <tr key={`system-${idx}`}>
                      <td>System</td>
                      <td>{item.selectedSystem}</td>
                      <td>
                        {item.selectedDimension} - {item.selectedSharing}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => updateQuantity(idx, e.target.value, 'system')}
                        />
                      </td>
                      <td>{formatINR(item.price)}</td>
                    </tr>
                  ))}
                {addOnItems
                  .filter((item) => item.selectedCategory && item.selectedItem && item.quantity && item.price != null)
                  .map((item, idx) => (
                    <tr key={`addon-${idx}`}>
                      <td>Add-On</td>
                      <td>
                        {item.selectedSubCategory
                          ? `${item.selectedCategory} - ${item.selectedSubCategory} - ${item.selectedItem}`
                          : `${item.selectedCategory} - ${item.selectedItem}`}
                      </td>
                      <td>{getDisplayValue(item)}</td>
                      <td>
                        <input
                          type="number"
                          className="input"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => updateQuantity(idx, e.target.value, 'addon')}
                        />
                      </td>
                      <td>{formatINR(item.price)}</td>
                    </tr>
                  ))}
                <tr className="total-row">
                  <td colSpan={4}>Grand Total</td>
                  <td>{formatINR(uiGrandTotal)}</td>
                </tr>
              </tbody>
            </table>
            <button className="export-button" onClick={exportToExcel}>
              Export
            </button>
            {!showQuotation && (
              <button className="back-button" onClick={() => setShowQuotation(false)}>
                Back
              </button>
            )}
            <button className="edit-button" onClick={() => navigate('/system')}>
              Edit
            </button>
            <button className="home-button" onClick={() => handleHome()}>
              Home
            </button>
          </div>
        )}
      </div>
    </>
  );
}

Addon.propTypes = {
  customer: PropTypes.shape({
    quotationNumber: PropTypes.string,
    systemItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
      })
    ),
    addOnItems: PropTypes.arrayOf(
      PropTypes.shape({
        selectedCategory: PropTypes.string,
        selectedSubCategory: PropTypes.string,
        selectedItem: PropTypes.string,
        selectedSize: PropTypes.string,
        selectedOption: PropTypes.string,
        selectedDiameter: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
      })
    ),
    customerDetails: PropTypes.shape({
      customerName: PropTypes.string,
      location: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      date: PropTypes.string,
    }),
  }),
  handleCustomerUpdate: PropTypes.func.isRequired,
};
