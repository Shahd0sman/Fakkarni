import api from "./api";

export const billsService = {
  async getBills() {
    const response = await api.get("/bills");
    return response.data;
  },

  async createBill(billData) {
    const response = await api.post("/bills", billData);
    return response.data;
  },

  async updateBill(id, billData) {
    const response = await api.patch(`/bills/${id}`, billData);
    return response.data;
  },

  async deleteBill(id) {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  },
};

export default billsService;

