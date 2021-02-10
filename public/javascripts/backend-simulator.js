const userOne = {
  name: "Carl Velasco",
  displayName: "Carl",
  displayEmail: "carlvelasco96@gmail.com",
  address: {
    unit: "",
    street: "16 Dapple Place",
    suburb: "Flat Bush",
    city: "Auckland",
    postcode: "2019",
    country: "New Zealand"
  },
  location: "Auckland, New Zealand"
};

const delay = (data = undefined, failed = false, error = false, duration = 2000) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (data === undefined) {
        return resolve({ status: "error", content: "No data output" });
      } else {
        if (!error && !failed) {
          return resolve({ status: "succeeded", content: data });
        } else {
          if (failed) {
            return resolve({ status: "failed", content: "Some failed message" });
          } else if (error) {
            return resolve({ status: "error", content: "Some error message" });
          }
        }
      }
    }, duration);
  })
}