import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import "./ManageQuotation.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManageQuotations({
  customers,
  setCustomers,
  setActiveCustomerIndex,
  setEditingQuotation,
}) {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);

  const handleQuotationSelect = (index) => {
    setActiveCustomerIndex(index);
    setEditingQuotation(true);
    navigate("/addon", { state: { showQuotation: true } });
  };

  const handleDeleteClick = (index) => {
    
    setQuotationToDelete(index);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    const updatedCustomers = customers.filter(
      (_, idx) => idx !== quotationToDelete
    );
    if (!toast.isActive("delete-quotation-toast")) {
      toast.success(`Quotation deleted successfully!`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        toastId: "delete-quotation-toast",
      });
    }
    setCustomers(updatedCustomers);
    setShowConfirmation(false);
    setQuotationToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setQuotationToDelete(null);
  };



  return (
    <>
    <ToastContainer/>
      <Header />
      <div className="manage-container">
        <h2 className="manage-heading">Manage Quotations</h2>

        {customers.length > 0 ? (
  <table className="quotation-table">
    <thead>
      <tr>
        <th>S.No.</th>
        <th>Quotation No</th>
        <th>Customer Name</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {customers.map((customer, index) => (
        <tr key={index}>
           <td>{index + 1}</td>
          <td>
            <button
              className="quotation-number"
            >
              {customer.quotationNumber || index + 1}
            </button>
          </td>
          <td>
            {customer.customerDetails?.customerName || `Customer ${index + 1}`}
          </td>
          <td>
            <button
              onClick={() => handleDeleteClick(index)}
              className="action-btn delete"
            >
              Delete
            </button>
            <button
              onClick={() => handleQuotationSelect(index)}
              className="action-btn edit"
            >
              Edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <h2>No customer quotations found.</h2>
)}


        <button
          type="button"
          className="home-button"
          onClick={() => navigate("/")}
        >
          Home
        </button>

        {/* Confirmation Popup */}
        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-box">
              <p>Are you sure you want to delete this quotation?</p>
              <div className="confirmation-actions">
                <button onClick={cancelDelete} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="confirm-delete-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ManageQuotations;
