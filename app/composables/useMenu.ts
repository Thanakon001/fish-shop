// Composable สำหรับจัดการเมนูปลา/อาหารทะเล
export interface MenuItem {
  id: string;
  name: string;
  pricePerKg: number;
  category: string;
  imageUrl: string;
}

const STORAGE_KEY = "fish-shop-menu";

// ข้อมูลปลา/อาหารทะเลตัวอย่าง
const defaultMenu: MenuItem[] = [
  {
    id: "1",
    name: "ปลานิล",
    pricePerKg: 80,
    category: "ปลาน้ำจืด",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
  },
  {
    id: "2",
    name: "ปลาทับทิม",
    pricePerKg: 120,
    category: "ปลาน้ำจืด",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
  },
  {
    id: "3",
    name: "ปลาช่อน",
    pricePerKg: 150,
    category: "ปลาน้ำจืด",
    imageUrl:
      "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400",
  },
  {
    id: "4",
    name: "ปลาดุก",
    pricePerKg: 70,
    category: "ปลาน้ำจืด",
    imageUrl:
      "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400",
  },
  {
    id: "5",
    name: "ปลากะพงขาว",
    pricePerKg: 280,
    category: "ปลาทะเล",
    imageUrl:
      "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400",
  },
  {
    id: "6",
    name: "ปลาเก๋า",
    pricePerKg: 350,
    category: "ปลาทะเล",
    imageUrl:
      "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400",
  },
  {
    id: "7",
    name: "ปลาทู",
    pricePerKg: 100,
    category: "ปลาทะเล",
    imageUrl:
      "https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?w=400",
  },
  {
    id: "8",
    name: "กุ้งขาว",
    pricePerKg: 250,
    category: "กุ้ง",
    imageUrl:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400",
  },
  {
    id: "9",
    name: "กุ้งก้ามกราม",
    pricePerKg: 450,
    category: "กุ้ง",
    imageUrl:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400",
  },
  {
    id: "10",
    name: "หอยแมลงภู่",
    pricePerKg: 80,
    category: "หอย",
    imageUrl:
      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400",
  },
  {
    id: "11",
    name: "หอยนางรม",
    pricePerKg: 180,
    category: "หอย",
    imageUrl:
      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400",
  },
  {
    id: "12",
    name: "ปลาหมึกกล้วย",
    pricePerKg: 200,
    category: "ปลาหมึก",
    imageUrl:
      "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400",
  },
  {
    id: "13",
    name: "ปลาหมึกสาย",
    pricePerKg: 180,
    category: "ปลาหมึก",
    imageUrl:
      "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400",
  },
  {
    id: "14",
    name: "ปูม้า",
    pricePerKg: 320,
    category: "ปู",
    imageUrl: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400",
  },
];

export const useMenu = () => {
  const menu = useState<MenuItem[]>("menu", () => []);

  // โหลดข้อมูลจาก localStorage
  const loadMenu = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        menu.value = JSON.parse(stored);
      } else {
        // ใช้ข้อมูลตัวอย่าง
        menu.value = defaultMenu;
        saveMenu();
      }
    }
  };

  // บันทึกลง localStorage
  const saveMenu = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menu.value));
    }
  };

  // เพิ่มเมนู
  const addItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    menu.value.push(newItem);
    saveMenu();
  };

  // อัพเดทเมนู
  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    const index = menu.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      menu.value[index] = { ...menu.value[index], ...updates };
      saveMenu();
    }
  };

  // ลบเมนู
  const deleteItem = (id: string) => {
    menu.value = menu.value.filter((item) => item.id !== id);
    saveMenu();
  };

  // ดึงหมวดหมู่ทั้งหมด
  const categories = computed(() => {
    return [...new Set(menu.value.map((item) => item.category))];
  });

  // กรองตามหมวดหมู่
  const getByCategory = (category: string | null) => {
    if (!category) return menu.value;
    return menu.value.filter((item) => item.category === category);
  };

  return {
    menu,
    categories,
    loadMenu,
    addItem,
    updateItem,
    deleteItem,
    getByCategory,
  };
};
