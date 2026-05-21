import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { BadgeCheck, ShoppingBag } from 'lucide-vue-next'

export class PurchaseMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'admin') {
      return this.buildMainMenu(menu)
    }

    return menu
  }

  private buildMainMenu(menu: MenuItemConfig): MenuItemConfig {
    const purchaseSection: MenuItemConfig = {
      id: 'purchase-management',
      title: 'Beszerzes',
      icon: ShoppingBag,
      order: 41,
      children: [
        {
          id: 'purchases',
          title: 'Beszerzesek',
          icon: ShoppingBag,
          path: '/admin/purchase',
          order: 10,
        },
        {
          id: 'purchase-statuses',
          title: 'Statuszok',
          icon: BadgeCheck,
          path: '/admin/purchase-status',
          order: 20,
        },
      ],
    }

    this.addMenuItem(menu, purchaseSection)

    return menu
  }
}

export const purchaseMenuBuilder = new PurchaseMenuBuilder()

