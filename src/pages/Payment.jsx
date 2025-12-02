import React, { useState } from "react";
import { transactionAPI } from "../services/api";

const initialAccounts = [
  {
    id: "checking",
    name: "Premium Checking",
    number: "****----", // Will be replaced with user's actual account number
    balance: 1,
  },
  {
    id: "savings",
    name: "High-Yield Savings",
    number: "****7232",
    balance: 1,
  },
  {
    id: "rewards",
    name: "Platinum Rewards",
    number: "****3214",
    balance: 1,
  },
];

// Generate international account database with various formats
const generateAccountDatabase = () => {
  const firstNames = [
    "James",
    "Mary",
    "John",
    "Patricia",
    "Robert",
    "Jennifer",
    "Michael",
    "Linda",
    "William",
    "Barbara",
    "David",
    "Elizabeth",
    "Richard",
    "Susan",
    "Joseph",
    "Jessica",
    "Thomas",
    "Sarah",
    "Charles",
    "Karen",
    "Christopher",
    "Nancy",
    "Daniel",
    "Lisa",
    "Matthew",
    "Betty",
    "Anthony",
    "Margaret",
    "Mark",
    "Sandra",
    "Donald",
    "Ashley",
    "Steven",
    "Kimberly",
    "Paul",
    "Emily",
    "Andrew",
    "Donna",
    "Joshua",
    "Michelle",
    "Kenneth",
    "Dorothy",
    "Kevin",
    "Carol",
    "Brian",
    "Amanda",
    "George",
    "Melissa",
    "Edward",
    "Deborah",
    "Ronald",
    "Stephanie",
    "Timothy",
    "Rebecca",
    "Jason",
    "Sharon",
    "Jeffrey",
    "Laura",
    "Ryan",
    "Cynthia",
    "Jacob",
    "Kathleen",
    "Gary",
    "Amy",
    "Nicholas",
    "Shirley",
    "Eric",
    "Angela",
    "Jonathan",
    "Helen",
    "Stephen",
    "Anna",
    "Larry",
    "Brenda",
    "Justin",
    "Pamela",
    "Scott",
    "Nicole",
    "Brandon",
    "Emma",
    "Benjamin",
    "Samantha",
    "Samuel",
    "Katherine",
    "Raymond",
    "Christine",
    "Gregory",
    "Debra",
    "Frank",
    "Rachel",
    "Alexander",
    "Catherine",
    "Patrick",
    "Carolyn",
    "Jack",
    "Janet",
    "Dennis",
    "Ruth",
    "Jerry",
    "Maria",
    "Tyler",
    "Heather",
    "Aaron",
    "Diane",
    // African names
    "Chinwe",
    "Adebayo",
    "Amara",
    "Kofi",
    "Zanele",
    "Tendai",
    "Fatima",
    "Ibrahim",
    "Aisha",
    "Kwame",
    "Ngozi",
    "Oluwaseun",
    "Thandiwe",
    "Musa",
    "Zainab",
    "Yusuf",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
    "Carter",
    "Roberts",
    "Gomez",
    "Phillips",
    "Evans",
    "Turner",
    "Diaz",
    "Parker",
    "Cruz",
    "Edwards",
    "Collins",
    "Reyes",
    "Stewart",
    "Morris",
    "Morales",
    "Murphy",
    "Cook",
    "Rogers",
    "Gutierrez",
    "Ortiz",
    "Morgan",
    "Cooper",
    "Peterson",
    "Bailey",
    "Reed",
    "Kelly",
    "Howard",
    "Ramos",
    "Kim",
    "Cox",
    "Ward",
    "Richardson",
    "Watson",
    "Brooks",
    "Chavez",
    "Wood",
    "James",
    "Bennett",
    "Gray",
    "Mendoza",
    "Ruiz",
    "Hughes",
    "Price",
    "Alvarez",
    "Castillo",
    "Sanders",
    "Patel",
    "Myers",
    "Long",
    "Ross",
    "Foster",
    "Jimenez",
    // African surnames
    "Okonkwo",
    "Mensah",
    "Nkosi",
    "Mutombo",
    "Banda",
    "Kamara",
    "Diallo",
    "Okafor",
    "Adekunle",
    "Mwangi",
    "Dlamini",
    "Traore",
    "Kone",
    "Sesay",
    "Okeke",
    "Boateng",
  ];

  const accounts = [];

  // USA accounts (10 digits starting with 1000000000)
  for (let i = 0; i < 30; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const accountNumber = String(1000000000 + i).padStart(10, "0");
    accounts.push({
      accountNumber,
      ownerName: `${firstName} ${lastName}`,
      country: "USA",
    });
  }

  // Nigeria accounts (10 digits starting with 0-9)
  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const accountNumber = String(2000000000 + i).padStart(10, "0");
    accounts.push({
      accountNumber,
      ownerName: `${firstName} ${lastName}`,
      country: "Nigeria",
    });
  }

  // South Africa accounts (9-11 digits)
  for (let i = 0; i < 15; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const accountNumber = String(300000000 + i).padStart(9, "0");
    accounts.push({
      accountNumber,
      ownerName: `${firstName} ${lastName}`,
      country: "South Africa",
    });
  }

  // Kenya accounts (13 digits)
  for (let i = 0; i < 15; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const accountNumber = String(4000000000000 + i).padStart(13, "0");
    accounts.push({
      accountNumber,
      ownerName: `${firstName} ${lastName}`,
      country: "Kenya",
    });
  }

  // Ghana accounts (13 digits)
  for (let i = 0; i < 10; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const accountNumber = String(5000000000000 + i).padStart(13, "0");
    accounts.push({
      accountNumber,
      ownerName: `${firstName} ${lastName}`,
      country: "Ghana",
    });
  }

  // UK accounts (8 digits)
  for (let i = 0; i < 10; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const accountNumber = String(60000000 + i).padStart(8, "0");
    accounts.push({
      accountNumber,
      ownerName: `${firstName} ${lastName}`,
      country: "UK",
    });
  }

  return accounts;
};

