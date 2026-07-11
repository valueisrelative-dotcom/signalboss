function field(label, value) {
  return `${label.padEnd(28)}${value || "—"}\n`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const companyName = (body.company_name || "").trim();
  const email = (body.email || "").trim();

  if (!companyName || !email) {
    return res.status(400).json({ error: "Legal company name and email are required." });
  }

  const text =
    "EQUIPMENT CREDIT APPLICATION\n" +
    "=============================\n\n" +
    "COMPANY INFORMATION\n" +
    "-------------------\n" +
    field("Legal Company Name:", body.company_name) +
    field("Phone:", body.company_phone) +
    field("Contact Person:", body.contact_person) +
    field("Website:", body.website) +
    field("Email:", body.email) +
    field("Fax:", body.company_fax) +
    field("Cell Phone:", body.cell_phone) +
    field("Street Address:", body.street_address) +
    field("City:", body.city) +
    field("State:", body.state) +
    field("Zip Code:", body.zip_code) +
    field("Entity Type:", body.entity_type) +
    field("Fed. Tax ID #:", body.tax_id) +
    field("Nature of Business:", body.nature_of_business) +
    field("Year Started:", body.year_started) +
    "\nPRINCIPAL / OWNER (1)\n" +
    "---------------------\n" +
    field("Full Name:", body.principal1_name) +
    field("Company Title:", body.principal1_title) +
    field("Social Security #:", body.principal1_ssn) +
    field("Date of Birth:", body.principal1_dob) +
    field("Home Phone:", body.principal1_phone) +
    field("Home Address:", body.principal1_address) +
    field("City:", body.principal1_city) +
    field("State:", body.principal1_state) +
    field("Zip Code:", body.principal1_zip) +
    "\nPRINCIPAL / OWNER (2)\n" +
    "---------------------\n" +
    field("Full Name:", body.principal2_name) +
    field("Company Title:", body.principal2_title) +
    field("Social Security #:", body.principal2_ssn) +
    field("Date of Birth:", body.principal2_dob) +
    field("Home Phone:", body.principal2_phone) +
    field("Home Address:", body.principal2_address) +
    field("City:", body.principal2_city) +
    field("State:", body.principal2_state) +
    field("Zip Code:", body.principal2_zip) +
    "\nDEALER INFORMATION & EQUIPMENT DESCRIPTION\n" +
    "-------------------------------------------\n" +
    field("Dealer Name:", body.dealer_name) +
    field("Full Address:", body.dealer_address) +
    field("Sales Person:", body.dealer_sales_person) +
    field("Phone:", body.dealer_phone) +
    field("Year:", body.equipment_year) +
    field("Make & Model:", body.equipment_make_model) +
    field("Equipment Description / Miles / Hours:", body.equipment_description) +
    field("Cost $:", body.equipment_cost) +
    "\nSIGNATURES\n" +
    "----------\n" +
    field("Primary Applicant:", body.primary_signature) +
    field("Co-Applicant:", body.coapplicant_signature);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Signal Boss Flex Finance <onboarding@resend.dev>",
        to: ["info@signalboss.net"],
        reply_to: email,
        subject: `💰 Equipment Credit Application — ${companyName}`,
        text,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Flexfinance handler error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
