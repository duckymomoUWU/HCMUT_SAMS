import api from "./api";

export interface Equipment {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  pricePerHour: number;
  available: boolean;
  imageUrl: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EquipmentItem {
  _id: string;
  equipment: string;
  status: "available" | "rented" | "maintenance" | "broken";
  serialNumber?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EquipmentWithItems extends Equipment {
  items?: EquipmentItem[];
}

export interface EquipmentStats {
  totalTypes: number;
  totalQuantity: number;
  availableCount: number;
  rentedCount: number;
  maintenanceCount: number;
  brokenCount: number;
}

class EquipmentService {
  async getEquipments(): Promise<Equipment[]> {
    const response = await api.get<Equipment[]>("/equipment");
    return response.data;
  }

  async getEquipmentItems(): Promise<EquipmentItem[]> {
    const response = await api.get<EquipmentItem[]>("/equipment-items");
    return response.data;
  }

  async getEquipmentById(id: string): Promise<Equipment> {
    const response = await api.get<Equipment>(`/equipment/${id}`);
    return response.data;
  }

  async getEquipmentWithItems(id: string): Promise<EquipmentWithItems> {
    const response = await api.get<EquipmentWithItems>(
      `/equipment/with-items/${id}`,
    );
    return response.data;
  }

  async createEquipment(data: Partial<Equipment>): Promise<Equipment> {
    const response = await api.post<Equipment>("/equipment", data);
    return response.data;
  }

  async updateEquipment(
    id: string,
    data: Partial<Equipment>,
  ): Promise<Equipment> {
    const response = await api.patch<Equipment>(`/equipment/${id}`, data);
    return response.data;
  }

  async deleteEquipment(id: string): Promise<void> {
    await api.delete(`/equipment/${id}`);
  }

  async getAvailableEquipments(): Promise<Equipment[]> {
    const response = await api.get<Equipment[]>("/equipment");
    return response.data.filter((e) => e.available);
  }

  // Get stats about equipment
  getEquipmentStats(
    equipments: Equipment[],
    items: EquipmentItem[],
  ): EquipmentStats {
    return {
      totalTypes: equipments.length,
      totalQuantity: equipments.reduce((sum, e) => sum + e.quantity, 0),
      availableCount: items.filter((i) => i.status === "available").length,
      rentedCount: items.filter((i) => i.status === "rented").length,
      maintenanceCount: items.filter((i) => i.status === "maintenance").length,
      brokenCount: items.filter((i) => i.status === "broken").length,
    };
  }

  // Group items by equipment
  groupItemsByEquipment(
    items: EquipmentItem[],
  ): Record<string, EquipmentItem[]> {
    return items.reduce(
      (acc, item) => {
        if (!acc[item.equipment]) {
          acc[item.equipment] = [];
        }
        acc[item.equipment].push(item);
        return acc;
      },
      {} as Record<string, EquipmentItem[]>,
    );
  }

  async updateEquipmentItem(
    id: string,
    data: Partial<EquipmentItem>,
  ): Promise<EquipmentItem> {
    const response = await api.patch<EquipmentItem>(
      `/equipment-items/${id}`,
      data,
    );
    return response.data;
  }
}

const equipmentService = new EquipmentService();
export default equipmentService;
