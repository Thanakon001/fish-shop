// Composable สำหรับจัดการประวัติบิล
import type { CartItem } from './useCart'

export interface Bill {
  id: string
  timestamp: number
  items: CartItem[]
  totalPrice: number
}

const STORAGE_KEY = 'isan-bills'

export const useBills = () => {
  const bills = useState<Bill[]>('bills', () => [])

  // โหลดข้อมูลจาก localStorage
  const loadBills = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        bills.value = JSON.parse(stored)
      }
    }
  }

  // บันทึกลง localStorage
  const saveBills = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bills.value))
    }
  }

  // สร้างบิลใหม่
  const createBill = (items: CartItem[], totalPrice: number) => {
    const newBill: Bill = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      items: [...items],
      totalPrice
    }
    bills.value.unshift(newBill)
    saveBills()
    return newBill
  }

  // ลบบิล
  const deleteBill = (id: string) => {
    bills.value = bills.value.filter(bill => bill.id !== id)
    saveBills()
  }

  // คำนวณยอดรวมรายวัน
  const dailyTotal = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.getTime()

    return bills.value
      .filter(bill => bill.timestamp >= todayStart)
      .reduce((sum, bill) => sum + bill.totalPrice, 0)
  })

  // จำนวนบิลวันนี้
  const todayBillCount = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.getTime()

    return bills.value.filter(bill => bill.timestamp >= todayStart).length
  })

  // Format วันที่แบบไทย
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format ราคา
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(price)
  }

  return {
    bills,
    dailyTotal,
    todayBillCount,
    loadBills,
    createBill,
    deleteBill,
    formatDate,
    formatPrice
  }
}
