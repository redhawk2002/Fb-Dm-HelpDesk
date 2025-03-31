import { validateData } from "./validateData";
import { toast } from "react-toastify";

export const submitForm = async (event) => {
  event.preventDefault();
  toast.info("Form submitting...");

  const form = new FormData(event.target);
  const data = {
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password"),
  };

  console.log("Final Data:", data);

  const isValid = await validateData(data);

  if (!isValid) return;

  toast.success("Form submitted successfully!", { delay: 1000 });
  event.target.reset();
};
