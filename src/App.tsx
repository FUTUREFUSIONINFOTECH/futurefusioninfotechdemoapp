import React, { useMemo, useRef, useState } from "react";
import { CategoryImage, SvgIcon } from "./components/Icons";
import { MonitorFrame } from "./components/MonitorFrame";
import {
  BizCredential,
  BookingItem,
  BusinessItem,
  BusinessOrder,
  businessMenu,
  categories,
  cities,
  initialBizCredentials,
  initialBusinesses,
  initialBusinessOrders,
  initialSalesPersons,
  initialWalletTxns,
  LOGO_SRC,
  plans,
  RoleType,
  CustomerPage,
  SalesPerson,
  servicesList,
  superMenu,
  WalletTxn,
} from "./data/app4appData";

type ModalState =
  | { type: "details"; booking: BookingItem }
  | { type: "reschedule"; bookingId: string }
  | { type: "createBusiness" }
  | null;

const roleMeta: Record<RoleType, { icon: string; label: string }> = {
  "customer-app": { icon: "smartphone", label: "Customer Mobile App" },
  "customer-mobile-web": { icon: "globe", label: "Customer Mobile Web" },
  "customer-web": { icon: "home", label: "Customer Website" },
  sales: { icon: "wallet", label: "Sales Person" },
  business: { icon: "building", label: "Business Admin" },
  super: { icon: "shield", label: "Super Admin" },
};

const customerRoles: RoleType[] = [
  "customer-app",
  "customer-mobile-web",
  "customer-web",
];
const adminRoles: RoleType[] = ["sales", "business", "super"];

