"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useCart } from "./cart-context";
import { createUrl } from "@/app/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Price from "@/app/components/client/Price";
import CloseCart from "./close-cart";
import { DEFAULT_OPTION } from "@/app/lib/constants";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-quantity-button";
import { useFormStatus } from "react-dom";
import LoadingDots from "@/app/components/client/loading-dots";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";

type MerchandiseSearchParams = {
  [key: string]: string;
};

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

// Custom hook to detect screen size
function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

export default function CartModal() {
  const { cart, updateCartItem, isCartOpen: isOpen, openCart, closeCart: onClose } = useCart();
  const [showSizeConfirmation, setShowSizeConfirmation] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const screenSize = useScreenSize();
  
  const openSizeConfirmation = () => setShowSizeConfirmation(true);
  const closeSizeConfirmation = () => setShowSizeConfirmation(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        openCart(); 
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [cart?.totalQuantity, isOpen, openCart]);

  // Get responsive styles based on screen size
  const getCartStyles = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          panel: "fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l p-4 backdrop-blur-xl border-neutral-700 bg-black/90 text-white md:w-full",
          header: "text-base font-semibold",
          image: "h-12 w-12",
          buttonText: "text-xs",
          spacing: "p-3",
          itemSpacing: "py-2 space-y-3"
        };
      case 'tablet':
        return {
          panel: "fixed bottom-0 right-0 top-0 flex h-full w-full max-w-sm flex-col border-l p-5 backdrop-blur-xl border-neutral-700 bg-black/85 text-white",
          header: "text-lg font-semibold",
          image: "h-14 w-14",
          buttonText: "text-sm",
          spacing: "p-4",
          itemSpacing: "py-3 space-y-4"
        };
      case 'desktop':
      default:
        return {
          panel: "fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l p-6 backdrop-blur-xl md:w-[390px] border-neutral-700 bg-black/80 text-white",
          header: "text-lg font-semibold",
          image: "h-16 w-16",
          buttonText: "text-sm",
          spacing: "p-6",
          itemSpacing: "py-4 space-y-4"
        };
    }
  };

  const styles = getCartStyles();

  return (
    <>
      {/* Main Cart Modal */}
      <Transition show={isOpen}>
        <Dialog onClose={onClose} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          
          <Transition.Child
  as={Fragment}
  enter="transition-all ease-in-out duration-300"
  enterFrom="translate-x-full"
  enterTo="translate-x-0"
  leave="transition-all ease-in-out duration-200"
  leaveFrom="translate-x-0"
  leaveTo="translate-x-full"
>
  <Dialog.Panel className={styles.panel}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <Image
                  src="/icons/checkoutwhite.svg"
                  alt="Cart"
                  width={screenSize === 'mobile' ? 20 : 24}
                  height={screenSize === 'mobile' ? 20 : 24}
                  className={`${screenSize === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'}`}
                />
                <p className={styles.header}>Your Luggage</p>
                <button aria-label="Close cart" onClick={onClose} className="hover:opacity-70 transition-opacity cursor-pointer">
                  <CloseCart />
                </button>
              </div>

              {/* Cart Content */}
              {!cart || cart.lines.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className={`${screenSize === 'mobile' ? 'text-xl' : 'text-2xl'} font-bold mb-4`}>
                      Your Cart is Empty
                    </p>
                    <button
                      onClick={onClose}
                      className={`px-6 py-2 bg-white text-black rounded-lg ${styles.buttonText} font-medium hover:bg-gray-100 transition-colors cursor-pointer`}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  {/* Cart Items */}
                  <ul className={`flex-grow overflow-auto ${styles.itemSpacing}`}>
                    {cart.lines
                      .sort((a, b) => {
                        const titleA = a.merchandise?.product?.title || '';
                        const titleB = b.merchandise?.product?.title || '';
                        return titleA.localeCompare(titleB);
                      })
                      .map((item, i) => {
                        const merchandiseSearchParams = {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(({ name, value }) => {
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[name.toLowerCase()] = value;
                          }
                        });

                        const merchandiseUrl = createUrl(
                          `/catalog/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );

                        return (
                          <li
                            key={i}
                            className="flex flex-col border-b border-neutral-700 pb-4"
                          >
                            {/* Delete Button */}
                            <div className="flex justify-end mb-2">
                              <DeleteItemButton
                                item={item}
                                optimisticUpdate={updateCartItem}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex gap-3">
                              <div className={`relative ${styles.image} overflow-hidden rounded-md border border-neutral-700 bg-neutral-900 flex-shrink-0`}>
                                <Image
                                  className="h-full w-full object-cover"
                                  width={screenSize === 'mobile' ? 48 : screenSize === 'tablet' ? 56 : 64}
                                  height={screenSize === 'mobile' ? 48 : screenSize === 'tablet' ? 56 : 64}
                                  alt={item.merchandise.product.featuredImage?.altText || item.merchandise.product.title || 'Product image'}
                                  src={item.merchandise.product.featuredImage?.url || '/placeholder.jpg'}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <Link
                                  href={merchandiseUrl}
                                  onClick={onClose}
                                  className="block hover:text-gray-300 transition-colors"
                                >
                                  <h3 className={`${screenSize === 'mobile' ? 'text-sm' : 'text-base'} font-medium leading-tight truncate`}>
                                    {item.merchandise.product.title || 'Product'}
                                  </h3>
                                  {item.merchandise.title !== DEFAULT_OPTION && (
                                    <p className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} text-neutral-400 mt-1`}>
                                      {item.merchandise.title}
                                    </p>
                                  )}
                                </Link>

                                {/* Price and Quantity */}
                                <div className="flex items-center justify-between mt-2">
                                  <Price
                                    className={`${styles.buttonText} font-medium`}
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={item.cost.totalAmount.currencyCode}
                                  />
                                  
                                  <div className={`flex items-center rounded-full border border-neutral-700 ${screenSize === 'mobile' ? 'h-7' : 'h-9'}`}>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="minus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                    <span className={`px-3 ${styles.buttonText}`}>
                                      {item.quantity}
                                    </span>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="plus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>

                  {/* Cart Summary */}
                  <div className={`${styles.buttonText} text-neutral-400 space-y-3 border-t border-neutral-700 pt-4`}>
                    <div className="flex items-center justify-between">
                      <p>Taxes</p>
                      <Price
                        className="text-white font-medium"
                        amount={cart.cost.totalTaxAmount.amount}
                        currencyCode={cart.cost.totalTaxAmount.currencyCode}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p>Shipping</p>
                      <p>Calculated at checkout</p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-neutral-700 pt-3">
                      <p className="font-medium">Total</p>
                      <Price
                        className="text-white font-semibold text-base"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    className={`mt-4 w-full rounded-lg bg-white text-black font-medium opacity-90 hover:opacity-100 transition-opacity ${screenSize === 'mobile' ? 'py-3 text-sm' : 'py-3 text-sm'}`}
                    onClick={openSizeConfirmation}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Size Confirmation Modal */}
      <Transition show={showSizeConfirmation}>
        <Dialog onClose={closeSizeConfirmation} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          </Transition.Child>
          
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className={`fixed left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-[#212121] text-white shadow-xl ${
              screenSize === 'mobile' 
                ? 'max-w-sm mx-4 p-4' 
                : screenSize === 'tablet'
                ? 'max-w-md mx-4 p-5'
                : 'max-w-md p-6'
            }`}>
              <div className="flex flex-col items-center">
                <Dialog.Title className={`${screenSize === 'mobile' ? 'text-base' : 'text-lg'} font-medium leading-6 text-center`}>
                  Confirm Your Sizes
                </Dialog.Title>
                
                <div className="mt-4 text-center w-full">
                  <p className={`${styles.buttonText} text-gray-300`}>
                    Please confirm that you&apos;ve selected the correct sizes for all items in your cart.
                  </p>

                  <div className={`mt-4 ${screenSize === 'mobile' ? 'max-h-32' : 'max-h-40'} overflow-y-auto`}>
                    {cart?.lines.map((item, i) => {
                      const sizeOption = item.merchandise.selectedOptions.find(
                        (option) => option.name.toLowerCase() === "size"
                      );

                      return (
                        <div
                          key={i}
                          className="mb-2 flex items-center justify-between border-b border-neutral-700 pb-2 text-left"
                        >
                          <span className={`${styles.buttonText} font-medium truncate pr-2`}>
                            {item.merchandise.product.title}
                          </span>
                          <span className={`${styles.buttonText} text-gray-300 flex-shrink-0`}>
                            {sizeOption ? `Size: ${sizeOption.value}` : "No size selected"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Size Guide Link */}
                  <div className="mt-4 flex items-center justify-center">
                    <Link
                      href="/size-guide"
                      className={`group flex items-center gap-1 ${styles.buttonText} text-gray-300 transition-colors hover:text-white`}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:scale-110 flex-shrink-0"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      <span className="border-b border-gray-500 group-hover:border-white">
                        View our size guide
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={`mt-6 flex w-full ${screenSize === 'mobile' ? 'flex-col gap-3' : 'justify-between space-x-4'}`}>
                  <button
                    className={`${screenSize === 'mobile' ? 'w-full' : 'flex-1'} rounded-lg border border-neutral-700 py-2 ${styles.buttonText} hover:border-neutral-500 transition-colors`}
                    onClick={closeSizeConfirmation}
                  >
                    Go Back
                  </button>
                  <form action={redirectToCheckout} className={screenSize === 'mobile' ? 'w-full' : 'flex-1'}>
                    <CheckoutButton onClick={closeSizeConfirmation} screenSize={screenSize} />
                  </form>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CheckoutButton({ onClick, screenSize }: { onClick: () => void; screenSize: ScreenSize }) {
  const { pending } = useFormStatus();
  
  const buttonText = screenSize === 'mobile' ? 'text-sm' : 'text-sm';

  return (
    <button
      className={`w-full rounded-lg py-2 text-center font-medium bg-white text-black opacity-90 hover:opacity-100 transition-opacity ${buttonText}`}
      type="submit"
      disabled={pending}
      onClick={onClick}
    >
      {pending ? <LoadingDots className="bg-black" /> : "Confirm & Checkout"}
    </button>
  );
}