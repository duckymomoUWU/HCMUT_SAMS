import api from "./api";

// Equipment object from populated response
export interface PopulatedEquipment {
  _id: string;
  name: string;
  type: string;
  pricePerHour: number;
}

export interface EquipmentRental {
  _id: string;
  userId: string;
  equipmentId: string | PopulatedEquipment; // Can be string or populated object
  quantity: number;
  rentalDate: string;
  duration: number;
  totalPrice: number;
  status: "renting" | "cancelled" | "completed";
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRentalData {
  userId: string;
  equipmentId: string;
  quantity: number;
  rentalDate: string;
  duration: number;
  totalPrice: number;
}

class EquipmentRentalService {
  async createRental(data: CreateRentalData): Promise<EquipmentRental> {
    const response = await api.post<EquipmentRental>("/equipment-rental", data);
    return response.data;
  }

  async getUserRentals(userId: string): Promise<EquipmentRental[]> {
    const response = await api.get<EquipmentRental[]>(
      `/equipment-rental?userId=${userId}`,
    );
    return response.data;
  }

  async returnEquipment(id: string): Promise<void> {
    await api.patch(`/equipment-rental/status/${id}`, { status: "completed" });
  }
}

const equipmentRentalService = new EquipmentRentalService();
export default equipmentRentalService;
