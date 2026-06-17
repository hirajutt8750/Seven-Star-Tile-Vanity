import { useState, useEffect } from "react";
import { getOrders, updateOrder, deleteOrder } from "../api/orders";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Theme colors
const COLORS = {
  background: "#0A0F1E",
  card: "#0D1B2E",
  cyan: "#00E5FF",
  red: "#FF5252",
  text: "#E6F1FF",
  muted: "#8AA0BF",
  border: "#1E3A5F",
  inputBg: "#10233A",
  rowHover: "#102742",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingPrice, setEditingPrice] = useState({});
  const [priceInput, setPriceInput] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateOrder(id, { status: newStatus });
    loadOrders();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(id);
      loadOrders();
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePriceEdit = (order) => {
    setEditingPrice((prev) => ({ ...prev, [order._id]: true }));
    setPriceInput((prev) => ({ ...prev, [order._id]: order.totalPrice || 0 }));
  };

  const handlePriceSave = async (id) => {
    const newPrice = Number(priceInput[id]);
    await updateOrder(id, { totalPrice: newPrice });
    setEditingPrice((prev) => ({ ...prev, [id]: false }));
    loadOrders();
  };

  const handlePriceCancel = (id) => {
    setEditingPrice((prev) => ({ ...prev, [id]: false }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { background: "#3A2E0F", color: "#FFC857" };
      case "Confirmed":
        return { background: "#0F3A2E", color: "#00E5A8" };
      case "Cancelled":
        return { background: "#3A1414", color: COLORS.red };
      default:
        return { background: COLORS.inputBg, color: COLORS.muted };
    }
  };

  // ── PDF Generator ──
  const generatePDF = (order) => {
    const doc = new jsPDF();

    doc.setFillColor(212, 175, 55);
    doc.rect(0, 0, 210, 28, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("7 Star Tile Vanity", 14, 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Gujranwala, Pakistan  |  0323 7429771", 14, 22);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Order Confirmation", 14, 40);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Order ID: ${order._id}`, 14, 48);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString("en-PK")}`,
      14,
      54,
    );
    doc.text(`Status: ${order.status}`, 14, 60);

    autoTable(doc, {
      startY: 68,
      head: [["Customer Information", ""]],
      body: [
        ["Full Name", order.fullName],
        ["Phone", order.phone],
        ["Alt Phone", order.altPhone || "—"],
        ["City", order.city],
        ["Address", order.address],
      ],
      headStyles: {
        fillColor: [26, 26, 46],
        textColor: [212, 175, 55],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 11 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Order Details", ""]],
      body: [
        ["Product Type", order.productType || "—"],
        ["Category", order.category || "—"],
        ["Size", order.size || "—"],
        ["Color", order.color || "—"],
        ["Finish", order.finish || "—"],
        ["Quantity", order.quantity || "—"],
        ["Design", order.design || "—"],
        ["Special Notes", order.specialNotes || "—"],
      ],
      headStyles: {
        fillColor: [26, 26, 46],
        textColor: [212, 175, 55],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 11 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Delivery Details", ""]],
      body: [
        [
          "Delivery Method",
          order.deliveryMethod === "home" ? "Home Delivery" : "Factory Pickup",
        ],
        ["Delivery Address", order.deliveryAddress || "—"],
        ["Delivery Date", order.deliveryDate || "—"],
        ["Urgency", order.urgency === "urgent" ? "Urgent" : "Normal"],
      ],
      headStyles: {
        fillColor: [26, 26, 46],
        textColor: [212, 175, 55],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 11 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      body: [
        ["Total Price", `Rs. ${(order.totalPrice || 0).toLocaleString()}`],
      ],
      bodyStyles: {
        fillColor: [212, 175, 55],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 13,
      },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Thank you for choosing 7 Star Tile Vanity — Quality you can trust.",
      14,
      pageHeight - 10,
    );

    return doc;
  };

  const handleDownloadPDF = (order) => {
    const doc = generatePDF(order);
    doc.save(`Order_${order._id}.pdf`);
  };

  const handleSendEmail = async (order) => {
    const emailTo = prompt("Enter Customer Email:");
    if (!emailTo) return;

    const doc = generatePDF(order);
    const pdfBase64 = doc.output("datauristring").split(",")[1];

    try {
      const res = await fetch("http://localhost:5000/api/orders/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          pdfBase64,
          customerEmail: emailTo,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Email sent successfully!");
      } else {
        alert("❌ Email could not be sent. Please try again.");
      }
    } catch (err) {
      alert("❌ Server error. Please check the backend.");
    }
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const filterOptions = ["All", "Pending", "Confirmed", "Cancelled"];

  return (
    <div
      className="orders-page"
      style={{
        padding: "32px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: COLORS.background,
        minHeight: "100vh",
        color: COLORS.text,
      }}
    >
      <style>{`
        .order-card { transition: box-shadow 0.25s ease, transform 0.15s ease; }
        .order-card:hover { box-shadow: 0 0 18px rgba(0,229,255,0.12); }
        .order-summary { transition: background 0.2s ease; }
        .order-summary:hover { background: ${COLORS.rowHover}; }
        .filter-tab { transition: all 0.2s ease; cursor: pointer; flex-shrink: 0; }
        .filter-tab:hover { background: ${COLORS.inputBg} !important; }
        .delete-btn { transition: background 0.2s ease, transform 0.1s ease; }
        .delete-btn:hover { background: #E04848 !important; transform: translateY(-1px); }
        .download-btn { transition: all 0.2s ease; }
        .download-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .email-btn { transition: all 0.2s ease; }
        .email-btn:hover { filter: brightness(1.3); transform: translateY(-1px); }
        .price-edit-btn { transition: all 0.2s ease; }
        .price-edit-btn:hover { filter: brightness(1.3); }
        .price-save-btn { transition: all 0.2s ease; }
        .price-save-btn:hover { filter: brightness(1.1); }
        .price-cancel-btn { transition: all 0.2s ease; }
        .price-cancel-btn:hover { filter: brightness(1.2); }
        select.status-select { transition: filter 0.2s ease; }
        select.status-select:hover { filter: brightness(1.15); }

        .filter-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .filter-scroll::-webkit-scrollbar { display: none; }

        .order-summary-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.4fr 1fr 1.2fr auto;
          align-items: center;
          gap: 14px;
          width: 100%;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* ===== Mobile ===== */
        @media (max-width: 768px) {
          .orders-page { padding: 18px !important; }

          .orders-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .filter-scroll { width: 100%; }
          .filter-tabs-inner { display: flex; width: max-content; }

          .order-summary {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .order-summary-grid {
            display: flex !important;
            flex-direction: column;
            align-items: stretch !important;
            gap: 10px !important;
          }

          .order-summary-grid > div {
            min-width: 0 !important;
            width: 100%;
          }

          .row-label {
            display: inline-block;
            font-size: 11px;
            color: ${COLORS.muted};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-right: 6px;
          }

          select.status-select { width: 100%; }

          .view-details-toggle {
            text-align: center;
            padding-top: 6px;
            border-top: 1px solid ${COLORS.border};
            margin-top: 4px;
          }

          .details-grid {
            grid-template-columns: 1fr !important;
          }

          .action-buttons { flex-direction: column !important; }
          .action-buttons button { width: 100%; }
        }
      `}</style>

      {/* Header */}
      <div
        className="orders-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: COLORS.cyan,
              fontWeight: 700,
            }}
          >
            Orders
          </h1>
          <p
            style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: "15px" }}
          >
            Review order details, update status, and send PDF confirmations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-scroll">
          <div
            className="filter-tabs-inner"
            style={{
              display: "flex",
              gap: "6px",
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "10px",
              padding: "4px",
            }}
          >
            {filterOptions.map((opt) => (
              <div
                key={opt}
                className="filter-tab"
                onClick={() => setFilterStatus(opt)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  color: filterStatus === opt ? "#04141C" : COLORS.muted,
                  background:
                    filterStatus === opt ? COLORS.cyan : "transparent",
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "14px",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <p style={{ color: COLORS.muted, margin: 0, fontSize: "15px" }}>
            No orders found for this filter.
          </p>
        </div>
      ) : (
        filteredOrders.map((order) => {
          const statusStyle = getStatusStyle(order.status);
          const isEditing = editingPrice[order._id];

          return (
            <div
              key={order._id}
              className="order-card"
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "14px",
                marginBottom: "14px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            >
              {/* Summary Row */}
              <div
                className="order-summary"
                onClick={() => toggleExpand(order._id)}
                style={{
                  padding: "18px 24px",
                  cursor: "pointer",
                }}
              >
                <div className="order-summary-grid">
                  <div style={{ minWidth: "160px" }}>
                    <span className="row-label" style={{ display: "none" }}>
                      Customer
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: COLORS.text,
                        fontSize: "15px",
                      }}
                    >
                      {order.fullName}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        color: COLORS.muted,
                        fontSize: "13px",
                      }}
                    >
                      {order.phone}
                    </p>
                  </div>

                  <div
                    style={{
                      color: COLORS.muted,
                      fontSize: "14px",
                      minWidth: "100px",
                    }}
                  >
                    <span
                      className="row-label mobile-only-label"
                      style={{ display: "none" }}
                    >
                      City:{" "}
                    </span>
                    {order.city}
                  </div>

                  {/* Price — editable */}
                  <div
                    style={{ minWidth: "180px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isEditing ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            color: COLORS.cyan,
                            fontWeight: 700,
                            fontSize: "14px",
                          }}
                        >
                          Rs.
                        </span>
                        <input
                          type="number"
                          value={priceInput[order._id]}
                          onChange={(e) =>
                            setPriceInput((prev) => ({
                              ...prev,
                              [order._id]: e.target.value,
                            }))
                          }
                          style={{
                            width: "90px",
                            padding: "5px 8px",
                            border: `1px solid ${COLORS.cyan}`,
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: COLORS.cyan,
                            outline: "none",
                            background: COLORS.inputBg,
                          }}
                        />
                        <button
                          className="price-save-btn"
                          onClick={() => handlePriceSave(order._id)}
                          style={{
                            background: "#00E5A8",
                            color: "#04141C",
                            border: "none",
                            borderRadius: "6px",
                            padding: "5px 10px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          ✓
                        </button>
                        <button
                          className="price-cancel-btn"
                          onClick={() => handlePriceCancel(order._id)}
                          style={{
                            background: COLORS.inputBg,
                            color: COLORS.muted,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: "6px",
                            padding: "5px 10px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            color: COLORS.cyan,
                            fontSize: "15px",
                          }}
                        >
                          Rs. {(order.totalPrice || 0).toLocaleString()}
                        </span>
                        <button
                          className="price-edit-btn"
                          onClick={() => handlePriceEdit(order)}
                          style={{
                            background: COLORS.inputBg,
                            color: COLORS.cyan,
                            border: `1px solid ${COLORS.cyan}`,
                            borderRadius: "6px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      color: COLORS.muted,
                      fontSize: "13px",
                      minWidth: "90px",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>

                  {/* Status Dropdown */}
                  <select
                    className="status-select"
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    style={{
                      ...statusStyle,
                      padding: "7px 14px",
                      borderRadius: "20px",
                      border: "none",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <span
                    className="view-details-toggle"
                    style={{
                      color: COLORS.cyan,
                      fontSize: "13px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {expandedId === order._id
                      ? "▲ Hide Details"
                      : "▼ View Details"}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === order._id && (
                <div
                  style={{
                    borderTop: `1px solid ${COLORS.border}`,
                    padding: "24px",
                    background: COLORS.background,
                  }}
                >
                  <div
                    className="details-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "14px",
                      fontSize: "14px",
                    }}
                  >
                    {[
                      ["Alt Phone", order.altPhone],
                      ["Address", order.address],
                      ["Product Type", order.productType],
                      ["Category", order.category],
                      ["Size", order.size],
                      ["Color", order.color],
                      ["Finish", order.finish],
                      ["Quantity", order.quantity],
                      ["Design", order.design],
                      ["Delivery Method", order.deliveryMethod],
                      ["Delivery Address", order.deliveryAddress],
                      ["Delivery Date", order.deliveryDate],
                      ["Urgency", order.urgency],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p
                          style={{
                            margin: 0,
                            color: COLORS.muted,
                            fontSize: "12px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            color: COLORS.text,
                            fontSize: "14px",
                          }}
                        >
                          {value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <p
                      style={{
                        margin: 0,
                        color: COLORS.muted,
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Notes
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: COLORS.text,
                        fontSize: "14px",
                      }}
                    >
                      {order.specialNotes || "—"}
                    </p>
                  </div>

                  {/* Cart Items */}
                  {order.cartItems && order.cartItems.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <p
                        style={{
                          margin: "0 0 10px",
                          color: COLORS.cyan,
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        Cart Items
                      </p>
                      <div
                        style={{
                          background: COLORS.card,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        {order.cartItems.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "10px 16px",
                              borderTop:
                                i === 0 ? "none" : `1px solid ${COLORS.border}`,
                              fontSize: "14px",
                              color: COLORS.text,
                              flexWrap: "wrap",
                              gap: "6px",
                            }}
                          >
                            <span>
                              {item.name}{" "}
                              <span style={{ color: COLORS.muted }}>
                                x{item.quantity}
                              </span>
                            </span>
                            <span
                              style={{ fontWeight: 600, color: COLORS.cyan }}
                            >
                              Rs.{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="action-buttons" style={{ marginTop: "24px" }}>
                    <button
                      className="download-btn"
                      onClick={() => handleDownloadPDF(order)}
                      style={{
                        background: "#00E5A8",
                        color: "#04141C",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      ⬇ Download PDF
                    </button>

                    <button
                      className="email-btn"
                      onClick={() => handleSendEmail(order)}
                      style={{
                        background: COLORS.cyan,
                        color: "#04141C",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "14px",
                        boxShadow: `0 0 10px ${COLORS.cyan}55`,
                      }}
                    >
                      📧 Send PDF via Email
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(order._id)}
                      style={{
                        background: COLORS.red,
                        color: "#FFFFFF",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "14px",
                        boxShadow: `0 0 10px ${COLORS.red}44`,
                      }}
                    >
                      🗑 Delete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Orders;