export default function App() {
  const [role, setRole] = useState<RoleType>("customer-app");
  const [customerPage, setCustomerPage] = useState<CustomerPage>("home");
  const [category, setCategory] = useState<string>("All");
  const [city, setCity] = useState<string>("All Cities");
  const [query, setQuery] = useState<string>("");

  const [businesses, setBusinesses] = useState<BusinessItem[]>(initialBusinesses);
  const [selectedBiz, setSelectedBiz] = useState<BusinessItem | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<string>("2026-11-27");
  const [bookingTime, setBookingTime] = useState<string>("10:00 AM");
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [custName, setCustName] = useState<string>("Keerthana");
  const [custPhone, setCustPhone] = useState<string>("9876543210");
  const [custNote, setCustNote] = useState<string>("");

  const [bookings, setBookings] = useState<BookingItem[]>([]);

  // Sales portal state
  const [salesPersons, setSalesPersons] = useState<SalesPerson[]>(initialSalesPersons);
  const [walletTxns, setWalletTxns] = useState<WalletTxn[]>(initialWalletTxns);
  const [businessOrders, setBusinessOrders] = useState<BusinessOrder[]>(initialBusinessOrders);
  const [salesAuthTab, setSalesAuthTab] = useState<"login" | "register">("login");
  const [loggedSalesId, setLoggedSalesId] = useState<string | null>(null);
  const [salesPage, setSalesPage] = useState<string>("Overview");

  // Sales login inputs
  const [spLoginId, setSpLoginId] = useState<string>("sales.karthik");
  const [spPass, setSpPass] = useState<string>("Sales@2026");

  // Sales registration inputs
  const [regSpName, setRegSpName] = useState("");
  const [regSpPhone, setRegSpPhone] = useState("");
  const [regSpEmail, setRegSpEmail] = useState("");
  const [regSpCity, setRegSpCity] = useState(cities[0]);
  const [regSpId, setRegSpId] = useState("");
  const [regSpUpi, setRegSpUpi] = useState("");

  // New Business Order inputs
  const [ordBizName, setOrdBizName] = useState("");
  const [ordBizCat, setOrdBizCat] = useState(categories[0].name);
  const [ordBizTag, setOrdBizTag] = useState("");
  const [ordBizCity, setOrdBizCity] = useState(cities[0]);
  const [ordBizAddr, setOrdBizAddr] = useState("");
  const [ordOwner, setOrdOwner] = useState("");
  const [ordPhone, setOrdPhone] = useState("");
  const [ordEmail, setOrdEmail] = useState("");
  const [ordServices, setOrdServices] = useState("");
  const [ordStaff, setOrdStaff] = useState("");
  const [ordPlan, setOrdPlan] = useState(plans[0].name);

  // Withdraw inputs
  const [wdAmount, setWdAmount] = useState("");
  const [wdMethod, setWdMethod] = useState("UPI Instant Transfer");
  const [wdDest, setWdDest] = useState("");

  // Business admin state
  const [bizCredentials, setBizCredentials] = useState<BizCredential[]>(initialBizCredentials);
  const [loggedBizLoginId, setLoggedBizLoginId] = useState<string | null>(null);
  const [bizPage, setBizPage] = useState<string>("Overview");
  const [bzLoginId, setBzLoginId] = useState<string>(initialBizCredentials[0].loginId);
  const [bzPass, setBzPass] = useState<string>(initialBizCredentials[0].password);
  const [chgCurPwd, setChgCurPwd] = useState<string>("");
  const [chgNewPwd, setChgNewPwd] = useState<string>("");
  const [chgConfPwd, setChgConfPwd] = useState<string>("");

  // Super admin state
  const [superPage, setSuperPage] = useState<string>("Overview");

  // Toast & modal state
  const [toastMsg, setToastMsg] = useState<string>("");
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const toastTimerRef = useRef<number | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);

  // Modal fields
  const [reschedDate, setReschedDate] = useState("2026-11-28");
  const [reschedTime, setReschedTime] = useState("11:30 AM");
  const [newBizName, setNewBizName] = useState("");
  const [newBizCat, setNewBizCat] = useState(categories[0].name);
  const [newBizCity, setNewBizCity] = useState(cities[0]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastVisible(false), 2600);
  };

  const filteredBusinesses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter(
      (b) =>
        !b.paused &&
        (category === "All" || b.category === category) &&
        (city === "All Cities" || b.city === city) &&
        (!q ||
          [b.name, b.category, b.tag || "", b.city, ...b.services, ...b.staff]
            .join(" ")
            .toLowerCase()
            .includes(q))
    );
  }, [businesses, category, city, query]);

  const startBooking = (biz: BusinessItem) => {
    setSelectedBiz(biz);
    setSelectedService(null);
    setSelectedStaff(null);
    setCurrentStep(0);
    setCustomerPage("book");
  };

  const handleNextStep = () => {
    if (currentStep === 0 && !selectedService) {
      showToast("Please select a service");
      return;
    }
    if (currentStep === 1 && !selectedStaff) {
      setSelectedStaff("Any available");
    }
    setCurrentStep((s) => Math.min(3, s + 1));
  };

  const submitBooking = () => {
    if (!selectedBiz) return;
    if (!custName.trim() || !custPhone.trim()) {
      showToast("Enter customer name and mobile number");
      return;
    }
    const id = "AF4-" + String(1000 + bookings.length + 1);
    const newBooking: BookingItem = {
      id,
      businessId: selectedBiz.id,
      business: selectedBiz.name,
      category: selectedBiz.category,
      city: selectedBiz.city,
      service: selectedService || selectedBiz.services[0],
      professional: selectedStaff || "Any available",
      date: bookingDate,
      time: bookingTime,
      customer: custName.trim(),
      phone: custPhone.trim(),
      status: "Pending",
      note: custNote,
    };
    setBookings((prev) => [newBooking, ...prev]);
    setCustomerPage("confirmation");
    showToast("Appointment request submitted");
  };

  const updateBookingStatus = (id: string, status: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    showToast(`Booking ${id} ${status.toLowerCase()}`);
  };

  const approveReschedule = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              date: b.requestedDate || b.date,
              time: b.requestedTime || b.time,
              status: "Rescheduled",
            }
          : b
      )
    );
    showToast("New appointment time approved");
  };

  // Intro text per role
  const introText = useMemo(() => {
    switch (role) {
      case "customer-app":
        return {
          title: "Customer Mobile App",
          sub: "Native mobile app for customers to book hospitals, beauty parlours, VIPs & celebrity desks.",
        };
      case "customer-mobile-web":
        return {
          title: "Customer Mobile Website",
          sub: "Mobile browser experience at app4app.in without app installation.",
        };
      case "customer-web":
        return {
          title: "Customer Website",
          sub: "Separate desktop customer website at app4app.in for browsing verified services and booking appointments.",
        };
      case "sales":
        return {
          title: "Sales Person Website & Wallet",
          sub: "Verified sales executives submit business orders, earn wallet commission on full payment & withdraw funds.",
        };
      case "business":
        return {
          title: "Business Admin Website",
          sub: "Registered business owners log in with Super Admin credentials, update their password, and manage bookings.",
        };
      case "super":
        return {
          title: "Super Admin Website",
          sub: "Verify sales executives, confirm business orders & full payments, credit sales wallets, and issue business logins.",
        };
    }
  }, [role]);

  // Customer Sub-views
  const renderBizCards = (list: BusinessItem[]) => {
    if (!list.length) {
      return <div className="empty">No services found for this category and city.</div>;
    }
    return list.map((b) => (
      <div className="biz" key={b.id}>
        <div className="biz-ico">
          <CategoryImage iconKey={b.icon} alt={b.category} />
        </div>
        <div className="biz-info">
          <strong>{b.name}</strong>
          <small>
            {b.category}
            {b.tag ? ` · ${b.tag}` : ""} · {b.city}
          </small>
          <em>
            ★ {b.rating} · {b.services.length} services · From ₹{b.price.toLocaleString("en-IN")}
          </em>
        </div>
        <button className="biz-action" onClick={() => startBooking(b)}>
          Book now
        </button>
      </div>
    ));
  };

  const renderCustomerHome = (isMobWeb = false) => (
    <>
      <div className="hero">
        <small>{isMobWeb ? "MOBILE BROWSER · APP4APP.IN" : "YOUR TIME, YOUR CHOICE"}</small>
        <h2>Appointments made simple.</h2>
        <p>
          Discover trusted local services, beauty parlours, VIPs and celebrity desks at the right
          time.
        </p>
      </div>
      <div className="search">
        <SvgIcon name="search" size={16} />
        <input
          value={query}
          placeholder="Search business, beauty, VIP, actor..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => showToast("Search updated")}>
          <SvgIcon name="search" size={16} />
        </button>
      </div>
      <div className="section-head">
        <strong>Explore categories</strong>
        <button onClick={() => setCategory("All")}>View all</button>
      </div>
      <div className="categories">
        <button
          className={`cat ${category === "All" ? "active" : ""}`}
          aria-label="All categories"
          onClick={() => setCategory("All")}
        >
          <CategoryImage iconKey="all" alt="All" height={42} />
          <small>All Services</small>
        </button>
        {categories.map((c) => (
          <button
            key={c.name}
            className={`cat ${category === c.name ? "active" : ""}`}
            aria-label={c.name}
            onClick={() => setCategory(c.name)}
          >
            <CategoryImage
              iconKey={c.icon}
              alt={c.name}
              height={c.sub ? 42 : undefined}
            />
            {c.sub && <small>{c.sub}</small>}
          </button>
        ))}
      </div>
      <div className="section-head">
        <strong>Choose your city</strong>
        <button onClick={() => showToast(`City filter: ${city}`)}>{city}</button>
      </div>
      <div className="field">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="All Cities">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="section-head">
        <strong>
          {category === "All" ? "Popular mobile services" : `${category} services`}
        </strong>
        <button
          onClick={() => {
            setCategory("All");
            setCity("All Cities");
            setQuery("");
            setCustomerPage("home");
          }}
        >
          See all →
        </button>
      </div>
      <div id="bizList">{renderBizCards(filteredBusinesses)}</div>
    </>
  );

  const renderBookingWizard = () => {
    if (!selectedBiz) return renderCustomerHome();
    const steps = ["Service", "Professional", "Date & time", "Details"];
    return (
      <>
        <div className="section-head">
          <button onClick={() => setCustomerPage("home")}>← Back to explore</button>
          <span className="tag-text">Step {currentStep + 1} of 4</span>
        </div>

        {currentStep === 0 && (
          <div className="card">
            <h3>{selectedBiz.name}</h3>
            <p className="muted" style={{ fontSize: "11px" }}>
              {selectedBiz.category}
              {selectedBiz.tag ? ` · ${selectedBiz.tag}` : ""} · {selectedBiz.city}
            </p>
            <div className="steps">
              {steps.map((_, i) => (
                <span key={i} className={`step ${i <= currentStep ? "done" : ""}`} />
              ))}
            </div>
            <h3>
              Select{" "}
              {selectedBiz.category === "Hospital" ? "department / consultation" : "service"}
            </h3>
            {selectedBiz.services.map((x, i) => (
              <button
                key={x}
                className="biz"
                style={{
                  width: "100%",
                  textAlign: "left",
                  borderColor: selectedService === x ? "#7ba9ed" : "var(--line)",
                }}
                onClick={() => setSelectedService(x)}
              >
                <div className="biz-info">
                  <strong>{x}</strong>
                  <small>
                    {selectedBiz.category === "Hospital" ? "Consultation" : "Appointment"} ·{" "}
                    {30 + i * 15} min
                  </small>
                </div>
                <b style={{ color: "#1763d5" }}>
                  ₹{(selectedBiz.price + i * 150).toLocaleString("en-IN")}
                </b>
                {selectedService === x && <SvgIcon name="check" />}
              </button>
            ))}
          </div>
        )}

        {currentStep === 1 && (
          <div className="card">
            <div className="steps">
              {steps.map((_, i) => (
                <span key={i} className={`step ${i <= currentStep ? "done" : ""}`} />
              ))}
            </div>
            <h3>Select professional</h3>
            <p className="muted" style={{ fontSize: "11px" }}>
              Choose a preferred professional or continue with first available.
            </p>
            {selectedBiz.staff.map((x) => (
              <button
                key={x}
                className="biz"
                style={{ width: "100%", textAlign: "left" }}
                onClick={() => setSelectedStaff(x)}
              >
                <div className="biz-ico">
                  <SvgIcon name="user" />
                </div>
                <div className="biz-info">
                  <strong>{x}</strong>
                  <small>Available for selected service</small>
                </div>
                {selectedStaff === x && <SvgIcon name="check" />}
              </button>
            ))}
            <button
              className="btn ghost"
              style={{ width: "100%" }}
              onClick={() => {
                setSelectedStaff("Any available");
                setCurrentStep(2);
              }}
            >
              Any available professional
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="card">
            <div className="steps">
              {steps.map((_, i) => (
                <span key={i} className={`step ${i <= currentStep ? "done" : ""}`} />
              ))}
            </div>
            <h3>Choose date & time</h3>
            <div className="field">
              <label>Appointment date</label>
              <input
                type="date"
                value={bookingDate}
                min="2026-11-25"
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>
            <label className="muted" style={{ fontSize: "11px", fontWeight: 700 }}>
              Available time slots
            </label>
            <div className="slotgrid" style={{ marginTop: "8px" }}>
              {[
                "09:00 AM",
                "10:00 AM",
                "11:30 AM",
                "02:00 PM",
                "03:30 PM",
                "05:00 PM",
              ].map((t) => (
                <button
                  key={t}
                  className={`slot ${bookingTime === t ? "active" : ""}`}
                  onClick={() => setBookingTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="notice">
              Availability is checked again when the appointment request is submitted.
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="card">
            <div className="steps">
              {steps.map((_, i) => (
                <span key={i} className={`step ${i <= currentStep ? "done" : ""}`} />
              ))}
            </div>
            <h3>Customer details</h3>
            <div className="field">
              <label>Full name</label>
              <input
                value={custName}
                placeholder="Enter full name"
                onChange={(e) => setCustName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Mobile number</label>
              <input
                value={custPhone}
                placeholder="Mobile number"
                onChange={(e) => setCustPhone(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Notes (optional)</label>
              <textarea
                rows={2}
                value={custNote}
                placeholder="Add a note"
                onChange={(e) => setCustNote(e.target.value)}
              />
            </div>
            <div className="notice">
              Your booking will be submitted as Pending until the business admin reviews it.
            </div>
          </div>
        )}

        <div className="btnrow">
          <button
            className="btn secondary"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          >
            Back
          </button>
          <button
            className="btn"
            style={{ flex: 1 }}
            onClick={currentStep === 3 ? submitBooking : handleNextStep}
          >
            {currentStep === 3 ? "Submit appointment" : "Continue"}
          </button>
        </div>
      </>
    );
  };

  const renderCustomerBody = (isMobWeb = false) => {
    if (customerPage === "home") return renderCustomerHome(isMobWeb);
    if (customerPage === "book") return renderBookingWizard();
    if (customerPage === "bookings") {
      return (
        <>
          <div className="section-head">
            <strong>My appointments</strong>
            <span className="tag-text">{bookings.length} total</span>
          </div>
          {!bookings.length ? (
            <div className="card empty">
              <SvgIcon name="calendar" size={32} />
              <p>No appointments yet.</p>
              <button className="btn" onClick={() => setCustomerPage("home")}>
                Explore services
              </button>
            </div>
          ) : (
            bookings.map((b) => (
              <div className="card" key={b.id}>
                <div className="panelhead">
                  <b>{b.business}</b>
                  <span
                    className={`status-text ${b.status.toLowerCase().replace(/\s+/g, "")}`}
                  >
                    {b.status}
                  </span>
                </div>
                <small className="muted">
                  {b.id} · {b.category}
                </small>
                <p style={{ fontSize: "12px", margin: "10px 0 5px" }}>
                  <b>{b.service}</b> · {b.professional}
                </p>
                <p className="muted" style={{ fontSize: "11px" }}>
                  {b.date} · {b.time}
                </p>
                <div className="btnrow" style={{ marginTop: "8px" }}>
                  <button
                    className="btn ghost"
                    onClick={() => setModalState({ type: "details", booking: b })}
                  >
                    View details
                  </button>
                  {["Pending", "Approved"].includes(b.status) && (
                    <>
                      <button
                        className="btn secondary"
                        onClick={() => {
                          setReschedDate("2026-11-28");
                          setReschedTime("11:30 AM");
                          setModalState({ type: "reschedule", bookingId: b.id });
                        }}
                      >
                        Reschedule
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => {
                          updateBookingStatus(b.id, "Cancelled");
                          showToast("Cancellation request recorded");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      );
    }
    if (customerPage === "notifications") {
      return (
        <>
          <div className="section-head">
            <strong>Notification center</strong>
            <span className="tag-text">Live updates</span>
          </div>
          {bookings.length ? (
            bookings.map((b) => (
              <div className="card" key={b.id}>
                <div
                  className="biz"
                  style={{ margin: 0, border: 0, padding: 0, boxShadow: "none" }}
                >
                  <div className="biz-ico">
                    <SvgIcon name="bell" />
                  </div>
                  <div className="biz-info">
                    <strong>
                      {b.status === "Pending"
                        ? "Booking submitted"
                        : `Booking ${b.status.toLowerCase()}`}
                    </strong>
                    <small>
                      {b.business} · {b.id}
                    </small>
                    <small>
                      {b.date} · {b.time}
                    </small>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">You are all caught up.</div>
          )}
        </>
      );
    }
    if (customerPage === "profile") {
      return (
        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div
            className="biz-ico"
            style={{ margin: "auto", width: "65px", height: "65px" }}
          >
            <SvgIcon name="user" size={30} />
          </div>
          <h3 style={{ marginTop: "12px" }}>{custName}</h3>
          <p className="muted" style={{ marginBottom: "12px" }}>
            {custPhone}
          </p>
          <button className="btn ghost" onClick={() => showToast("Profile details synced")}>
            Edit profile
          </button>
        </div>
      );
    }
    if (customerPage === "confirmation" && bookings[0]) {
      const b = bookings[0];
      return (
        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div
            className="biz-ico"
            style={{
              margin: "auto",
              width: "60px",
              height: "60px",
              background: "#e8f7f0",
              color: "#15966a",
            }}
          >
            <SvgIcon name="check" size={30} />
          </div>
          <h2 style={{ fontSize: "19px", marginTop: "12px" }}>Request submitted</h2>
          <p className="muted">Your appointment request has been sent to the business.</p>
          <div className="notice">
            <b>{b.id}</b>
            <br />
            {b.business}
            <br />
            {b.service} · {b.date} · {b.time}
            <br />
            Status: PENDING
          </div>
          <div className="btnrow" style={{ justifyContent: "center" }}>
            <button className="btn" onClick={() => setCustomerPage("bookings")}>
              View my bookings
            </button>
            <button className="btn ghost" onClick={() => setCustomerPage("home")}>
              Explore more
            </button>
          </div>
        </div>
      );
    }
    return renderCustomerHome(isMobWeb);
  };

  // Customer Mobile App / Mobile Web view
  const renderCustomerMobileView = (isMobWeb: boolean) => (
    <>
      {isMobWeb ? (
        <section className="device" style={{ background: "#1b2430" }}>
          <div className="screen">
            <div className="mweb-bar">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: "#5c6c83",
                  marginBottom: "5px",
                }}
              >
                <span>9:41</span>
                <span>Mobile Browser</span>
              </div>
              <div className="mweb-url">
                <SvgIcon name="lock" size={12} />
                <span style={{ flex: 1, fontWeight: 600 }}>https://app4app.in</span>
                <SvgIcon name="globe" size={13} />
              </div>
            </div>
            <div className="mobile-head">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={LOGO_SRC}
                  alt="App4App"
                  style={{
                    width: "28px",
                    height: "28px",
                    objectFit: "contain",
                    borderRadius: "7px",
                    border: "1px solid #dce6f4",
                  }}
                />
                <div>
                  <div className="greet">App4App Web</div>
                  <strong>Explore services</strong>
                </div>
              </div>
              <button
                className="iconbutton"
                onClick={() => setCustomerPage("notifications")}
              >
                <SvgIcon name="bell" />
                {bookings.length > 0 && (
                  <span className="badge-count">{bookings.length}</span>
                )}
              </button>
            </div>
            <div className="mweb-tabs">
              {(
                [
                  ["home", "Explore"],
                  ["bookings", `Bookings (${bookings.length})`],
                  ["notifications", "Alerts"],
                  ["profile", "Account"],
                ] as [CustomerPage, string][]
              ).map(([id, lb]) => (
                <button
                  key={id}
                  className={
                    customerPage === id ||
                    (id === "home" && ["book", "confirmation"].includes(customerPage))
                      ? "active"
                      : ""
                  }
                  onClick={() => setCustomerPage(id)}
                >
                  {lb}
                </button>
              ))}
            </div>
            <div className="mobile-content">{renderCustomerBody(true)}</div>
            <div
              style={{
                height: "44px",
                background: "#fff",
                borderTop: "1px solid #e8edf5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 16px",
                fontSize: "10px",
                color: "var(--muted)",
              }}
            >
              <span>app4app.in · Mobile Web</span>
              <button
                style={{
                  background: "transparent",
                  color: "var(--blue)",
                  fontWeight: 750,
                }}
                onClick={() => setCustomerPage("home")}
              >
                Home
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="device">
          <div className="screen">
            <div className="status">
              <span>9:41</span>
              <span>5G · 100%</span>
            </div>
            <div className="mobile-head">
              <div>
                <div className="greet">Welcome back</div>
                <strong>Explore services</strong>
              </div>
              <button
                className="iconbutton"
                onClick={() => setCustomerPage("notifications")}
              >
                <SvgIcon name="bell" />
                {bookings.length > 0 && (
                  <span className="badge-count">{bookings.length}</span>
                )}
              </button>
            </div>
            <div className="mobile-content">{renderCustomerBody(false)}</div>
            <nav className="mobile-nav">
              {(
                [
                  ["home", "Home"],
                  ["bookings", "Bookings"],
                  ["notifications", "Alerts"],
                  ["profile", "Profile"],
                ] as [CustomerPage, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  className={customerPage === id ? "active" : ""}
                  onClick={() => setCustomerPage(id)}
                >
                  <SvgIcon
                    name={
                      id === "notifications"
                        ? "bell"
                        : id === "bookings"
                        ? "calendar"
                        : id === "profile"
                        ? "user"
                        : "home"
                    }
                    size={18}
                  />
                  <span>
                    {label}
                    {id === "notifications" && bookings.length > 0
                      ? ` (${bookings.length})`
                      : ""}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </section>
      )}

      <aside className="desktop">
        <div className="deskbar">
          <div>
            <strong>
              {isMobWeb ? "Customer mobile website journey" : "Customer mobile app journey"}
            </strong>
            <br />
            <small>
              {isMobWeb ? "Browser booking at app4app.in" : "Mobile-first native experience"}
            </small>
          </div>
          <span className="tag-text">
            {isMobWeb ? "Mobile Web · Live sync" : "Android App · Live sync"}
          </span>
        </div>
        <div
          style={{
            padding: "24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          <div className="panel">
            <div className="panelhead">
              <strong>Booking journey</strong>
              <SvgIcon name={isMobWeb ? "globe" : "smartphone"} />
            </div>
            {[
              "Select category & city",
              "Choose a verified business, beauty parlour, VIP or celebrity desk",
              "Select service & professional",
              "Choose date and available slot",
              "Submit request & track status",
            ].map((x, i) => (
              <div
                key={x}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #eef2f7",
                }}
              >
                <span className="metric-icon">{i + 1}</span>
                <span style={{ fontSize: "11px", fontWeight: 650 }}>{x}</span>
              </div>
            ))}
          </div>
          <div className="panel">
            <div className="panelhead">
              <strong>Connected live state</strong>
              <SvgIcon name="shield" />
            </div>
            <h2 className="tabular-nums" style={{ fontSize: "32px", margin: "8px 0" }}>
              {bookings.length}
            </h2>
            <small className="muted">
              Appointments created across Customer App & Websites
            </small>
            <div className="notice">
              New businesses verified & confirmed by Super Admin appear here immediately.
            </div>
            <button className="btn" onClick={() => setCustomerPage("home")}>
              Start customer journey
            </button>
          </div>
          <div className="panel" style={{ gridColumn: "1/-1" }}>
            <div className="panelhead">
              <strong>Supported service domains</strong>
              <span className="muted" style={{ fontSize: "11px" }}>
                Click any domain to filter
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
              }}
            >
              {categories.map((c) => (
                <button
                  key={c.name}
                  className={`cat ${category === c.name ? "active" : ""}`}
                  style={{ minHeight: "104px", padding: "10px" }}
                  aria-label={c.name}
                  onClick={() => {
                    setCategory(c.name);
                    setCustomerPage("home");
                  }}
                >
                  <CategoryImage
                    iconKey={c.icon}
                    alt={c.name}
                    height={c.sub ? 56 : 66}
                  />
                  {c.sub && <small style={{ fontSize: "9px" }}>{c.sub}</small>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  // Customer Desktop Website
  const renderCustomerDesktopWebView = () => (
    <MonitorFrame>
      <section className="desktop">
        <div className="browser-bar">
          <span>🔒 https://app4app.in · Customer Booking Website</span>
          <span className="tag-text">Public Customer Web</span>
        </div>
        <div className="deskbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={LOGO_SRC}
              alt="App4App"
              style={{
                width: "36px",
                height: "36px",
                objectFit: "contain",
                borderRadius: "9px",
                border: "1px solid #dce6f4",
              }}
            />
            <div>
              <strong>App4App Customer Website</strong>
              <br />
              <small>Book hospitals, beauty parlours, VIPs & celebrity desks online</small>
            </div>
          </div>
          <div className="btnrow">
            {(
              [
                ["home", "Explore Services"],
                ["bookings", `My Bookings (${bookings.length})`],
                ["notifications", "Alerts"],
                ["profile", "Account"],
              ] as [CustomerPage, string][]
            ).map(([id, lb]) => (
              <button
                key={id}
                className={`btn ${
                  customerPage === id ||
                  (id === "home" && ["book", "confirmation"].includes(customerPage))
                    ? ""
                    : "ghost"
                }`}
                onClick={() => setCustomerPage(id)}
              >
                {lb}
              </button>
            ))}
          </div>
        </div>
        <div className="deskmain">
          {customerPage === "home" ? (
            <>
              <div
                className="hero"
                style={{
                  padding: "26px",
                  background: "linear-gradient(110deg, #10284f, #123e8f, #1972e7)",
                }}
              >
                <small>CUSTOMER WEB PORTAL · APP4APP.IN</small>
                <h2 style={{ fontSize: "26px" }}>
                  Book trusted appointments from any desktop browser.
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    background: "#fff",
                    padding: "10px",
                    borderRadius: "14px",
                    marginTop: "14px",
                    maxWidth: "680px",
                  }}
                >
                  <input
                    style={{
                      flex: 1,
                      border: "1px solid #dfe7f2",
                      borderRadius: "9px",
                      padding: "9px",
                      color: "var(--ink)",
                    }}
                    value={query}
                    placeholder="Search service, salon, VIP, actor..."
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <select
                    style={{
                      border: "1px solid #dfe7f2",
                      borderRadius: "9px",
                      padding: "9px",
                      color: "var(--ink)",
                    }}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="All Cities">All Cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="section-head">
                <strong>Browse categories</strong>
                <button
                  onClick={() => {
                    setCategory("All");
                    setCity("All Cities");
                    setQuery("");
                  }}
                >
                  Reset filters
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <button
                  className={`cat ${category === "All" ? "active" : ""}`}
                  style={{ minHeight: "102px", padding: "10px" }}
                  aria-label="All categories"
                  onClick={() => setCategory("All")}
                >
                  <CategoryImage iconKey="all" alt="All" height={54} />
                  <small style={{ fontSize: "9px" }}>All Services</small>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.name}
                    className={`cat ${category === c.name ? "active" : ""}`}
                    style={{ minHeight: "102px", padding: "10px" }}
                    aria-label={c.name}
                    onClick={() => setCategory(c.name)}
                  >
                    <CategoryImage
                      iconKey={c.icon}
                      alt={c.name}
                      height={c.sub ? 54 : 66}
                    />
                    {c.sub && <small style={{ fontSize: "9px" }}>{c.sub}</small>}
                  </button>
                ))}
              </div>
              <div className="section-head">
                <strong>
                  {category === "All"
                    ? "Verified businesses & desks"
                    : `${category} directory`}
                </strong>
                <span className="muted">{filteredBusinesses.length} available</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "14px",
                }}
              >
                {filteredBusinesses.map((b) => (
                  <div
                    key={b.id}
                    className="card"
                    style={{
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <div
                          className="biz-ico"
                          style={{ width: "54px", height: "54px", flex: "0 0 54px" }}
                        >
                          <CategoryImage iconKey={b.icon} alt={b.category} />
                        </div>
                        <div>
                          <b style={{ fontSize: "13px" }}>{b.name}</b>
                          <small style={{ display: "block", color: "var(--muted)" }}>
                            {b.category}
                            {b.tag ? ` · ${b.tag}` : ""}
                          </small>
                          <small style={{ display: "block", color: "var(--muted)" }}>
                            {b.address}
                          </small>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #eef2f7",
                        paddingTop: "10px",
                        marginTop: "12px",
                      }}
                    >
                      <span style={{ fontSize: "11px" }}>
                        ★ {b.rating} · <b>₹{b.price.toLocaleString("en-IN")}</b>
                      </span>
                      <button className="biz-action" onClick={() => startBooking(b)}>
                        Book appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ maxWidth: "740px", margin: "auto" }}>
              {renderCustomerBody(false)}
            </div>
          )}
        </div>
      </section>
    </MonitorFrame>
  );

  // Reusable Metrics + Sidebar + Tables
  const renderStats = (items: [string, string | number, string, string][]) => (
    <div className="metrics">
      {items.map(([label, val, sub, ic]) => (
        <div className="metric" key={label}>
          <div className="metric-top">
            {label}
            <span className="metric-icon">
              <SvgIcon name={ic} size={17} />
            </span>
          </div>
          <strong className="tabular-nums">{val}</strong>
          <small>{sub}</small>
        </div>
      ))}
    </div>
  );

  const renderSidebar = (
    kind: "sales" | "business" | "super",
    menu: [string, string][],
    active: string,
    brandTitle = "App4App",
    sub = "PORTAL"
  ) => (
    <aside className="sidebar">
      <div className="sidebrand">
        <div className="app4app-sidebar-logo">
          <img className="app4app-logo" src={LOGO_SRC} alt="App4App logo" />
        </div>
        <div>
          <strong>{brandTitle}</strong>
          <small>{sub}</small>
        </div>
      </div>
      <div className="navlabel">WORKSPACE</div>
      {menu.map(([n, ic]) => (
        <button
          key={n}
          className={`sidelink ${active === n ? "active" : ""}`}
          onClick={() => {
            if (kind === "sales") setSalesPage(n);
            else if (kind === "business") setBizPage(n);
            else setSuperPage(n);
          }}
        >
          <SvgIcon name={ic} />
          {n}
        </button>
      ))}
      <div className="navlabel">ACCOUNT</div>
      <button
        className="sidelink"
        onClick={() => {
          if (kind === "sales") {
            setLoggedSalesId(null);
            showToast("Signed out from Sales Portal");
          } else if (kind === "business") {
            setLoggedBizLoginId(null);
            showToast("Signed out from Business Admin");
          } else {
            setRole("customer-app");
          }
        }}
      >
        <SvgIcon name="logout" />
        {kind === "super" ? "Exit admin preview" : "Sign out"}
      </button>
    </aside>
  );

  const renderBookingsTable = (list: BookingItem[], admin = false) => {
    if (!list.length) {
      return (
        <div className="empty">
          No appointments yet. Create one from the Customer App or Website.
        </div>
      );
    }
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Customer</th>
            <th>Service / Business</th>
            <th>Date & time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((b) => (
            <tr key={b.id}>
              <td>
                <b>{b.id}</b>
              </td>
              <td>
                {b.customer}
                <br />
                <small>{b.phone}</small>
              </td>
              <td>
                {admin ? b.service : b.business}
                <br />
                <small>{admin ? b.business : b.category}</small>
              </td>
              <td className="tabular-nums">
                {b.date}
                <br />
                {b.time}
              </td>
              <td>
                <span
                  className={`status-text ${b.status.toLowerCase().replace(/\s+/g, "")}`}
                >
                  {b.status}
                </span>
              </td>
              <td>
                {b.status === "Pending" ? (
                  <>
                    <button
                      className="mini ok"
                      onClick={() => updateBookingStatus(b.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="mini no"
                      onClick={() => updateBookingStatus(b.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : b.status === "Reschedule Requested" ? (
                  <>
                    <button
                      className="mini ok"
                      onClick={() => approveReschedule(b.id)}
                    >
                      Accept new time
                    </button>
                    <button
                      className="mini"
                      onClick={() => updateBookingStatus(b.id, "Approved")}
                    >
                      Keep current
                    </button>
                  </>
                ) : (
                  <button
                    className="mini"
                    onClick={() => setModalState({ type: "details", booking: b })}
                  >
                    Details
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Sales View
  const handleLoginSales = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = salesPersons.find(
      (x) => x.loginId === spLoginId.trim() && x.password === spPass
    );
    if (!sp) {
      showToast("Invalid Sales Login ID or Password (must be verified by Super Admin)");
      return;
    }
    if (sp.status !== "Verified") {
      showToast("Account pending Super Admin verification");
      return;
    }
    setLoggedSalesId(sp.id);
    setWdDest(sp.bankOrUpi);
    showToast(`Signed in as ${sp.name}`);
  };

  const handleRegisterSales = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !regSpName.trim() ||
      !regSpPhone.trim() ||
      !regSpEmail.trim() ||
      !regSpId.trim() ||
      !regSpUpi.trim()
    ) {
      showToast("Complete all sales verification details");
      return;
    }
    const newSp: SalesPerson = {
      id: "sp" + Date.now(),
      name: regSpName.trim(),
      phone: regSpPhone.trim(),
      email: regSpEmail.trim(),
      city: regSpCity,
      idProof: regSpId.trim(),
      bankOrUpi: regSpUpi.trim(),
      status: "Pending Verification",
      loginId: "",
      password: "",
      wallet: 0,
      earned: 0,
      withdrawn: 0,
      created: "2026-11-25",
    };
    setSalesPersons((prev) => [newSp, ...prev]);
    setRegSpName("");
    setRegSpPhone("");
    setRegSpEmail("");
    setRegSpId("");
    setRegSpUpi("");
    setSalesAuthTab("login");
    showToast("Sales person details submitted to Super Admin for verification");
  };

  const handleSubmitBusinessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = salesPersons.find((x) => x.id === loggedSalesId);
    if (!sp) return;
    if (
      !ordBizName.trim() ||
      !ordBizAddr.trim() ||
      !ordOwner.trim() ||
      !ordPhone.trim()
    ) {
      showToast("Enter business name, address, owner name, and phone");
      return;
    }
    const plan = plans.find((p) => p.name === ordPlan) || plans[0];
    const id = "ORD-" + (500 + businessOrders.length + 1);
    const newOrder: BusinessOrder = {
      id,
      spId: sp.id,
      spName: sp.name,
      bizName: ordBizName.trim(),
      category: ordBizCat,
      tag: ordBizTag.trim(),
      city: ordBizCity,
      address: ordBizAddr.trim(),
      owner: ordOwner.trim(),
      phone: ordPhone.trim(),
      email: ordEmail.trim() || "owner@business.in",
      services: ordServices.trim() || "Consultation, Priority Slot",
      staff: ordStaff.trim() || ordOwner.trim(),
      plan: plan.name,
      amount: plan.amount,
      commission: plan.commission,
      verifyStatus: "Pending Verification",
      paymentStatus: "Unpaid",
      credited: false,
      loginIssued: false,
      loginId: "",
      bizId: "",
      date: "2026-11-25",
    };
    setBusinessOrders((prev) => [newOrder, ...prev]);
    setOrdBizName("");
    setOrdBizTag("");
    setOrdBizAddr("");
    setOrdOwner("");
    setOrdPhone("");
    setOrdEmail("");
    setOrdServices("");
    setOrdStaff("");
    setSalesPage("My Business Orders");
    showToast(`Business order ${id} sent to Super Admin for verification`);
  };

  const handleWithdrawWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = salesPersons.find((x) => x.id === loggedSalesId);
    if (!sp) return;
    const amt = Number(wdAmount);
    const dest = wdDest.trim() || sp.bankOrUpi;
    if (!amt || amt <= 0) {
      showToast("Enter a valid amount");
      return;
    }
    if (amt > sp.wallet) {
      showToast("Exceeds available wallet balance");
      return;
    }
    setSalesPersons((prev) =>
      prev.map((x) =>
        x.id === sp.id
          ? { ...x, wallet: x.wallet - amt, withdrawn: x.withdrawn + amt }
          : x
      )
    );
    setWalletTxns((prev) => [
      {
        id: "WTX-" + (1001 + prev.length),
        spId: sp.id,
        type: "Withdrawal",
        amount: amt,
        desc: `Wallet withdrawal to ${dest}`,
        method: wdMethod,
        date: "2026-11-25",
      },
      ...prev,
    ]);
    setWdAmount("");
    showToast(`₹${amt.toLocaleString("en-IN")} withdrawn via ${wdMethod}`);
  };

  const renderSalesView = () => {
    const sp = salesPersons.find((x) => x.id === loggedSalesId);
    if (!sp) {
      const verified = salesPersons.filter((x) => x.status === "Verified");
      return (
        <MonitorFrame>
          <section className="desktop">
            <div className="browser-bar">
              <span>🔒 https://admin.app4app.in/sales · Admin & Sales Website</span>
              <span className="tag-text">Sales Person Portal</span>
            </div>
            <div className="auth-split">
              <div className="auth-side">
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="app4app-sidebar-logo">
                      <img className="app4app-logo" src={LOGO_SRC} alt="App4App" />
                    </div>
                    <div>
                      <strong style={{ color: "#fff" }}>App4App Sales</strong>
                      <small style={{ display: "block", color: "#a9bddc" }}>
                        PARTNER WEBSITE
                      </small>
                    </div>
                  </div>
                  <h2 style={{ color: "#fff", fontSize: "21px", lineHeight: 1.35 }}>
                    Onboard businesses, track approvals & withdraw wallet commissions.
                  </h2>
                  <p style={{ color: "#b9cbe4", fontSize: "12px", lineHeight: 1.6 }}>
                    1. Register details & receive verified login from Super Admin.
                    <br />
                    2. Enter full business order details.
                    <br />
                    3. Receive wallet commission once full payment is confirmed & withdraw
                    anytime.
                  </p>
                </div>
                <div style={{ fontSize: "11px", color: "#b9cbe4" }}>
                  Verified logins: {verified.length} · Pending KYC:{" "}
                  {salesPersons.filter((x) => x.status === "Pending Verification").length}
                </div>
              </div>
              <div className="auth-main">
                <div className="auth-card">
                  <div className="switch" style={{ marginBottom: "16px" }}>
                    <button
                      type="button"
                      style={{ flex: 1, justifyContent: "center" }}
                      className={salesAuthTab === "login" ? "active" : ""}
                      onClick={() => setSalesAuthTab("login")}
                    >
                      Sales Person Login
                    </button>
                    <button
                      type="button"
                      style={{ flex: 1, justifyContent: "center" }}
                      className={salesAuthTab === "register" ? "active" : ""}
                      onClick={() => setSalesAuthTab("register")}
                    >
                      Apply for Verification
                    </button>
                  </div>

                  {salesAuthTab === "login" ? (
                    <form onSubmit={handleLoginSales}>
                      <h3 style={{ marginBottom: "4px" }}>Sign in to Sales Portal</h3>
                      <p className="muted" style={{ marginTop: 0 }}>
                        Use Login ID & Password issued by Super Admin.
                      </p>
                      <div className="field">
                        <label>Sales Login ID</label>
                        <input
                          value={spLoginId}
                          onChange={(e) => setSpLoginId(e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label>Password</label>
                        <input
                          type="password"
                          value={spPass}
                          onChange={(e) => setSpPass(e.target.value)}
                        />
                      </div>
                      <button className="btn" style={{ width: "100%" }} type="submit">
                        Login to Sales Workspace
                      </button>
                      <div className="notice" style={{ marginTop: "14px" }}>
                        <b>Verified Logins:</b>
                        <br />
                        {verified.map((v) => (
                          <div
                            key={v.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginTop: "6px",
                            }}
                          >
                            <span>
                              {v.name} (<b>{v.loginId}</b> / {v.password})
                            </span>
                            <button
                              type="button"
                              className="mini"
                              onClick={() => {
                                setSpLoginId(v.loginId);
                                setSpPass(v.password);
                              }}
                            >
                              Fill
                            </button>
                          </div>
                        ))}
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleRegisterSales}>
                      <h3 style={{ marginBottom: "4px" }}>Sales Person Registration</h3>
                      <p className="muted" style={{ marginTop: 0 }}>
                        Super Admin verifies KYC and issues login credentials.
                      </p>
                      <div className="grid2">
                        <div className="field">
                          <label>Full Name</label>
                          <input
                            value={regSpName}
                            onChange={(e) => setRegSpName(e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label>Phone</label>
                          <input
                            value={regSpPhone}
                            onChange={(e) => setRegSpPhone(e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label>Email</label>
                          <input
                            value={regSpEmail}
                            onChange={(e) => setRegSpEmail(e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label>City</label>
                          <select
                            value={regSpCity}
                            onChange={(e) => setRegSpCity(e.target.value)}
                          >
                            {cities.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="field">
                          <label>PAN / ID Proof</label>
                          <input
                            value={regSpId}
                            onChange={(e) => setRegSpId(e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label>Bank / UPI ID</label>
                          <input
                            value={regSpUpi}
                            onChange={(e) => setRegSpUpi(e.target.value)}
                          />
                        </div>
                      </div>
                      <button className="btn" style={{ width: "100%" }} type="submit">
                        Submit to Super Admin
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        </MonitorFrame>
      );
    }

    const myOrders = businessOrders.filter((o) => o.spId === sp.id);
    const myTxns = walletTxns.filter((t) => t.spId === sp.id);
    const sMenu: [string, string][] = [
      ["Overview", "chart"],
      ["New Business Order", "plus"],
      ["My Business Orders", "fileCheck"],
      ["Wallet & Withdrawals", "wallet"],
    ];

    return (
      <MonitorFrame>
        <section className="desktop">
          <div className="deskbar">
            <div>
              <strong>Sales Person Website</strong>
              <br />
              <small>
                https://admin.app4app.in/sales · {sp.name} ({sp.loginId})
              </small>
            </div>
            <div className="topright">
              <button
                className="mini ok"
                onClick={() => setSalesPage("Wallet & Withdrawals")}
              >
                Wallet: ₹{sp.wallet.toLocaleString("en-IN")}
              </button>
            </div>
          </div>
          <div className="desk-layout">
            {renderSidebar("sales", sMenu, salesPage, "App4App", "SALES PORTAL")}
            <div className="deskmain">
              <div className="deskheading">
                <div>
                  <h2>{salesPage}</h2>
                  <p>
                    Submit business orders and withdraw commissions once full payment is
                    received.
                  </p>
                </div>
              </div>

              {salesPage === "Overview" && (
                <>
                  {renderStats([
                    ["Business orders", myOrders.length, "Submitted", "fileCheck"],
                    [
                      "Paid & confirmed",
                      myOrders.filter((o) => o.credited).length,
                      "Commission unlocked",
                      "check",
                    ],
                    [
                      "Wallet balance",
                      `₹${sp.wallet.toLocaleString("en-IN")}`,
                      "Available to withdraw",
                      "wallet",
                    ],
                    [
                      "Total withdrawn",
                      `₹${sp.withdrawn.toLocaleString("en-IN")}`,
                      `Earned ₹${sp.earned.toLocaleString("en-IN")}`,
                      "chart",
                    ],
                  ])}
                  <div className="panel">
                    <div className="panelhead">
                      <strong>Recent business orders</strong>
                      <button
                        className="btn"
                        onClick={() => setSalesPage("New Business Order")}
                      >
                        + New Business Order
                      </button>
                    </div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Business</th>
                          <th>Amount / Comm.</th>
                          <th>Verification</th>
                          <th>Payment & Wallet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myOrders.map((o) => (
                          <tr key={o.id}>
                            <td>
                              <b>{o.id}</b>
                            </td>
                            <td>
                              <b>{o.bizName}</b>
                              <br />
                              <small>
                                {o.category} · {o.city}
                              </small>
                            </td>
                            <td className="tabular-nums">
                              ₹{o.amount.toLocaleString("en-IN")}
                              <br />
                              <small style={{ color: "#1763d5" }}>
                                Comm ₹{o.commission.toLocaleString("en-IN")}
                              </small>
                            </td>
                            <td>
                              <span
                                className={`status-text ${
                                  o.verifyStatus === "Verified & Confirmed"
                                    ? "approved"
                                    : ""
                                }`}
                              >
                                {o.verifyStatus}
                              </span>
                            </td>
                            <td>
                              {o.credited ? (
                                <span className="status-text approved">
                                  Paid · Credited to wallet
                                </span>
                              ) : (
                                o.paymentStatus
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {salesPage === "New Business Order" && (
                <form className="panel" onSubmit={handleSubmitBusinessOrder}>
                  <div className="panelhead">
                    <strong>Enter Full Business Order Details</strong>
                  </div>
                  <div className="grid2">
                    <div className="field">
                      <label>Business Name *</label>
                      <input
                        placeholder="Business Name"
                        value={ordBizName}
                        onChange={(e) => setOrdBizName(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Category *</label>
                      <select
                        value={ordBizCat}
                        onChange={(e) => setOrdBizCat(e.target.value)}
                      >
                        {categories.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Specialty / Tag</label>
                      <input
                        placeholder="e.g. Bridal, Top Business Persons"
                        value={ordBizTag}
                        onChange={(e) => setOrdBizTag(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>City *</label>
                      <select
                        value={ordBizCity}
                        onChange={(e) => setOrdBizCity(e.target.value)}
                      >
                        {cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Full Address *</label>
                      <input
                        placeholder="Address"
                        value={ordBizAddr}
                        onChange={(e) => setOrdBizAddr(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Owner Name *</label>
                      <input
                        placeholder="Owner full name"
                        value={ordOwner}
                        onChange={(e) => setOrdOwner(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Owner Phone *</label>
                      <input
                        placeholder="Mobile"
                        value={ordPhone}
                        onChange={(e) => setOrdPhone(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Owner Email</label>
                      <input
                        placeholder="owner@business.com"
                        value={ordEmail}
                        onChange={(e) => setOrdEmail(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Services Offered</label>
                      <input
                        placeholder="Comma separated services"
                        value={ordServices}
                        onChange={(e) => setOrdServices(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Staff / Professionals</label>
                      <input
                        placeholder="Comma separated names"
                        value={ordStaff}
                        onChange={(e) => setOrdStaff(e.target.value)}
                      />
                    </div>
                    <div className="field" style={{ gridColumn: "1/-1" }}>
                      <label>Package Plan</label>
                      <select
                        value={ordPlan}
                        onChange={(e) => setOrdPlan(e.target.value)}
                      >
                        {plans.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name} · ₹{p.amount.toLocaleString("en-IN")} (Commission ₹
                            {p.commission.toLocaleString("en-IN")})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button className="btn" type="submit">
                    Submit Business Order to Super Admin
                  </button>
                </form>
              )}

              {salesPage === "My Business Orders" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>My Business Orders ({myOrders.length})</strong>
                    <button
                      className="btn"
                      onClick={() => setSalesPage("New Business Order")}
                    >
                      + New Order
                    </button>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Business & Owner</th>
                        <th>Amount</th>
                        <th>Verification</th>
                        <th>Payment</th>
                        <th>Business Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myOrders.map((o) => (
                        <tr key={o.id}>
                          <td>
                            <b>{o.id}</b>
                          </td>
                          <td>
                            <b>{o.bizName}</b>
                            <br />
                            <small>
                              {o.owner} · {o.phone}
                            </small>
                          </td>
                          <td className="tabular-nums">
                            ₹{o.amount.toLocaleString("en-IN")}
                            <br />
                            <small>Wallet +₹{o.commission.toLocaleString("en-IN")}</small>
                          </td>
                          <td>
                            <span
                              className={`status-text ${
                                o.verifyStatus === "Verified & Confirmed"
                                  ? "approved"
                                  : ""
                              }`}
                            >
                              {o.verifyStatus}
                            </span>
                          </td>
                          <td>{o.paymentStatus}</td>
                          <td>
                            {o.loginIssued ? (
                              <b style={{ color: "#16805b" }}>{o.loginId}</b>
                            ) : (
                              "Pending"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {salesPage === "Wallet & Withdrawals" && (
                <div className="grid2">
                  <form className="panel" onSubmit={handleWithdrawWallet}>
                    <strong>Sales Wallet & Withdraw</strong>
                    <div
                      style={{
                        background: "#10284f",
                        color: "#fff",
                        padding: "18px",
                        borderRadius: "14px",
                        margin: "12px 0",
                      }}
                    >
                      <small style={{ color: "#a9bddc" }}>
                        AVAILABLE WALLET BALANCE
                      </small>
                      <strong
                        className="tabular-nums"
                        style={{ display: "block", fontSize: "28px", marginTop: "4px" }}
                      >
                        ₹{sp.wallet.toLocaleString("en-IN")}
                      </strong>
                      <small style={{ color: "#c6d5eb" }}>
                        Earned ₹{sp.earned.toLocaleString("en-IN")} · Withdrawn ₹
                        {sp.withdrawn.toLocaleString("en-IN")}
                      </small>
                    </div>
                    <div className="field">
                      <label>Withdraw Amount (₹)</label>
                      <input
                        type="number"
                        min={1}
                        max={sp.wallet}
                        placeholder={`Up to ₹${sp.wallet}`}
                        value={wdAmount}
                        onChange={(e) => setWdAmount(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Method</label>
                      <select
                        value={wdMethod}
                        onChange={(e) => setWdMethod(e.target.value)}
                      >
                        <option>UPI Instant Transfer</option>
                        <option>Bank IMPS / NEFT</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>UPI / Bank</label>
                      <input
                        value={wdDest || sp.bankOrUpi}
                        onChange={(e) => setWdDest(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn"
                      style={{ width: "100%", background: "#15966a" }}
                      type="submit"
                      disabled={sp.wallet <= 0}
                    >
                      Withdraw from Wallet
                    </button>
                  </form>
                  <div className="panel">
                    <strong>Wallet Transactions</strong>
                    {myTxns.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom: "1px solid #eef2f7",
                          fontSize: "11px",
                        }}
                      >
                        <div>
                          <b>{t.desc}</b>
                          <br />
                          <small className="muted">
                            {t.id} · {t.method} · {t.date}
                          </small>
                        </div>
                        <b
                          className="tabular-nums"
                          style={{
                            color:
                              t.type === "Commission Credit" ? "#15966a" : "#bd4250",
                          }}
                        >
                          {t.type === "Commission Credit" ? "+" : "-"}₹
                          {t.amount.toLocaleString("en-IN")}
                        </b>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </MonitorFrame>
    );
  };

  // Business Admin View
  const handleLoginBiz = (e: React.FormEvent) => {
    e.preventDefault();
    const cred = bizCredentials.find(
      (c) => c.loginId === bzLoginId.trim() && c.password === bzPass
    );
    if (!cred) {
      showToast("Invalid Business Login ID or Password");
      return;
    }
    setLoggedBizLoginId(cred.loginId);
    setChgCurPwd(cred.password);
    setChgNewPwd("");
    setChgConfPwd("");
    showToast(
      cred.mustChange
        ? "First login detected — please change your temporary password"
        : `Welcome to ${cred.bizName}`
    );
  };

  const handleChangeBizPwd = (e: React.FormEvent) => {
    e.preventDefault();
    const cred = bizCredentials.find((c) => c.loginId === loggedBizLoginId);
    if (!cred) return;
    if (chgCurPwd !== cred.password) {
      showToast("Current password is incorrect");
      return;
    }
    if (!chgNewPwd || chgNewPwd.length < 6) {
      showToast("New password must be at least 6 characters");
      return;
    }
    if (chgNewPwd !== chgConfPwd) {
      showToast("Passwords do not match");
      return;
    }
    setBizCredentials((prev) =>
      prev.map((c) =>
        c.loginId === cred.loginId
          ? { ...c, password: chgNewPwd, mustChange: false }
          : c
      )
    );
    setChgCurPwd("");
    setChgNewPwd("");
    setChgConfPwd("");
    showToast("Password changed successfully");
  };

  const renderSimpleTable = (head: string[], rows: React.ReactNode[][]) => (
    <table className="table">
      <thead>
        <tr>
          {head.map((x) => (
            <th key={x}>{x}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri}>
            {r.map((cell, ci) => (
              <td key={ci}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderBusinessView = () => {
    const cred = bizCredentials.find((c) => c.loginId === loggedBizLoginId);
    if (!cred) {
      return (
        <MonitorFrame>
          <section className="desktop">
            <div className="browser-bar">
              <span>🔒 https://admin.app4app.in/business · Admin Website</span>
              <span className="tag-text">Business Person Login</span>
            </div>
            <div className="auth-split">
              <div className="auth-side">
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="app4app-sidebar-logo">
                      <img className="app4app-logo" src={LOGO_SRC} alt="App4App" />
                    </div>
                    <div>
                      <strong style={{ color: "#fff" }}>App4App Business</strong>
                      <small style={{ display: "block", color: "#a9bddc" }}>
                        BUSINESS PORTAL
                      </small>
                    </div>
                  </div>
                  <h2 style={{ color: "#fff", fontSize: "21px", lineHeight: 1.35 }}>
                    Sign in with Super Admin credentials & update your password.
                  </h2>
                  <p style={{ color: "#b9cbe4", fontSize: "12px", lineHeight: 1.6 }}>
                    First-time logins require changing your temporary password before
                    opening the dashboard.
                  </p>
                </div>
              </div>
              <div className="auth-main">
                <form className="auth-card" onSubmit={handleLoginBiz}>
                  <h3 style={{ marginBottom: "4px" }}>Business Person Login</h3>
                  <p className="muted" style={{ marginTop: 0 }}>
                    Enter Login ID & password issued by Super Admin.
                  </p>
                  <div className="field">
                    <label>Business Login ID</label>
                    <input
                      value={bzLoginId}
                      onChange={(e) => setBzLoginId(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <input
                      type="password"
                      value={bzPass}
                      onChange={(e) => setBzPass(e.target.value)}
                    />
                  </div>
                  <button className="btn" style={{ width: "100%" }} type="submit">
                    Login to Business Admin
                  </button>
                  <div className="notice" style={{ marginTop: "14px" }}>
                    <b>Issued Logins:</b>
                    <br />
                    {bizCredentials.map((c) => (
                      <div
                        key={c.loginId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "6px",
                        }}
                      >
                        <span>
                          {c.bizName} (<b>{c.loginId}</b> / {c.password})
                        </span>
                        <button
                          type="button"
                          className="mini"
                          onClick={() => {
                            setBzLoginId(c.loginId);
                            setBzPass(c.password);
                          }}
                        >
                          Fill
                        </button>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </section>
        </MonitorFrame>
      );
    }

    if (cred.mustChange) {
      return (
        <MonitorFrame>
          <section className="desktop">
            <div className="browser-bar">
              <span>🔒 https://admin.app4app.in/business/change-password</span>
              <button
                className="mini no"
                onClick={() => {
                  setLoggedBizLoginId(null);
                  showToast("Signed out from Business Admin");
                }}
              >
                Sign out
              </button>
            </div>
            <div
              style={{
                minHeight: "740px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f7f9fd",
                padding: "30px",
              }}
            >
              <form className="auth-card" onSubmit={handleChangeBizPwd}>
                <h3 style={{ marginBottom: "4px" }}>Change Your Password</h3>
                <p className="muted" style={{ marginTop: 0 }}>
                  Welcome <b>{cred.owner}</b> ({cred.bizName}). Please change the
                  temporary password issued by Super Admin.
                </p>
                <div className="field">
                  <label>Temporary / Current Password</label>
                  <input
                    type="password"
                    value={chgCurPwd}
                    onChange={(e) => setChgCurPwd(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>New Password (min 6 chars)</label>
                  <input
                    type="password"
                    value={chgNewPwd}
                    onChange={(e) => setChgNewPwd(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={chgConfPwd}
                    onChange={(e) => setChgConfPwd(e.target.value)}
                  />
                </div>
                <button className="btn" style={{ width: "100%" }} type="submit">
                  Update Password & Enter Dashboard
                </button>
              </form>
            </div>
          </section>
        </MonitorFrame>
      );
    }

    const pending = bookings.filter((b) => b.status === "Pending").length;
    const approved = bookings.filter((b) => b.status === "Approved").length;
    const uniquePhones = [...new Set(bookings.map((b) => b.phone))];

    return (
      <MonitorFrame>
        <section className="desktop">
          <div className="deskbar">
            <div>
              <strong>Business Admin Portal</strong>
              <br />
              <small>
                https://admin.app4app.in/business · {cred.bizName} · {cred.city}
              </small>
            </div>
            <div className="topright">
              <button
                className="mini"
                onClick={() => setBizPage("Password & Security")}
              >
                Change Password
              </button>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#52647f" }}>
                {cred.owner}
              </span>
            </div>
          </div>
          <div className="desk-layout">
            {renderSidebar(
              "business",
              businessMenu,
              bizPage,
              cred.bizName,
              "BUSINESS PORTAL"
            )}
            <div className="deskmain">
              <div className="deskheading">
                <div>
                  <h2>{bizPage}</h2>
                  <p>Logged in as {cred.loginId}</p>
                </div>
              </div>

              {bizPage === "Overview" && (
                <>
                  {renderStats([
                    ["Total appointments", bookings.length, "All time", "calendar"],
                    ["Pending requests", pending, "Needs review", "clock"],
                    ["Approved", approved, "Confirmed bookings", "check"],
                    [
                      "Customers",
                      uniquePhones.length,
                      "Unique customers",
                      "users",
                    ],
                  ])}
                  <div className="grid2">
                    <div className="panel">
                      <div className="panelhead">
                        <strong>Recent appointments</strong>
                        <button
                          className="mini"
                          onClick={() => setBizPage("Appointments")}
                        >
                          View all
                        </button>
                      </div>
                      {renderBookingsTable(bookings.slice(0, 4), true)}
                    </div>
                    <div className="panel">
                      <div className="panelhead">
                        <strong>Appointment activity</strong>
                        <span className="tag-text">Weekly view</span>
                      </div>
                      <div className="chart">
                        {[35, 55, 42, 72, 60, 88, 66].map((v, i) => (
                          <div className="barwrap" key={i}>
                            <div className="bar" style={{ height: `${v}%` }} />
                            <small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {bizPage === "Appointments" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>Appointment management</strong>
                    <span className="tag-text">{pending} needs action</span>
                  </div>
                  {renderBookingsTable(bookings, true)}
                </div>
              )}

              {bizPage === "Services" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>Service catalogue</strong>
                  </div>
                  {renderSimpleTable(
                    ["Service", "Category", "Duration", "Price", "Status"],
                    servicesList
                  )}
                </div>
              )}

              {bizPage === "Departments" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>Hospital departments</strong>
                  </div>
                  {renderSimpleTable(
                    ["Department", "Doctors", "Status"],
                    [
                      ["Cardiology", "Dr. Meera", "Active"],
                      ["General Medicine", "Dr. Arjun", "Active"],
                    ]
                  )}
                </div>
              )}

              {bizPage === "Staff & Professionals" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>Staff & professionals</strong>
                  </div>
                  {renderSimpleTable(
                    ["Name", "Role", "Assigned service", "Availability"],
                    [
                      ["Dr. Meera", "Cardiologist", "Cardiology", "Mon–Fri"],
                      ["Divya", "Bridal Specialist", "Beauty Parlour", "Tue–Sun"],
                      [
                        "Raghavendra Rao",
                        "Executive Chairman",
                        "VIPs - Top Business Persons",
                        "By Appointment",
                      ],
                      [
                        "Aravind Karthik",
                        "Actor & Celebrity Liaison",
                        "Celebrities & Well-Known Persons",
                        "By Schedule",
                      ],
                    ]
                  )}
                </div>
              )}

              {bizPage === "Availability" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>Working hours</strong>
                    <button
                      className="btn"
                      onClick={() => showToast("Availability saved")}
                    >
                      Save
                    </button>
                  </div>
                  <div className="grid2">
                    <div className="field">
                      <label>Opening time</label>
                      <input type="time" defaultValue="09:00" />
                    </div>
                    <div className="field">
                      <label>Closing time</label>
                      <input type="time" defaultValue="18:00" />
                    </div>
                  </div>
                </div>
              )}

              {bizPage === "Customers" && (
                <div className="panel">
                  <strong>Customer directory</strong>
                  {renderSimpleTable(
                    ["Customer", "Mobile", "Appointments", "Last booking"],
                    uniquePhones.map((ph) => {
                      const b = bookings.find((x) => x.phone === ph)!;
                      return [
                        b.customer,
                        ph,
                        bookings.filter((x) => x.phone === ph).length,
                        b.date,
                      ];
                    })
                  )}
                </div>
              )}

              {bizPage === "Reports" && (
                <div className="grid2">
                  {renderStats([
                    ["Bookings", bookings.length, "Selected business", "calendar"],
                    [
                      "Approval rate",
                      bookings.length
                        ? `${Math.round((approved / bookings.length) * 100)}%`
                        : "0%",
                      "Approved bookings",
                      "chart",
                    ],
                  ])}
                </div>
              )}

              {bizPage === "Business Profile" && (
                <div className="panel">
                  <strong>Business profile</strong>
                  <div className="grid2">
                    <div className="field">
                      <label>Business name</label>
                      <input value={cred.bizName} readOnly />
                    </div>
                    <div className="field">
                      <label>Category</label>
                      <input value={cred.category} readOnly />
                    </div>
                    <div className="field">
                      <label>City</label>
                      <input value={cred.city} readOnly />
                    </div>
                    <div className="field">
                      <label>Owner</label>
                      <input value={cred.owner} readOnly />
                    </div>
                  </div>
                </div>
              )}

              {bizPage === "Password & Security" && (
                <form
                  className="panel"
                  style={{ maxWidth: "500px" }}
                  onSubmit={handleChangeBizPwd}
                >
                  <strong>Account Password & Security</strong>
                  <p className="muted">
                    Login ID: <b>{cred.loginId}</b>
                  </p>
                  <div className="field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={chgCurPwd}
                      onChange={(e) => setChgCurPwd(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>New Password (min 6 chars)</label>
                    <input
                      type="password"
                      value={chgNewPwd}
                      onChange={(e) => setChgNewPwd(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={chgConfPwd}
                      onChange={(e) => setChgConfPwd(e.target.value)}
                    />
                  </div>
                  <button className="btn" type="submit">
                    Change Password
                  </button>
                </form>
              )}

              {bizPage === "Notifications" && (
                <div className="panel">
                  <strong>Notifications</strong>
                  {bookings.length ? (
                    bookings.map((b) => (
                      <p
                        key={b.id}
                        style={{
                          fontSize: "11px",
                          borderBottom: "1px solid var(--line)",
                          padding: "9px 0",
                        }}
                      >
                        {b.id} · {b.customer} · {b.status}
                      </p>
                    ))
                  ) : (
                    <p className="muted" style={{ marginTop: "8px" }}>
                      No booking notifications yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </MonitorFrame>
    );
  };

  // Super Admin actions
  const verifySales = (id: string, ok: boolean) => {
    const sp = salesPersons.find((x) => x.id === id);
    if (!sp) return;
    if (!ok) {
      setSalesPersons((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "Rejected" } : x))
      );
      showToast("Sales person rejected");
      return;
    }
    const first =
      sp.name
        .toLowerCase()
        .replace(/[^a-z]/g, "")
        .slice(0, 8) || "agent";
    const loginId = `sales.${first}`;
    const password = `Sales@${Math.floor(1000 + ((sp.phone.charCodeAt(0) * 17) % 8999))}`;
    setSalesPersons((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, status: "Verified", loginId, password } : x
      )
    );
    showToast(`Verified ${sp.name} · Login: ${loginId} / ${password}`);
  };

  const verifyOrder = (id: string, ok: boolean) => {
    const o = businessOrders.find((x) => x.id === id);
    if (!o) return;
    if (!ok) {
      setBusinessOrders((prev) =>
        prev.map((x) => (x.id === id ? { ...x, verifyStatus: "Rejected" } : x))
      );
      showToast(`Order ${id} rejected`);
      return;
    }
    const catObj = categories.find((c) => c.name === o.category);
    const newId = "b" + Date.now();
    const newBiz: BusinessItem = {
      id: newId,
      name: o.bizName,
      category: o.category,
      tag: o.tag,
      city: o.city,
      address: o.address,
      rating: "New",
      price: 500,
      icon: catObj?.icon || "briefcase",
      services: o.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      staff: o.staff
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setBusinesses((prev) => [...prev, newBiz]);
    setBusinessOrders((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, verifyStatus: "Verified & Confirmed", bizId: newId }
          : x
      )
    );
    showToast(`${o.bizName} verified, confirmed & live for customers`);
  };

  const confirmFullPay = (id: string) => {
    const o = businessOrders.find((x) => x.id === id);
    if (!o || o.credited) return;
    setBusinessOrders((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, paymentStatus: "Full Payment Received", credited: true }
          : x
      )
    );
    setSalesPersons((prev) =>
      prev.map((sp) =>
        sp.id === o.spId
          ? {
              ...sp,
              wallet: sp.wallet + o.commission,
              earned: sp.earned + o.commission,
            }
          : sp
      )
    );
    setWalletTxns((prev) => [
      {
        id: "WTX-" + (1001 + prev.length),
        spId: o.spId,
        type: "Commission Credit",
        amount: o.commission,
        desc: `Commission for full payment · ${o.bizName} (${o.id})`,
        method: "Company Wallet Credit",
        date: "2026-11-25",
      },
      ...prev,
    ]);
    showToast(
      `Full payment confirmed · ₹${o.commission.toLocaleString("en-IN")} added to ${
        o.spName
      }'s wallet`
    );
  };

  const issueBizLogin = (id: string) => {
    const o = businessOrders.find((x) => x.id === id);
    if (!o || o.loginIssued) return;
    const slug =
      o.bizName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 8) || "partner";
    const loginId = `biz.${slug}`;
    const tempPwd = `Temp@${o.id.replace(/\D/g, "") || "2026"}`;
    setBizCredentials((prev) => [
      {
        bizId: o.bizId || `b-${id}`,
        bizName: o.bizName,
        city: o.city,
        category: o.category,
        owner: o.owner,
        loginId,
        password: tempPwd,
        mustChange: true,
      },
      ...prev,
    ]);
    setBusinessOrders((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, loginIssued: true, loginId } : x
      )
    );
    showToast(`Business login issued: ${loginId} / ${tempPwd}`);
  };

  const toggleBusiness = (id: string) => {
    const b = businesses.find((x) => x.id === id);
    if (!b) return;
    const nextPaused = !b.paused;
    setBusinesses((prev) =>
      prev.map((x) => (x.id === id ? { ...x, paused: nextPaused } : x))
    );
    showToast(nextPaused ? "Paused" : "Activated");
  };

  const renderSuperView = () => {
    const uniquePhones = [...new Set(bookings.map((b) => b.phone))];
    return (
      <MonitorFrame>
        <section className="desktop">
          <div className="deskbar">
            <div>
              <strong>Super Admin Console</strong>
              <br />
              <small>https://admin.app4app.in/super · App4App</small>
            </div>
            <div className="topright">
              <button
                className="mini"
                onClick={() => setSuperPage("Sales Verification")}
              >
                Sales KYC (
                {salesPersons.filter((s) => s.status === "Pending Verification").length})
              </button>
              <button
                className="mini ok"
                onClick={() => setSuperPage("Business Orders")}
              >
                Orders (
                {
                  businessOrders.filter((o) => o.verifyStatus === "Pending Verification")
                    .length
                }{" "}
                new)
              </button>
            </div>
          </div>
          <div className="desk-layout">
            {renderSidebar(
              "super",
              superMenu,
              superPage,
              "App4App",
              "PLATFORM CONTROL"
            )}
            <div className="deskmain">
              <div className="deskheading">
                <div>
                  <h2>{superPage}</h2>
                  <p>
                    Verify sales persons, confirm business orders & full payments, and issue
                    business logins.
                  </p>
                </div>
              </div>

              {superPage === "Overview" && (
                <>
                  {renderStats([
                    [
                      "Businesses",
                      businesses.length,
                      `${bizCredentials.length} logins issued`,
                      "building",
                    ],
                    [
                      "Sales KYC",
                      salesPersons.filter((s) => s.status === "Pending Verification")
                        .length,
                      "Pending verification",
                      "userCheck",
                    ],
                    [
                      "Business orders",
                      businessOrders.length,
                      `${
                        businessOrders.filter(
                          (o) => o.verifyStatus === "Pending Verification"
                        ).length
                      } pending confirm`,
                      "fileCheck",
                    ],
                    ["Appointments", bookings.length, "Platform-wide", "calendar"],
                  ])}
                  <div className="panel">
                    <div className="panelhead">
                      <strong>Business distribution</strong>
                    </div>
                    {categories.map((c) => (
                      <p
                        key={c.name}
                        style={{
                          fontSize: "11px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid #eef2f7",
                          padding: "8px 0",
                          margin: 0,
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "8px",
                              border: "1px solid #e5ebf4",
                              background: "#fff",
                              display: "inline-grid",
                              placeItems: "center",
                              padding: "2px",
                            }}
                          >
                            <CategoryImage iconKey={c.icon} alt={c.name} height={24} />
                          </span>
                          {c.name}
                        </span>
                        <b>{businesses.filter((b) => b.category === c.name).length}</b>
                      </p>
                    ))}
                  </div>
                </>
              )}

              {superPage === "Sales Verification" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>Sales Person Verification & Login Management</strong>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact & City</th>
                        <th>KYC & Payout</th>
                        <th>Status</th>
                        <th>Login</th>
                        <th>Wallet</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesPersons.map((sp) => (
                        <tr key={sp.id}>
                          <td>
                            <b>{sp.name}</b>
                          </td>
                          <td>
                            {sp.phone}
                            <br />
                            <small>{sp.city}</small>
                          </td>
                          <td>
                            {sp.idProof}
                            <br />
                            <small>{sp.bankOrUpi}</small>
                          </td>
                          <td>
                            <span
                              className={`status-text ${
                                sp.status === "Verified" ? "approved" : ""
                              }`}
                            >
                              {sp.status}
                            </span>
                          </td>
                          <td>
                            {sp.loginId ? (
                              <>
                                <b>{sp.loginId}</b>
                                <br />
                                <small>{sp.password}</small>
                              </>
                            ) : (
                              "Not issued"
                            )}
                          </td>
                          <td className="tabular-nums">
                            <b>₹{sp.wallet.toLocaleString("en-IN")}</b>
                          </td>
                          <td>
                            {sp.status === "Pending Verification" ? (
                              <>
                                <button
                                  className="mini ok"
                                  onClick={() => verifySales(sp.id, true)}
                                >
                                  Verify & Give Login
                                </button>
                                <button
                                  className="mini no"
                                  onClick={() => verifySales(sp.id, false)}
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              sp.status
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {superPage === "Business Orders" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>Business Orders, Full Payment & Login Issuance</strong>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Business</th>
                        <th>Owner</th>
                        <th>Amount & Comm.</th>
                        <th>Status</th>
                        <th>Super Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businessOrders.map((o) => {
                        const c = bizCredentials.find((x) => x.loginId === o.loginId);
                        return (
                          <tr key={o.id}>
                            <td>
                              <b>{o.id}</b>
                              <br />
                              <small>{o.spName}</small>
                            </td>
                            <td>
                              <b>{o.bizName}</b>
                              <br />
                              <small>
                                {o.category} · {o.city}
                              </small>
                            </td>
                            <td>
                              {o.owner}
                              <br />
                              <small>{o.phone}</small>
                            </td>
                            <td className="tabular-nums">
                              ₹{o.amount.toLocaleString("en-IN")}
                              <br />
                              <small>Wallet ₹{o.commission.toLocaleString("en-IN")}</small>
                            </td>
                            <td>
                              <b>{o.verifyStatus}</b>
                              <br />
                              <small>{o.paymentStatus}</small>
                              {c && (
                                <>
                                  <br />
                                  <small style={{ color: "#1763d5" }}>
                                    {c.loginId} / {c.password}
                                  </small>
                                </>
                              )}
                            </td>
                            <td>
                              {o.verifyStatus === "Pending Verification" && (
                                <>
                                  <button
                                    className="mini ok"
                                    onClick={() => verifyOrder(o.id, true)}
                                  >
                                    Verify & Confirm
                                  </button>
                                  <button
                                    className="mini no"
                                    onClick={() => verifyOrder(o.id, false)}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {o.verifyStatus === "Verified & Confirmed" &&
                                o.paymentStatus === "Unpaid" && (
                                  <button
                                    className="mini ok"
                                    onClick={() => confirmFullPay(o.id)}
                                  >
                                    Confirm Full Payment (+Wallet)
                                  </button>
                                )}
                              {o.verifyStatus === "Verified & Confirmed" &&
                                !o.loginIssued && (
                                  <button
                                    className="mini"
                                    onClick={() => issueBizLogin(o.id)}
                                  >
                                    Give Business Login
                                  </button>
                                )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {superPage === "Businesses" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>Business directory</strong>
                    <button
                      className="btn"
                      onClick={() => {
                        setNewBizName("");
                        setNewBizCat(categories[0].name);
                        setNewBizCity(cities[0]);
                        setModalState({ type: "createBusiness" });
                      }}
                    >
                      + Create business
                    </button>
                  </div>
                  {renderSimpleTable(
                    ["Business", "Category", "City", "Status", "Action"],
                    businesses.map((b) => [
                      b.name,
                      b.category,
                      b.city,
                      b.paused ? "Paused" : "Active",
                      <button
                        key={b.id}
                        className="mini no"
                        onClick={() => toggleBusiness(b.id)}
                      >
                        {b.paused ? "Resume" : "Pause"}
                      </button>,
                    ])
                  )}
                </div>
              )}

              {superPage === "Categories & Cities" && (
                <div className="grid2">
                  <div className="panel">
                    <strong>Categories</strong>
                    {categories.map((c) => (
                      <p
                        key={c.name}
                        style={{
                          fontSize: "11px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "7px 0",
                          borderBottom: "1px solid var(--line)",
                          margin: 0,
                        }}
                      >
                        <span
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "1px solid #e5ebf4",
                            background: "#fff",
                            display: "inline-grid",
                            placeItems: "center",
                            padding: "2px",
                          }}
                        >
                          <CategoryImage iconKey={c.icon} alt={c.name} height={26} />
                        </span>
                        {c.name}
                      </p>
                    ))}
                  </div>
                  <div className="panel">
                    <strong>Cities</strong>
                    {cities.map((c) => (
                      <p
                        key={c}
                        style={{
                          fontSize: "11px",
                          padding: "7px 0",
                          borderBottom: "1px solid var(--line)",
                          margin: 0,
                        }}
                      >
                        {c}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {superPage === "All Appointments" && (
                <div className="panel">
                  <strong>All platform appointments</strong>
                  {renderBookingsTable(bookings, false)}
                </div>
              )}

              {superPage === "Customers" && (
                <div className="panel">
                  <strong>Customers</strong>
                  {renderSimpleTable(
                    ["Name", "Mobile", "Total"],
                    uniquePhones.map((ph) => {
                      const b = bookings.find((x) => x.phone === ph)!;
                      return [
                        b.customer,
                        ph,
                        bookings.filter((x) => x.phone === ph).length,
                      ];
                    })
                  )}
                </div>
              )}

              {superPage === "Reports" && (
                <div className="grid2">
                  {renderStats([
                    ["Total bookings", bookings.length, "All categories", "calendar"],
                    [
                      "Order revenue",
                      `₹${businessOrders
                        .filter((o) => o.paymentStatus === "Full Payment Received")
                        .reduce((a, b) => a + b.amount, 0)
                        .toLocaleString("en-IN")}`,
                      "Full payments received",
                      "chart",
                    ],
                  ])}
                </div>
              )}

              {superPage === "Platform Settings" && (
                <div className="panel">
                  <div className="panelhead">
                    <strong>Platform settings</strong>
                    <button className="btn" onClick={() => showToast("Saved")}>
                      Save
                    </button>
                  </div>
                  <div className="field">
                    <label>Platform Name</label>
                    <input defaultValue="App4App" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </MonitorFrame>
    );
  };

  return (
    <div className="shell">
      <header className="top">
        <div className="brand">
          <div className="app4app-logo-frame">
            <img className="app4app-logo" src={LOGO_SRC} alt="App4App logo" />
          </div>
          <div className="brand-text">
            <strong>App4App - One App for All Appointment</strong>
            <small>Multi-domain appointment platform · Client presentation</small>
          </div>
        </div>
        <div className="topright">
          <div className="switch">
            {customerRoles.map((r) => (
              <button
                key={r}
                className={role === r ? "active" : ""}
                onClick={() => setRole(r)}
              >
                <SvgIcon name={roleMeta[r].icon} size={15} />
                {roleMeta[r].label}
              </button>
            ))}
          </div>
          <div className="switch admin-switch">
            {adminRoles.map((r) => (
              <button
                key={r}
                className={role === r ? "active" : ""}
                onClick={() => setRole(r)}
              >
                <SvgIcon name={roleMeta[r].icon} size={15} />
                {roleMeta[r].label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="intro">
        <div>
          <h1>{introText.title}</h1>
          <p>{introText.sub}</p>
        </div>
        <span className="tag-text">Interactive product walkthrough</span>
      </section>

      <main className="stage">
        {role === "customer-app" && renderCustomerMobileView(false)}
        {role === "customer-mobile-web" && renderCustomerMobileView(true)}
        {role === "customer-web" && renderCustomerDesktopWebView()}
        {role === "sales" && renderSalesView()}
        {role === "business" && renderBusinessView()}
        {role === "super" && renderSuperView()}
      </main>

      <div className="footnote">
        App4App · Connected customer, business and platform workflows · Demonstration data only
      </div>

      <section className="contact-card" aria-label="Contact Information">
        <div className="contact-heading">
          <span className="contact-kicker">CONTACT INFORMATION</span>
          <strong>FUTURE FUSION INFO TECH</strong>
          <span className="contact-caption">App4App - One App for All Appointment</span>
        </div>
        <div className="contact-links">
          <a
            href="mailto:futurefusioninfotech@gmail.com"
            aria-label="Email Future Fusion Info Tech"
          >
            <span className="contact-icon">✉</span>
            <span>
              <small>Email</small>
              <b>futurefusioninfotech@gmail.com</b>
            </span>
          </a>
          <a href="tel:+919500553499" aria-label="Call Future Fusion Info Tech">
            <span className="contact-icon">☎</span>
            <span>
              <small>Phone</small>
              <b className="tabular-nums">+91 95005 53499</b>
            </span>
          </a>
        </div>
      </section>

      <div className={`toast ${toastVisible ? "show" : ""}`}>{toastMsg}</div>

      <div className={`modalback ${modalState ? "show" : ""}`}>
        {modalState && (
          <div className="modal">
            <button className="close" onClick={() => setModalState(null)}>
              ✕
            </button>
            {modalState.type === "details" && (
              <>
                <h3>Appointment details</h3>
                <p>
                  <b>{modalState.booking.business}</b>
                </p>
                <p>
                  {modalState.booking.id} · {modalState.booking.service}
                </p>
                <p>
                  {modalState.booking.date} at {modalState.booking.time}
                </p>
                <p>
                  Status: <b>{modalState.booking.status}</b>
                </p>
              </>
            )}
            {modalState.type === "reschedule" && (
              <>
                <h3>Request reschedule</h3>
                <div className="field">
                  <label>New preferred date</label>
                  <input
                    type="date"
                    value={reschedDate}
                    onChange={(e) => setReschedDate(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Preferred time</label>
                  <select
                    value={reschedTime}
                    onChange={(e) => setReschedTime(e.target.value)}
                  >
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>03:30 PM</option>
                  </select>
                </div>
                <button
                  className="btn"
                  onClick={() => {
                    setBookings((prev) =>
                      prev.map((x) =>
                        x.id === modalState.bookingId
                          ? {
                              ...x,
                              status: "Reschedule Requested",
                              requestedDate: reschedDate,
                              requestedTime: reschedTime,
                            }
                          : x
                      )
                    );
                    setModalState(null);
                    showToast("Reschedule request sent to business");
                  }}
                >
                  Send request
                </button>
              </>
            )}
            {modalState.type === "createBusiness" && (
              <>
                <h3>Create new business</h3>
                <div className="field">
                  <label>Business name</label>
                  <input
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Category</label>
                  <select
                    value={newBizCat}
                    onChange={(e) => setNewBizCat(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>City</label>
                  <select
                    value={newBizCity}
                    onChange={(e) => setNewBizCity(e.target.value)}
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn"
                  onClick={() => {
                    if (!newBizName.trim()) {
                      showToast("Enter name");
                      return;
                    }
                    const catObj = categories.find((x) => x.name === newBizCat);
                    setBusinesses((prev) => [
                      ...prev,
                      {
                        id: "b" + Date.now(),
                        name: newBizName.trim(),
                        category: newBizCat,
                        city: newBizCity,
                        address: "India",
                        rating: "New",
                        price: 500,
                        icon: catObj?.icon || "briefcase",
                        services: ["Consultation"],
                        staff: ["Any available"],
                      },
                    ]);
                    setModalState(null);
                    showToast("Business created");
                  }}
                >
                  Create
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
