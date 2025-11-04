// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import Razorpay from "razorpay";
// import crypto from "crypto";

// dotenv.config(); // ✅ Load .env variables

// const app = express();
// app.use(cors({ origin: ["http://127.0.0.1:5500", "http://localhost:5500"], credentials: true }));
// app.use(express.json());

// // ✅ Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // ✅ Create Razorpay Order
// app.post("/api/payment/order", async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).json({ success: false, message: "Amount is required" });
//     }

//     console.log("🟢 Creating Razorpay Order for:", amount);

//     const options = {
//       amount: Number(amount),
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);
//     console.log("✅ Razorpay Order Created:", order.id);

//     res.status(200).json({ success: true, order });
//   } catch (error) {
//     console.error("❌ Razorpay Order Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Razorpay order creation failed",
//       error: error.error || error,
//     });
//   }
// });

// // ✅ Verify Razorpay Payment
// app.post("/api/payment/verify", async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Missing payment details" });
//     }

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     const isValid = expectedSignature === razorpay_signature;

//     if (isValid) {
//       console.log("✅ Payment verified successfully!");
//       res.status(200).json({ success: true, message: "Payment verified successfully" });
//     } else {
//       console.log("⚠️ Invalid payment signature!");
//       res.status(400).json({ success: false, message: "Invalid signature verification" });
//     }
//   } catch (error) {
//     console.error("❌ Verification Error:", error);
//     res.status(500).json({ success: false, message: "Payment verification failed", error });
//   }
// });

// // ✅ Get Razorpay Public Key
// app.get("/api/payment/getkey", (req, res) => {
//   return res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
// });

// // ✅ Start the Server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config(); // ✅ Load .env variables

const app = express();

// ✅ Allow Netlify frontend + local dev
app.use(
  cors({
    origin: [
      "https://quick-deals.netlify.app", // ✅ your deployed frontend
      "http://127.0.0.1:5500",           // for local testing
      "http://localhost:5500"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
app.post("/api/payment/order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    console.log("🟢 Creating Razorpay Order for:", amount);

    const options = {
      amount: Number(amount),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay Order Created:", order.id);

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("❌ Razorpay Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Razorpay order creation failed",
      error: error.error || error,
    });
  }
});

// ✅ Verify Razorpay Payment
app.post("/api/payment/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      console.log("✅ Payment verified successfully!");
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      console.log("⚠️ Invalid payment signature!");
      res.status(400).json({ success: false, message: "Invalid signature verification" });
    }
  } catch (error) {
    console.error("❌ Verification Error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed", error });
  }
});

// ✅ Get Razorpay Public Key
app.get("/api/payment/getkey", (req, res) => {
  return res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
