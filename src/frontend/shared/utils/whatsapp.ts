import { CartItem } from "../../features/cart/types/cart.types";

// const PHONE_NUMBER = '573118047047';
const PHONE_NUMBER = '573156053693';

export const buildWhatsAppUrl = (items: CartItem[], total: number): string => {
  const lineItems = items
    .map(
      (item, index) =>
        `${index + 1}. *${item.product.name}*\n` +
        `   • Cantidad: ${item.quantity}\n` +
        `   • Subtotal: $${(item.product.price * item.quantity).toLocaleString('es-CO')} COP`
    )
    .join('\n\n');

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const message =
    `¡Hola *Verdicienta*! 🌿✨\n\n` +
    `Me gustaría realizar el siguiente pedido:\n\n` +
    `${lineItems}\n\n` +
    `-----------------------------------\n` +
    `📦 *Total de productos:* ${totalItemsCount} unidad(es)\n` +
    `💰 *Monto Total:* $${total.toLocaleString('es-CO')} COP\n` +
    `-----------------------------------\n\n` +
    `Quedo atento(a) para coordinar el pago y el envío. ¡Muchas gracias!`;

  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
};