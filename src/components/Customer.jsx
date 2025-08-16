import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import "./Customer.css"; 

function Customer({
  setCustomers,
  customers,
  activeCustomerIndex,
  setActiveCustomerIndex,
  editingQuotation,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    date: "",
    phoneNumber: "",
    location: "",
    email: "",
  });

  useEffect(() => {
    if (editingQuotation && activeCustomerIndex !== null) {
      const existingDetails = customers[activeCustomerIndex].customerDetails;
      setCustomerDetails(existingDetails);
    } else {
      setCustomerDetails({
        customerName: "",
        date: "",
        phoneNumber: "",
        location: "",
        email: "",
      });
    }
  }, [activeCustomerIndex, editingQuotation, customers]);

  const navigateNext = () => {
    if (location?.state?.showQuotation) {
      navigate("/addon", { state: { showQuotation: true } });
    } else {
      navigate("/system");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const updatedCustomer = {
      ...customers[activeCustomerIndex],
      customerDetails,
    };

    if (editingQuotation) {
      setCustomers(
        customers.map((cust, idx) =>
          idx === activeCustomerIndex ? updatedCustomer : cust
        )
      );
    } else {
      const newCustomer = {
        customerDetails,
        systemItems: [
          {
            selectedSystem: "",
            selectedSharing: "",
            selectedDimension: "",
            quantity: 1,
            price: 0,
          },
        ],
        addOnItems: [
          {
            selectedCategory: "",
            selectedItem: "",
            quantity: 1,
            price: 0,
          },
        ],
        quotationNumber: null,
      };
      setCustomers([...customers, newCustomer]);
      setActiveCustomerIndex(customers.length);
    }
    navigateNext();
  };

  const handleChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <div className="customer-bg">
        <div className="customer-container">
          <h2 className="customer-title">Customer Details</h2>
          <form onSubmit={onSubmit} className="customer-form">
            <div className="customer-form-group">
              <label>Customer Name:</label>
              <input
                name="customerName"
                value={customerDetails.customerName}
                onChange={handleChange}
                placeholder="Customer Name"
                maxLength="50"
                required
              />
            </div>
            <div className="customer-form-group">
              <label>Date:</label>
              <input
                name="date"
                type="date"
                value={customerDetails.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="customer-form-group">
              <label>Phone Number:</label>
              <input
                name="phoneNumber"
                type="number"
                value={customerDetails.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                pattern="^[0-9]{10}$"
                required
              />
            </div>
            <div className="customer-form-group">
              <label>Location:</label>
              <input
                name="location"
                value={customerDetails.location}
                onChange={handleChange}
                placeholder="Location"
                required
              />
            </div>
            <div className="customer-form-group">
              <label>Email:</label>
              <input
                name="email"
                type="email"
                value={customerDetails.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <button type="submit" className="customer-next-btn">
              Next
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Customer;
