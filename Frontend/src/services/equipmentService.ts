import api from "./api";

export interface Equipment {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  pricePerHour: number;
  status: string;
  imageUrl: string;
  description: string;
}

class EquipmentService {
  async getEquipments(): Promise<Equipment[]> {
    const response = await api.get<Equipment[]>("/equipment");
    return response.data;
  }

  async getAvailableEquipments(date: string): Promise<Equipment[]> {
    const response = await api.get<Equipment[]>("/equipment");
    return response.data;
  }
}

const equipmentService = new EquipmentService();
export default equipmentService;
