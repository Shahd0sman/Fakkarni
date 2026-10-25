import api from "./api";

export const reminderService = {
  async getReminders() {
    const response = await api.get("/reminders");
    return response.data;
  },

  async createReminder(reminderData) {
    const response = await api.post("/reminders", reminderData);
    return response.data;
  },

  async deleteReminder(id) {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  },
};

export default reminderService;

