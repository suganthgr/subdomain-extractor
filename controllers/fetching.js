const { getSubdomains } = require("../services/subdomainservice");

exports.getData = async (req, res) => {
  try {
    let domain = req.body.userinput;
    if (!domain.startsWith("http")) domain = "https://" + domain;

    const url = new URL(domain).hostname.replace(/^www\./i, "");
    console.log("Extracted Hostname:", url, "\tOriginal Domain:", domain);

    const subdomains = await getSubdomains(domain, url);
    res.json({ subdomains });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
