import { toast } from "react-toastify";

export async function validateData(data, type) {
  const errors = [];

  // Validate email
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push("Valid email is required");
  }

  // Validate password
  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // Additional validation for "register"
  if (type === "register") {
    if (!data.name || data.name.trim() === "") {
      errors.push("Name is required");
    }
  }

  if (errors.length > 0) {
    toast.error("Validation failed: " + errors.join(", "));
    return false; // ❌ Validation failed
  }

  toast.success("Validation successful!");
  return true; // ✅ Validation passed
}
