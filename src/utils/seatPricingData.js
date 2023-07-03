// utils/seatPricingData.js
const seatPricingData = [
    { seatClass: 'A', minPrice: 397.61, normalPrice: 547.20, maxPrice: 0.0 },
    { seatClass: 'B', minPrice: 183.44, normalPrice: 441.65, maxPrice: 766.96 },
    { seatClass: 'C', minPrice: 158.47, normalPrice: 449.40, maxPrice: 678.55 },
    { seatClass: 'D', minPrice: 156.15, normalPrice: 263.73, maxPrice: 0.0 },
    { seatClass: 'E', minPrice: 274.52, normalPrice: 795.68, maxPrice: 0.0 },
    { seatClass: 'F', minPrice: 459.66, normalPrice: 694.75, maxPrice: 0.0 },
    { seatClass: 'G', minPrice: 296.21, normalPrice: 0.0, maxPrice: 0.0 },
    { seatClass: 'H', minPrice: 477.06, normalPrice: 0.0, maxPrice: 0.0 },
    { seatClass: 'I', minPrice: 451.84, normalPrice: 762.14, maxPrice: 0.0 },
    { seatClass: 'J', minPrice: 406.24, normalPrice: 868.71, maxPrice: 0.0 },
  ];
  
  module.exports = {
    getSeatPricingByClass: function (seatClass) {
      return seatPricingData.find((item) => item.seatClass === seatClass);
    },
  };
  