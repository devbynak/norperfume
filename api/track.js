// In-memory cache variables (persists across warm serverless requests in Vercel)
let cachedToken = null;
let tokenExpiry = null;

export default async function handler(req, res) {
  // 1. Set CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const awb = url.searchParams.get("awb");
  if (!awb) {
    return res.status(400).json({ error: "AWB tracking number is required" });
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: "Shiprocket credentials are not configured on the server. Please set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD." 
    });
  }

  try {
    let token = cachedToken;
    const now = Date.now();

    // 2. Step A: Get JWT token (use cache if valid, otherwise fetch fresh one)
    if (!token || !tokenExpiry || now >= tokenExpiry) {
      const authResponse = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!authResponse.ok) {
        let errMsg = "Authentication with shipping partner failed.";
        try {
          const errData = await authResponse.json();
          if (errData.message) {
            errMsg = `Authentication failed: ${errData.message}`;
          } else if (errData.errors) {
            errMsg = `Authentication failed: ${JSON.stringify(errData.errors)}`;
          }
        } catch (e) {
          try {
            const errText = await authResponse.text();
            if (errText) errMsg = `Authentication failed: ${errText}`;
          } catch (e2) {}
        }
        
        errMsg += " (Tip: You must use a dedicated API User credentials created from Shiprocket Panel -> Settings -> API -> Add New API User, not your primary account credentials.)";
        
        return res.status(401).json({ error: errMsg });
      }

      const authData = await authResponse.json();
      token = authData.token;
      
      // Cache the token for 12 hours (Shiprocket tokens expire in 24 hours)
      cachedToken = token;
      tokenExpiry = now + 12 * 60 * 60 * 1000;
    }

    // 3. Step B: Fetch live tracking status using AWB number and our secure JWT
    const trackingResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!trackingResponse.ok) {
      return res.status(trackingResponse.status).json({ error: "Failed to fetch tracking details from carrier." });
    }

    const rawData = await trackingResponse.json();
    
    // Check if tracking details are present
    const trackingData = rawData?.tracking_data;
    if (!trackingData || trackingData.track_status === 0) {
      return res.status(404).json({ error: "No tracking records found for this AWB number. Please verify the number." });
    }

    const shipmentActivities = trackingData.shipment_track_activities || [];
    const latestTrack = trackingData.shipment_track?.[0] || {};

    // 4. Step C: Map Shiprocket's raw structure to our premium format
    const currentStatus = latestTrack.current_status || "In Processing";
    const estimatedDelivery = latestTrack.edd || "Pending";
    const courierName = latestTrack.courier_name || "Luxury Courier Partner";
    const trackingNumber = latestTrack.awb_code || awb;

    // Map history activities with raw timestamps for client-side formatting
    const history = shipmentActivities.map((activity) => ({
      status: activity.activity,
      location: activity.location || "Carrier Hub",
      timestamp: activity.date,
      completed: true
    }));

    // Standard steps for the simplified timeline
    const mappedSteps = shipmentActivities.slice(0, 4).map((activity) => ({
      status: activity.activity,
      date: activity.date, // Pass raw date for client formatting
      desc: activity.location || "Carrier Hub",
      completed: true,
      current: false,
    }));

    if (mappedSteps.length === 0) {
      mappedSteps.push({
        status: currentStatus,
        date: new Date().toISOString(),
        desc: "Shipment details received by carrier.",
        completed: true,
        current: true
      });
    } else {
      mappedSteps[0].current = true;
    }

    return res.status(200).json({
      success: true,
      trackingNumber,
      courierName,
      status: currentStatus,
      location: latestTrack.current_location || "Processing Hub",
      edd: estimatedDelivery,
      history: history.reverse(), // Send chronological order from API
      steps: mappedSteps.reverse(),
      rawData: rawData
    });

  } catch (error) {
    return res.status(500).json({ error: "Internal server error occurred while tracking." });
  }
}
