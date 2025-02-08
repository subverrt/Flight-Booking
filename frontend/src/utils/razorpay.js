export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    // If Razorpay is already loaded, resolve immediately.
    if (window.Razorpay) {
      return resolve(window.Razorpay);
    }
    
    // Create the script element.
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error("Razorpay SDK not available after script load."));
      }
    };
    script.onerror = () => {
      reject(new Error("Failed to load Razorpay SDK"));
    };
    
    document.body.appendChild(script);
  });
};
