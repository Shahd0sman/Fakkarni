import api from "./api";

export const documentService = {
  async getDocuments() {
    const response = await api.get("/documents");
    return response.data;
  },

  async createDocument(data) {
    let payload = data;
    let headers = {};

    if (!(data instanceof FormData)) {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
          payload.append(key, data[key]);
        }
      });
      headers["Content-Type"] = "multipart/form-data";
    }

    const response = await api.post("/documents", payload, { headers });
    return response.data;
  },

  async updateDocument(id, data) {
    let payload = data;
    let headers = {};

    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else if (data.file instanceof File) {
      payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
          payload.append(key, data[key]);
        }
      });
      headers["Content-Type"] = "multipart/form-data";
    }

    const response = await api.patch(`/documents/${id}`, payload, { headers });
    return response.data;
  },

  async deleteDocument(id) {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

export default documentService;

