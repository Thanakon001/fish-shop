// Composable สำหรับจัดการตะกร้าสินค้า (แบบชั่งกิโล)
import type { MenuItem } from './useMenu'

export interface CartItem extends MenuItem {
  weight: number // น้ำหนักเป็น kg
}

export const useCart = () => {
  const cart = useState<CartItem[]>('cart', () => [])

  // เพิ่มสินค้าลงตะกร้า (พร้อมน้ำหนัก)
  const addToCart = (item: MenuItem, weight: number) => {
    if (weight <= 0) return
    
    const existingItem = cart.value.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      // ถ้ามีอยู่แล้ว เพิ่มน้ำหนักเข้าไป
      existingItem.weight = Number((existingItem.weight + weight).toFixed(2))
    } else {
      cart.value.push({ ...item, weight: Number(weight.toFixed(2)) })
    }
  }

  // ลบสินค้าออกจากตะกร้า
  const removeFromCart = (id: string) => {
    cart.value = cart.value.filter(item => item.id !== id)
  }

  // อัพเดทน้ำหนัก
  const updateWeight = (id: string, weight: number) => {
    const item = cart.value.find(cartItem => cartItem.id === id)
    if (item) {
      if (weight <= 0) {
        removeFromCart(id)
      } else {
        item.weight = Number(weight.toFixed(2))
      }
    }
  }

  // เพิ่มน้ำหนัก 0.5 kg
  const incrementWeight = (id: string) => {
    const item = cart.value.find(cartItem => cartItem.id === id)
    if (item) {
      item.weight = Number((item.weight + 0.5).toFixed(2))
    }
  }

  // ลดน้ำหนัก 0.5 kg
  const decrementWeight = (id: string) => {
    const item = cart.value.find(cartItem => cartItem.id === id)
    if (item) {
      if (item.weight <= 0.5) {
        removeFromCart(id)
      } else {
        item.weight = Number((item.weight - 0.5).toFixed(2))
      }
    }
  }

  // ล้างตะกร้า
  const clearCart = () => {
    cart.value = []
  }

  // คำนวณราคารวม (ราคา/กก. × น้ำหนัก)
  const total = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.pricePerKg * item.weight, 0)
  })

  // น้ำหนักรวมทั้งหมด
  const totalWeight = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.weight, 0)
  })

  // จำนวนรายการทั้งหมด
  const itemCount = computed(() => {
    return cart.value.length
  })

  return {
    cart,
    total,
    totalWeight,
    itemCount,
    addToCart,
    removeFromCart,
    updateWeight,
    incrementWeight,
    decrementWeight,
    clearCart
  }
}
