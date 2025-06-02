"use client";

import { ProductOption, ProductVariant } from "@/app/lib/shopify/types";
import { useProduct, useUpdateURL } from "./product-context";
import clsx from "clsx";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export default function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  
  // Add null checks for options and variants
  if (!options || !variants || options.length === 0 || variants.length === 0) {
    return null;
  }
  
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => {
    // Add null check for selectedOptions
    const selectedOptions = variant.selectedOptions || [];
    const optionsObj = selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {}
    );
    
    return {
      id: variant.id,
      availableForSale: variant.availableForSale,
      ...optionsObj,
    };
  });

  return options.map((option) => (
    <form key={option.id}>
      <dl className="mb-8">
        <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Check if any variant with this option value is available
            // If no combinations exist, default to available to prevent blocking
            const isAvailableForSale = combinations.length === 0 ? true : combinations.some((combination) => {
              const hasOptionValue = combination[optionNameLowerCase] === value;
              const isAvailable = combination.availableForSale === true;
              return hasOptionValue && isAvailable;
            });

            // The option is active if it's in the selected options
            const isActive = state[optionNameLowerCase] === value;

            return (
              <button
                formAction={() => {
                  const newState = updateOption(optionNameLowerCase, value);
                  updateURL(newState);
                }}
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${
                  !isAvailableForSale ? " (Out of Stock)" : ""
                }`}
                className={clsx(
                  "flex min-w-[48px] items-center justify-center rounded-full border px-2 py-1 text-sm transition-colors duration-300 ease-in-out cursor-pointer",
                  {
                    // Selected option: reduced background opacity
                    "bg-opacity-50 bg-neutral-300": isActive,
                    // Non-selected options: white background
                    "bg-white hover:bg-neutral-100":
                      !isActive && isAvailableForSale,
                    // Out-of-stock options: grayed out
                    "cursor-not-allowed bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700":
                      !isAvailableForSale,
                  }
                )}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
