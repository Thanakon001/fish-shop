// Composable สำหรับจัดการเมนูอาหาร
export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  imageUrl: string
}

const STORAGE_KEY = 'isan-menu'

// ข้อมูลอาหารอีสานตัวอย่าง
const defaultMenu: MenuItem[] = [
  {
    id: '1',
    name: 'ส้มตำไทย',
    price: 45,
    category: 'ยำ/ส้มตำ',
    imageUrl: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400'
  },
  {
    id: '2',
    name: 'ส้มตำปูปลาร้า',
    price: 55,
    category: 'ยำ/ส้มตำ',
    imageUrl: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400'
  },
  {
    id: '3',
    name: 'ไก่ย่าง',
    price: 150,
    category: 'ของย่าง',
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400'
  },
  {
    id: '4',
    name: 'คอหมูย่าง',
    price: 120,
    category: 'ของย่าง',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76978e8e4d6?w=400'
  },
  {
    id: '5',
    name: 'ข้าวเหนียว',
    price: 10,
    category: 'ข้าว',
    imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400'
  },
  {
    id: '6',
    name: 'ลาบหมู',
    price: 60,
    category: 'ลาบ/น้ำตก',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400'
  },
  {
    id: '7',
    name: 'น้ำตกหมู',
    price: 65,
    category: 'ลาบ/น้ำตก',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400'
  },
  {
    id: '8',
    name: 'ต้มแซ่บซี่โครงหมู',
    price: 80,
    category: 'ต้ม/แกง',
    imageUrl: 'https://images.unsplash.com/photo-1547928576-b822bc410e51?w=400'
  },
  {
    id: '9',
    name: 'แกงอ่อมหมู',
    price: 70,
    category: 'ต้ม/แกง',
    imageUrl: 'https://images.unsplash.com/photo-1547928576-b822bc410e51?w=400'
  },
  {
    id: '10',
    name: 'ไข่ดาว',
    price: 15,
    category: 'เครื่องเคียง',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400'
  },
  {
    id: '11',
    name: 'ผักสด',
    price: 20,
    category: 'เครื่องเคียง',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'
  },
  {
    id: '12',
    name: 'น้ำเปล่า',
    price: 10,
    category: 'เครื่องดื่ม',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400'
  },
  {
    id: '13',
    name: 'น้ำอัดลม',
    price: 20,
    category: 'เครื่องดื่ม',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400'
  },
  {
    id: '14',
    name: 'ชามะนาว',
    price: 25,
    category: 'เครื่องดื่ม',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'
  }
]

export const useMenu = () => {
  const menu = useState<MenuItem[]>('menu', () => [])

  // โหลดข้อมูลจาก localStorage
  const loadMenu = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        menu.value = JSON.parse(stored)
      } else {
        // ใช้ข้อมูลตัวอย่าง
        menu.value = defaultMenu
        saveMenu()
      }
    }
  }

  // บันทึกลง localStorage
  const saveMenu = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menu.value))
    }
  }

  // เพิ่มเมนู
  const addItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString()
    }
    menu.value.push(newItem)
    saveMenu()
  }

  // อัพเดทเมนู
  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    const index = menu.value.findIndex(item => item.id === id)
    if (index !== -1) {
      menu.value[index] = { ...menu.value[index], ...updates }
      saveMenu()
    }
  }

  // ลบเมนู
  const deleteItem = (id: string) => {
    menu.value = menu.value.filter(item => item.id !== id)
    saveMenu()
  }

  // ดึงหมวดหมู่ทั้งหมด
  const categories = computed(() => {
    return [...new Set(menu.value.map(item => item.category))]
  })

  // กรองตามหมวดหมู่
  const getByCategory = (category: string | null) => {
    if (!category) return menu.value
    return menu.value.filter(item => item.category === category)
  }

  return {
    menu,
    categories,
    loadMenu,
    addItem,
    updateItem,
    deleteItem,
    getByCategory
  }
}