const accountDatabase = generateAccountDatabase();

function Payment() {
  const [tab, setTab] = useState("Transfer");
  const [accounts, setAccounts] = useState(initialAccounts);
  const [from, setFrom] = useState(initialAccounts[0].id);
  const [to, setTo] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountOwner, setAccountOwner] = useState("");
  const [amount, setAmount] = useState("");
  const [when, setWhen] = useState("Now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingTransactionId, setPendingTransactionId] = useState(null);
  const [message, setMessage] = useState(""); // Keeping the original line for context
  // toast pop-out for success feedback
  const [toast, setToast] = useState({ text: "", visible: false });
  const showToast = (text, duration = 2000) => {
    setToast({ text, visible: true });
    setTimeout(() => setToast({ text: "", visible: false }), duration);
  };
  const [error, setError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Fetch user account number and balance
  React.useEffect(() => {
    const fetchUserAccount = async () => {
      try {
        const storedAccountNumber = localStorage.getItem("accountNumber");
        const userId = localStorage.getItem("userId");

        let userAccountNumber = storedAccountNumber;

        if (!userAccountNumber && userId) {
          const response = await fetch(
            `http://localhost:8080/api/user/${userId}/account`
          );
          const data = await response.json();
          if (data.accountNumber) {
            userAccountNumber = data.accountNumber;
            localStorage.setItem("accountNumber", data.accountNumber);
          }
        }

        // Fetch balance
        const balance = await transactionAPI.getBalance();

        // Update accounts with real data
        setAccounts((prevAccounts) => {
          const updated = [...prevAccounts];
          if (updated[0]) {
            updated[0].number = userAccountNumber
              ? `****${userAccountNumber.slice(-4)}`
              : "****----";
            updated[0].balance = balance || 0;
          }
          return updated;
        });
      } catch (error) {
        console.error("Failed to fetch user account:", error);
      }
    };

    fetchUserAccount();
  }, []);

  // Transfer history
  const [transferHistory, setTransferHistory] = useState(() => {
    const userId = localStorage.getItem("userId");
    const saved = localStorage.getItem(`transferHistory_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Poll for transaction approval status
  React.useEffect(() => {
    if (!pendingTransactionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/transactions/single/${pendingTransactionId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const transaction = await response.json();

          if (transaction.status === "APPROVED") {
            setLoading(false);
            setPendingTransactionId(null);
            showToast("Transaction Successful", 3000);
            clearInterval(pollInterval);
          } else if (transaction.status === "REJECTED") {
            setLoading(false);
            setPendingTransactionId(null);
            showToast("Transaction Failed", 3000);
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        console.error("Error polling transaction status:", err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [pendingTransactionId]);

  // Initialize scheduled payments from localStorage
  const [scheduledPayments, setScheduledPayments] = useState(() => {
    const userId = localStorage.getItem("userId");
    const saved = localStorage.getItem(`scheduledPayments_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Save scheduled payments to localStorage whenever they change
  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(
        `scheduledPayments_${userId}`,
        JSON.stringify(scheduledPayments)
      );
    }
  }, [scheduledPayments]);

  // Save transfer history to localStorage
  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(
        `transferHistory_${userId}`,
        JSON.stringify(transferHistory)
      );
    }
  }, [transferHistory]);

  // Handle account number input and lookup
  const handleAccountNumberChange = async (e) => {
    const number = e.target.value;
    setAccountNumber(number);

    // Look up account owner when number is entered (supports international account numbers)
    // Accepts 8-34 characters (IBAN can be up to 34 characters, most countries use 8-20 digits)
    if (number.length >= 8 && bankName) {
      setIsLookingUp(true);
      setError("");

      try {
        // First, try API lookup for real account (supports worldwide accounts)
        const response = await fetch(
          `http://localhost:8080/api/account/lookup/${number}?bank=${encodeURIComponent(
            bankName
          )}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.accountHolder) {
            setAccountOwner(data.accountHolder);
            setIsLookingUp(false);
            return;
          }
        }
      } catch (err) {
        console.log("API lookup failed, validating account format");
      }

      // Validate international account number formats and generate random name based on bank
      let isValid = false;
      let ownerName = "";

      // Nigerian Banks (10 digits)
      if (
        /^\d{10}$/.test(number) &&
        bankName.toLowerCase().includes("nigeria")
      ) {
        isValid = true;
        const nigerianNames = [
          "Adebayo Okonkwo",
          "Chinwe Mensah",
          "Oluwaseun Adekunle",
          "Ngozi Okeke",
          "Chidi Nkosi",
          "Amara Kamara",
          "Kofi Diallo",
          "Fatima Mwangi",
          "Ibrahim Banda",
          "Aisha Traore",
          "Yusuf Sesay",
          "Zainab Boateng",
        ];
        ownerName =
          nigerianNames[Math.floor(Math.random() * nigerianNames.length)];
      }
      // South African Banks (9-11 digits)
      else if (
        /^\d{9,11}$/.test(number) &&
        bankName.toLowerCase().includes("south africa")
      ) {
        isValid = true;
        const southAfricanNames = [
          "Thandiwe Dlamini",
          "Zanele Nkosi",
          "Tendai Mutombo",
          "Sipho van der Merwe",
          "Naledi Mokoena",
          "Thabo Khumalo",
          "Lerato Mahlangu",
          "Kagiso Ndlovu",
        ];
        ownerName =
          southAfricanNames[
            Math.floor(Math.random() * southAfricanNames.length)
          ];
      }
      // Kenyan Banks (13 digits)
      else if (
        /^\d{13}$/.test(number) &&
        bankName.toLowerCase().includes("kenya")
      ) {
        isValid = true;
        const kenyanNames = [
          "Kwame Mwangi",
          "Ama Kamau",
          "Kwesi Otieno",
          "Abena Kipchoge",
          "Yaw Wanjiru",
          "Efua Kimani",
        ];
        ownerName = kenyanNames[Math.floor(Math.random() * kenyanNames.length)];
      }
      // Ghanaian Banks (13 digits)
      else if (
        /^\d{13}$/.test(number) &&
        bankName.toLowerCase().includes("ghana")
      ) {
        isValid = true;
        const ghanaianNames = [
          "Kofi Mensah",
          "Akua Osei",
          "Kwame Boateng",
          "Ama Asante",
          "Yaw Appiah",
          "Abena Owusu",
        ];
        ownerName =
          ghanaianNames[Math.floor(Math.random() * ghanaianNames.length)];
      }
      // UK Banks (8 digits)
      else if (
        /^\d{8}$/.test(number) &&
        bankName.toLowerCase().includes("uk")
      ) {
        isValid = true;
        const ukNames = [
          "James Smith",
          "Emily Johnson",
          "Oliver Brown",
          "Amelia Davis",
          "George Wilson",
          "Charlotte Taylor",
          "Harry Anderson",
          "Sophie Thomas",
        ];
        ownerName = ukNames[Math.floor(Math.random() * ukNames.length)];
      }
      // USA Banks (9-12 digits)
      else if (
        /^\d{9,12}$/.test(number) &&
        bankName.toLowerCase().includes("usa")
      ) {
        isValid = true;
        const usNames = [
          "John Williams",
          "Sarah Miller",
          "Michael Davis",
          "Jessica Martinez",
          "David Garcia",
          "Jennifer Rodriguez",
          "Robert Wilson",
          "Linda Anderson",
        ];
        ownerName = usNames[Math.floor(Math.random() * usNames.length)];
      }
      // IBAN format for European banks (2 letters + 2 digits + up to 30 alphanumeric)
      else if (/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/i.test(number)) {
        isValid = true;
        const europeanNames = [
          "Hans Mueller",
          "Sophie Dubois",
          "Marco Rossi",
          "Anna Schmidt",
          "Pierre Martin",
          "Maria Garcia",
          "Jan Kowalski",
          "Elena Popov",
        ];
        ownerName =
          europeanNames[Math.floor(Math.random() * europeanNames.length)];
      }
      // General international format (8-34 alphanumeric characters)
      else if (/^[A-Z0-9]{8,34}$/i.test(number)) {
        isValid = true;
        const internationalNames = [
          "Ahmed Hassan",
          "Mei Chen",
          "Rajesh Kumar",
          "Fatima Al-Sayed",
          "Hiroshi Tanaka",
          "Isabella Santos",
          "Carlos Rodriguez",
          "Yuki Yamamoto",
        ];
        ownerName =
          internationalNames[
            Math.floor(Math.random() * internationalNames.length)
          ];
      }

      if (isValid) {
        setAccountOwner(ownerName);
        setError("");
      } else {
        setAccountOwner("");
        setError("Invalid account number format");
      }

      setIsLookingUp(false);
    } else {
      setAccountOwner("");
      if (
        error === "Account not found" ||
        error === "Invalid account number format"
      )
        setError("");
    }
  };

  // Select from transfer history
  const selectFromHistory = (historyItem) => {
    setAccountNumber(historyItem.accountNumber);
    setAccountOwner(historyItem.ownerName);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        !from ||
        !accountNumber ||
        !amount ||
        isNaN(amount) ||
        Number(amount) <= 0
      ) {
        throw new Error("Please fill all fields with valid values.");
      }

      if (!accountOwner) {
        throw new Error("Please enter a valid account number");
      }

      const amt = Number(amount);

      const currentBalance = await transactionAPI.getBalance();
      if (currentBalance < amt) {
        throw new Error("Insufficient funds");
      }

      let transactionType;
      let description;

      // Schedule the payment
      if (when === "Schedule") {
        if (!scheduledDate) {
          throw new Error("Please choose a date for the scheduled payment");
        }

        const id = `s${Date.now()}`;
        setScheduledPayments((s) => [
          ...s,
          {
            id,
            from,
            accountNumber,
            ownerName: accountOwner,
            amount: amt,
            date: scheduledDate,
            memo,
          },
        ]);
        showToast("Payment scheduled");
        setAmount("");
        setMemo("");
        setAccountNumber("");
        setAccountOwner("");
        setScheduledDate("");
        return;
      }

      transactionType = "TRANSFER";
      description = `Transfer to ${accountOwner} (${accountNumber})${
        memo ? " - " + memo : ""
      }`;

      // Send transaction for admin approval
      const response = await fetch(
        "http://localhost:8080/api/transactions/pending",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: parseInt(localStorage.getItem("userId")),
            transactionType,
            amount: amt,
            description,
            status: "PENDING",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit transaction");
      }

      const savedTransaction = await response.json();

      // Start polling for approval
      setPendingTransactionId(savedTransaction.id);
      showToast(
        "Pending",
        60000 // Show for 60 seconds or until approved
      );

      // Add to transfer history
      const historyItem = {
        accountNumber,
        ownerName: accountOwner,
        timestamp: Date.now(),
      };

      setTransferHistory((prev) => {
        // Remove duplicate if exists
        const filtered = prev.filter(
          (item) => item.accountNumber !== accountNumber
        );
        // Add to beginning, keep only last 5
        return [historyItem, ...filtered].slice(0, 5);
      });

      setAmount("");
      setMemo("");
      setAccountNumber("");
      setBankName("");
      setAccountOwner("");
    } catch (err) {
      setError(err.message || "Transaction failed");
      setLoading(false);
    }
  };
  const handleBillPay = async (e) => {
    e && e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!from || !to || !amount || isNaN(amount) || Number(amount) <= 0) {
        throw new Error("Please select from, payee and enter a valid amount.");
      }
      const amt = Number(amount);
      const currentBalance = await transactionAPI.getBalance();
      if (currentBalance < amt) {
        throw new Error("Insufficient funds");
      }

      const description = `Bill payment to ${to}${memo ? " - " + memo : ""}`;

      // Send transaction for admin approval
      const response = await fetch(
        "http://localhost:8080/api/transactions/pending",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: parseInt(localStorage.getItem("userId")),
            transactionType: "WITHDRAW",
            amount: amt,
            description,
            status: "PENDING",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit payment");
      }

      const savedTransaction = await response.json();

      // Start polling for approval
      setPendingTransactionId(savedTransaction.id);
      showToast(
        "Pending",
        60000 // Show for 60 seconds or until approved
      );
      setAmount("");
      setMemo("");
      setTo("");
    } catch (err) {
      setError(err.message || "Payment failed");
      setLoading(false);
    }
  };

  const cancelScheduled = (id) => {
    setScheduledPayments((s) => s.filter((p) => p.id !== id));
  };

  return (
    <main className="bg-[#ececec] p-3 sm:p-5">
      <section className="py-5 sm:py-10">
        <h3 className="font-bold text-xl sm:text-2xl"> Payment & Transfers</h3>
        <p className="text-sm sm:text-[15px] text-[#595959] mt-1">
          Send money, pay bills, and manage scheduled payments
        </p>
      </section>
      {/* Toast Notification - Large Component */}
      <div aria-live="polite">
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
            toast.visible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm"></div>

          {/* Notification Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full mx-4 transform transition-transform duration-300">
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl ${
                  toast.text.includes("Pending") ||
                  toast.text.includes("pending")
                    ? "bg-orange-500 animate-pulse"
                    : toast.text.includes("Successful") ||
                      toast.text.includes("successful")
                    ? "bg-[#2ec700]"
                    : "bg-red-500"
                }`}
              >
                {toast.text.includes("Pending") ||
                toast.text.includes("pending")
                  ? "⏳"
                  : toast.text.includes("Successful") ||
                    toast.text.includes("successful")
                  ? "✓"
                  : "✕"}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {toast.text.includes("Pending") ||
                  toast.text.includes("pending")
                    ? "Pending"
                    : toast.text.includes("Successful") ||
                      toast.text.includes("successful")
                    ? "Transaction Successful"
                    : "Transaction Failed"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="flex flex-col lg:flex-row gap-3">
        <section className="w-full lg:w-[65%] bg-white rounded-lg shadow p-3 sm:p-5">
          <header className=" pt-3 px-3 border-b border-[#acacac]">
            <ul className="flex gap-7 ">
              {["Transfer", "Bill Pay", "Scheduled"].map((t) => (
                <li
                  key={t}
                  className={`pb-3 font-medium border-b-2 cursor-pointer transition-colors duration-150 ${
                    tab === t
                      ? "border-[#c64c00] text-[#c64c00]"
                      : "border-transparent hover:border-[#c64c00] hover:text-[#c64c00]"
                  }`}
                  tabIndex={0}
                  onClick={() => setTab(t)}
                  onKeyDown={(e) => (e.key === "Enter" ? setTab(t) : null)}
                  aria-selected={tab === t}
                  role="tab"
                >
                  {t}
                </li>
              ))}
            </ul>
          </header>

          {/* Tabbed content */}
          {tab === "Transfer" && (
            <form onSubmit={handleTransfer} autoComplete="off">
              <h3 className="font-semibold text-xl my-8 m-3">Transfer Money</h3>

              <h5 className="text-[16px] font-medium mb-1 mx-3">Bank Name</h5>
              <div className="rounded-lg border border-[#8b8b8b] p-2 w-full mb-4">
                <select
                  className="bg-transparent outline-none w-full"
                  value={bankName}
                  onChange={(e) => {
                    setBankName(e.target.value);
                    if (accountNumber.length >= 8) {
                      handleAccountNumberChange({
                        target: { value: accountNumber },
                      });
                    }
                  }}
                  required
                  aria-label="Bank name"
                >
                  <option value="">-- Select Bank --</option>
                  <option value="GT Bank Nigeria">GT Bank Nigeria</option>
                  <option value="Access Bank Nigeria">
                    Access Bank Nigeria
                  </option>
                  <option value="First Bank Nigeria">First Bank Nigeria</option>
                  <option value="Zenith Bank Nigeria">
                    Zenith Bank Nigeria
                  </option>
                  <option value="UBA Nigeria">UBA Nigeria</option>
                  <option value="Standard Bank South Africa">
                    Standard Bank South Africa
                  </option>
                  <option value="FNB South Africa">FNB South Africa</option>
                  <option value="Absa South Africa">Absa South Africa</option>
                  <option value="KCB Bank Kenya">KCB Bank Kenya</option>
                  <option value="Equity Bank Kenya">Equity Bank Kenya</option>
                  <option value="GCB Bank Ghana">GCB Bank Ghana</option>
                  <option value="Ecobank Ghana">Ecobank Ghana</option>
                  <option value="Barclays UK">Barclays UK</option>
                  <option value="HSBC UK">HSBC UK</option>
                  <option value="Lloyds Bank UK">Lloyds Bank UK</option>
                  <option value="Bank of America USA">
                    Bank of America USA
                  </option>
                  <option value="Chase Bank USA">Chase Bank USA</option>
                  <option value="Wells Fargo USA">Wells Fargo USA</option>
                  <option value="Citibank USA">Citibank USA</option>
                </select>
              </div>

              <h5 className="text-[16px] font-medium mb-1 mx-3">
                Account Number
              </h5>
              <div className="rounded-lg border border-[#8b8b8b] p-2 w-full">
                <input
                  type="text"
                  className="bg-transparent outline-none w-full"
                  value={accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="Enter account number (8-34 digits - Worldwide)"
                  aria-label="Account number"
                  maxLength="34"
                />
              </div>

              {!bankName && accountNumber && (
                <div className="mx-3 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                    Please select a bank first
                  </p>
                </div>
              )}

              {isLookingUp && (
                <div className="mx-3 mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Looking up account...
                  </p>
                </div>
              )}

              {accountOwner && !isLookingUp && (
                <div className="mx-3 mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <i className="fa-solid fa-check-circle mr-2"></i>
                    Account Owner:{" "}
                    <span className="font-semibold">{accountOwner}</span>
                  </p>
                </div>
              )}

              {/* Recent Transfer History */}
              {transferHistory.length > 0 && !accountNumber && (
                <div className="mx-3 mt-4">
                  <h5 className="text-[14px] font-medium mb-2 text-[#595959]">
                    Recent Transfers
                  </h5>
                  <div className="space-y-2">
                    {transferHistory.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-[#f5f5f5] rounded-lg cursor-pointer hover:bg-[#e8e8e8] transition-colors"
                        onClick={() => selectFromHistory(item)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#c64c00] flex items-center justify-center text-white">
                              <i className="fa-solid fa-user text-sm"></i>
                            </div>
                            <div>
                              <p className="font-semibold text-[14px]">
                                {item.ownerName}
                              </p>
                              <p className="text-[12px] text-[#595959]">
                                {item.accountNumber}
                              </p>
                            </div>
                          </div>
                          <i className="fa-solid fa-chevron-right text-[#595959]"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h5 className="text-[16px] font-medium mb-1 mt-4 mx-3">Amount</h5>
              <div className="rounded-lg border border-[#8b8b8b] w-full">
                <input
                  type="number"
                  name="number"
                  required
                  min={0.01}
                  step={0.01}
                  placeholder="0.00"
                  className="p-2 border-none outline-none w-full"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-label="Amount"
                />
              </div>
              <h5 className="text-[16px] font-medium mb- mt-4 ">When</h5>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className={`px-3 p-1 rounded-lg ${
                    when === "Now"
                      ? "bg-[#c64c00] text-white"
                      : "bg-transparent border border-[#595959]"
                  }`}
                  onClick={() => setWhen("Now")}
                >
                  Now
                </button>
                <button
                  type="button"
                  className={`px-3 p-1 rounded-lg ${
                    when === "Schedule"
                      ? "bg-[#c64c00] text-white"
                      : "bg-transparent border border-[#595959]"
                  }`}
                  onClick={() => setWhen("Schedule")}
                >
                  Schedule
                </button>
                {when === "Schedule" && (
                  <input
                    type="date"
                    className="ml-3 border p-2 rounded"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                )}
              </div>
              <h5 className="text-[16px] font-medium mb-1 mt-4">
                Memo (Optional)
              </h5>
              <div className="rounded-lg border border-[#8b8b8b] w-full">
                <input
                  type="text"
                  placeholder="Add a note"
                  className="border-none outline-none p-2 w-full"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  aria-label="Memo"
                />
              </div>
              {error && (
                <div className="text-red-600 mt-3 text-sm">{error}</div>
              )}
              {/* success messages are shown via toast pop-out */}
              <button
                className="w-full p-2 font-medium text-white rounded-lg bg-[#c64c00] mt-9 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
                type="submit"
              >
                {loading
                  ? "Pending..."
                  : when === "Schedule"
                  ? "Schedule Payment"
                  : "Transfer Money"}
              </button>
            </form>
          )}

          {tab === "Bill Pay" && (
            <form onSubmit={handleBillPay} className="p-3">
              <h3 className="font-semibold text-lg sm:text-xl my-3">
                Pay a Bill / Card
              </h3>
              <label className="text-sm">Payee</label>
              <div className="rounded-lg border p-2 mb-3">
                <select
                  className="w-full outline-none bg-transparent text-sm sm:text-base"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                >
                  <option value="">Select payee</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.number})
                    </option>
                  ))}
                  <option value="rent">Rent</option>
                  <option value="electric">Electric Company</option>
                  <option value="internet">Internet Provider</option>
                </select>
              </div>
              <label className="text-sm">Amount</label>
              <div className="rounded-lg border p-2 mb-3">
                <input
                  className="w-full outline-none text-sm sm:text-base"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  inputMode="numeric"
                />
              </div>
              <label className="text-sm">Memo</label>
              <div className="rounded-lg border p-2 mb-3">
                <input
                  className="w-full outline-none text-sm sm:text-base"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Optional note"
                />
              </div>
              {error && (
                <div className="text-red-600 mt-3 text-sm">{error}</div>
              )}
              {/* success messages are shown via toast pop-out */}
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-sm sm:text-base"
                  onClick={() => {
                    setAmount("");
                    setMemo("");
                    setTo("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c64c00] text-white rounded disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? "Pending..." : "Pay Now"}
                </button>
              </div>
            </form>
          )}

          {tab === "Scheduled" && (
            <div className="p-3">
              <h3 className="font-semibold text-lg sm:text-xl my-3">
                Scheduled Payments
              </h3>
              {scheduledPayments.length === 0 && (
                <p className="text-sm text-[#595959]">No scheduled payments</p>
              )}
              {scheduledPayments.map((s) => (
                <div
                  key={s.id}
                  className="border rounded p-3 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div>
                    <div className="font-medium text-sm sm:text-base">
                      {s.to}
                    </div>
                    <div className="text-sm text-[#595959]">
                      {s.date} • ${s.amount}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 border rounded text-sm"
                      onClick={() => cancelScheduled(s.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="w-full lg:w-[35%] bg-white rounded-lg shadow p-3">
          <h3 className="font-semibold text-lg sm:text-xl mb-4">
            Quick Actions
          </h3>
          <section>
            <button
              className="flex w-full cursor-pointer hover:bg-[#d0d0d0] mb-3 gap-3 items-center rounded-lg p-3 sm:p-4 bg-[#f9f9f9]"
              aria-label="Send Money"
              type="button"
              onClick={() => setTab("Transfer")}
              role="button"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 p-2 rounded-full bg-[#0051ff45] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-paper-plane text-[#0051ff]" />
              </span>
              <h4 className="font-semibold text-base sm:text-lg">Send Money</h4>
            </button>
            <button
              className="flex w-full cursor-pointer hover:bg-[#d0d0d0] mb-3 gap-3 items-center rounded-lg p-3 sm:p-4 bg-[#f9f9f9]"
              aria-label="Pay Credit Card"
              type="button"
              onClick={() => {
                setTab("Bill Pay");
                setTo("rewards");
              }}
              role="button"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 p-2 rounded-full bg-[#2fff0045] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-credit-card text-[#00b300]" />
              </span>
              <h4 className="font-semibold text-base sm:text-lg">
                Pay Credit Card
              </h4>
            </button>
            <button
              className="flex w-full cursor-pointer hover:bg-[#d0d0d0] mb-3 gap-3 items-center rounded-lg p-3 sm:p-4 bg-[#f9f9f9]"
              aria-label="Pay Bills"
              type="button"
              onClick={() => setTab("Bill Pay")}
              role="button"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 p-2 rounded-full bg-[#8800ff45] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-file-invoice-dollar text-[#8800ff]" />
              </span>
              <h4 className="font-semibold text-base sm:text-lg">Pay Bills</h4>
            </button>
          </section>

          {/* Hidden: Mock accounts section - user has one real account balance */}
        </section>
      </section>
    </main>
  );
}

export default Payment;
