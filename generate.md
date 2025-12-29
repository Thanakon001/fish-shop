**Role:**
Act as a Senior Frontend Developer specializing in Nuxt 3, Tailwind CSS, and DaisyUI.

**Project:**
Build a "Mini Restaurant POS System" for a small Isan (Thai Northeastern) restaurant named **"อีสานกินแหลก" (Isan Kin Laek)**.

**Tech Stack:**

1.  **Framework:** Nuxt 3 (latest stable version).
2.  **Styling:** Tailwind CSS + DaisyUI.
3.  **Icons:** Lucide-vue-next or Heroicons.
4.  **Database:** `localStorage` only (No backend).
5.  **State Management:** Use Nuxt `composables` (`useState`) with logic to persist data to `localStorage`.

**Core Features & Pages:**

1.  **State Management (Composables):**

    - `useMenu`: Manage food items (id, name, price, category, image_url). Pre-fill with dummy Isan food data (e.g., Som Tum, Grilled Chicken, Sticky Rice) if storage is empty.
    - `useCart`: Manage current order (add item, remove item, update quantity, clear cart).
    - `useBills`: Save completed orders to history (id, timestamp, items, total_price).

2.  **Page 1: POS / Order Taking (`/` - Index Page)**

    - **Layout:** Split screen.
      - **Left (Menu Grid):** Show food items with photos, names, and prices. Filter by category if possible.
      - **Right (Cart):** Summary of selected items, quantities, total price, and a "Confirm Payment" (บันทึกรายการ) button.
    - **Action:** When "Confirm Payment" is clicked, save the order to `useBills`, clear the cart, and show a success alert.

3.  **Page 2: Menu Management (`/admin/menu`)**

    - A table listing all current menu items.
    - A form to Add/Edit menu items (Name, Price, Category, Image URL).
    - Ability to Delete items.

4.  **Page 3: Bill History (`/admin/bills`)**
    - Display a list of past transactions (Date/Time, Total Price, Detail button).
    - Show a simple "Daily Total" summary at the top.

**UI/UX Requirements:**

- **Theme:** Use a warm/spicy color theme suitable for an Isan restaurant (Orange/Red/Yellow tones).
- **Language:** The User Interface (labels, buttons, placeholders) must be in **THAI (ภาษาไทย)**.
- **Responsiveness:** Must work well on iPad/Tablet sizes.

**Output:**
Please provide the full file structure and code for:

1.  `nuxt.config.ts` (setup Tailwind/DaisyUI).
2.  `composables/useRestaurantStore.ts` (Logic for Menu, Cart, and Bills with LocalStorage).
3.  `layouts/default.vue` (Navbar with links to POS, Menu, History).
4.  `pages/index.vue` (The POS interface).
5.  `pages/admin/menu.vue`.
6.  `pages/admin/bills.vue`.

Ensure the code is clean, copy-paste ready, and error-free.
l
