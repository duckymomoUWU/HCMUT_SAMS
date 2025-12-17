import api from "@/lib/Axios";

export interface EquipmentRental {
  _id: string;
  userId: string;
  equipmentId: {
    _id: string;
    name: string;
    type: string;
    imageUrl: string;
    pricePerHour: number;
  };
  items: string[]; // Array of EquipmentItem IDs
  rentalDate: string;
  duration: number; // hours
  totalPrice: number;
  status: "renting" | "completed" | "cancelled";
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRentalDTO {
  equipmentId: string;
  items: string[]; // Array of selected item IDs
  rentalDate: Date;
  duration: number; // number of hours
  totalPrice: number;
}

class EquipmentRentalService {
  async createRental(data: CreateRentalDTO): Promise<{ rental: EquipmentRental }> {
    const response = await api.post("/equipment-rental", data);
    return response.data;
  }

  async getMyRentals(): Promise<EquipmentRental[]> {
    const response = await api.get("/equipment-rental/my-rentals");
    return response.data;
  }

  async getRentalById(id: string): Promise<EquipmentRental> {
    const response = await api.get(`/equipment-rental/${id}`);
    return response.data;
  }

  async cancelRental(id: string): Promise<EquipmentRental> {
    const response = await api.patch(`/equipment-rental/${id}/cancel`);
    return response.data;
  }

  async extendRental(id: string, additionalHours: number): Promise<EquipmentRental> {
    const response = await api.patch(`/equipment-rental/${id}/extend`, {
      additionalHours,
    });
    return response.data;
  }
}

const equipmentRentalService = new EquipmentRentalService();
export default equipmentRentalService;