/**
 * Spawn a gradient pill that animates from a clicked add-to-cart button
 * to the cart icon in the Nav, then bumps the cart icon. Wired into
 * every Add-to-cart in PR 4.
 *
 * Requires:
 *  - The cart icon in Nav to have `id="cart-icon"`.
 *  - A `prefers-reduced-motion` check (we no-op when reduced).
 */
export function flyToCart(originEl: HTMLElement | null | undefined) {
  if (!originEl) return;
  if (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }
  const cartEl = document.getElementById("cart-icon");
  if (!cartEl) return;

  const origin = originEl.getBoundingClientRect();
  const cart = cartEl.getBoundingClientRect();

  const ghost = document.createElement("div");
  ghost.style.cssText = `
    position: fixed;
    left: ${origin.left + origin.width / 2 - 14}px;
    top: ${origin.top + origin.height / 2 - 14}px;
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--g-cta);
    box-shadow: var(--sh-sm);
    z-index: 200; pointer-events: none;
    transition: transform .8s var(--e-in-out), opacity .8s ease;
  `;
  document.body.appendChild(ghost);

  const dx =
    cart.left + cart.width / 2 - (origin.left + origin.width / 2);
  const dy =
    cart.top + cart.height / 2 - (origin.top + origin.height / 2);

  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.3)`;
    ghost.style.opacity = "0";
  });

  window.setTimeout(() => {
    ghost.remove();
    cartEl.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.2)" },
        { transform: "scale(1)" },
      ],
      { duration: 320, easing: "cubic-bezier(.34,1.56,.64,1)" }
    );
  }, 800);
}
