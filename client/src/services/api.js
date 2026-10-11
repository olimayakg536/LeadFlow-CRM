const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/leads`
  : import.meta.env.DEV
  ? "http://localhost:5000/api/leads"
  : "/api/leads";

// Sends a request and returns the JSON answer.
// If something goes wrong, it throws an Error with a friendly message.
async function request(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("Cannot connect to the server. Please start the backend (npm start inside the server folder).");
  }

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    // The server sent no JSON - ignore
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

// Settings for requests that send JSON data
function jsonOptions(method, body) {
  return {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function getLeads() {
  return request(BASE_URL);
}

export function getLead(id) {
  return request(BASE_URL + "/" + id);
}

export function createLead(lead) {
  return request(BASE_URL, jsonOptions("POST", lead));
}

export function updateLead(id, lead) {
  return request(BASE_URL + "/" + id, jsonOptions("PUT", lead));
}

export function deleteLead(id) {
  return request(BASE_URL + "/" + id, { method: "DELETE" });
}

export function updateStatus(id, status) {
  return request(BASE_URL + "/" + id + "/status", jsonOptions("PATCH", { status: status }));
}
