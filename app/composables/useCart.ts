// Composable สำหรับจัดการตะกร้าสินค้า
import type { MenuItem } from './useMenu'

export interface CartItem extends MenuItem {
  quantity: number
}

export const useCart = () => {
  const cart = useState<CartItem[]>('cart', () => [])

  // เพิ่มสินค้าลงตะกร้า
  const addToCart = (item: MenuItem) => {
    const existingItem = cart.value.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.push({ ...item, quantity: 1 })
    }
  }

  // ลบสินค้าออกจากตะกร้า
  const removeFromCart = (id: string) => {
    cart.value = cart.value.filter(item => item.id !== id)
  }

  // อัพเดทจำนวน
  const updateQuantity = (id: string, quantity: number) => {
    const item = cart.value.find(cartItem => cartItem.id === id)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(id)
      } else {
        item.quantity = quantity
      }
    }
  }

  // เพิ่มจำนวน
  const incrementQuantity = (id: string) => {
    const item = cart.value.find(cartItem => cartItem.id === id)
    if (item) {
      item.quantity++
    }
  }

  // ลดจำนวน
  const decrementQuantity = (id: string) => {
    const item = cart.value.find(cartItem => cartItem.id === id)
    if (item) {
      if (item.quantity <= 1) {
        removeFromCart(id)
      } else {
        item.quantity--
      }
    }
  }

  // ล้างตะกร้า
  const clearCart = () => {
    cart.value = []
  }

  // คำนวณราคารวม
  const total = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  // จำนวนรายการทั้งหมด
  const itemCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  return {
    cart,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart
  }
}
