import { getOrder } from '@/app/lib/shopify/admin/shopify-admin';
import { formatCurrency } from '@/app/lib/utils';
import Link from 'next/link';
import DataTable from '@/app/components/admin/DataTable';
import { OrderData } from '@/app/components/admin/types';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const shopifyId = `gid://shopify/Order/${id}`;
  const order = await getOrder(shopifyId);

  if (!order) {
    return (
      <div className="pt-20 bg-[#F7F7F7] min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4 justify-center items-center mb-10">
            <h1 className="text-[40px] font-darker-grotesque tracking-wider font-regular">Order Not Found</h1>
            <Link 
              href="/dashboard/orders"
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Transform the order to match 
  const transformedOrder: OrderData = {
    id: order.id,
    name: order.name,
    orderNumber: order.orderNumber,
    customer: order.customer ? {
      id: order.customer.id,
      firstName: order.customer.firstName || '',
      lastName: order.customer.lastName || '',
      email: order.customer.email || '',
      phone: order.customer.phone || ''
    } : null,
    totalPriceSet: order.totalPriceSet,
    createdAt: new Date(order.createdAt),
    displayFulfillmentStatus: order.displayFulfillmentStatus,
    displayFinancialStatus: order.displayFinancialStatus,
    billingAddress: order.billingAddress,
    shippingAddress: order.shippingAddress,
    discountApplications: order.discountApplications,
    shippingLine: order.shippingLine,
    paymentGatewayNames: order.paymentGatewayNames,
    fulfillments: order.fulfillments
  };

  return (
    <div className="pt-16 bg-white min-h-screen px-2 sm:px-4 md:px-6">
      <div className="w-full mx-auto px-2 sm:px-4">
        <div className="flex flex-col gap-2 sm:gap-4 justify-center items-center mb-4 sm:mb-7">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-darker-grotesque tracking-wider font-regular">Orders</h1>
        </div>

        <DataTable
          data={[{ node: transformedOrder }]}
          hasNextPage={false}
          endCursor=""
          baseUrl="/dashboard/orders"
          type="orders"
          hideActions={true}
        />

        <div className='flex flex-col lg:flex-row justify-between gap-3 sm:gap-4 lg:gap-8 mt-3 sm:mt-4'>
          <div className='h-auto w-full border-2 border-[#E0E0E0] rounded-2xl'>
            <div className='flex flex-row justify-start gap-3 sm:gap-4 lg:gap-8 h-full px-2 sm:px-3 md:px-6'>
              <div className='border-r-2 border-[#E0E0E0] pr-2 h-full flex flex-col py-3 sm:py-4 lg:py-6'>
                <div className='flex flex-col gap-2 sm:gap-3 lg:gap-4 h-full'>
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>First Name</p>
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>Last Name</p>
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>Email</p>  
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>Phone</p>
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>Billing Address</p>
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>Shipping Address</p>
                </div>
              </div>
              
              <div className='flex flex-col gap-2 sm:gap-3 lg:gap-4 h-full w-full py-3 sm:py-4 lg:py-6'>
                <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>{!transformedOrder.customer?.firstName ? '-' : transformedOrder.customer.firstName}</p>
                <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>{!transformedOrder.customer?.lastName ? '-' : transformedOrder.customer.lastName}</p>
                <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>{!transformedOrder.customer?.email ? '-' : transformedOrder.customer.email}</p>
                <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>{!transformedOrder.customer?.phone ? '-' : transformedOrder.customer.phone}</p>
                <div className='flex flex-col gap-1'>
                  <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>
                    {!transformedOrder.billingAddress?.address1 ? '-' : 
                      `${transformedOrder.billingAddress.address1} ${transformedOrder.billingAddress.city || ''} ${transformedOrder.billingAddress.province || ''}`
                    }
                  </p>
                  <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>
                    {!transformedOrder.billingAddress?.address1 ? '' : 
                      `${transformedOrder.billingAddress.zip || ''} ${transformedOrder.billingAddress.country || ''}`
                    }
                  </p>
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>
                    {!transformedOrder.shippingAddress?.address1 ? '-' : 
                      `${transformedOrder.shippingAddress.address1} ${transformedOrder.shippingAddress.city || ''} ${transformedOrder.shippingAddress.province || ''}`
                    }
                  </p>
                  <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>
                    {!transformedOrder.shippingAddress?.address1 ? '' : 
                      `${transformedOrder.shippingAddress.zip || ''} ${transformedOrder.shippingAddress.country || ''}`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full border-2 border-[#E0E0E0] rounded-2xl h-full'>
            <div className='flex flex-row justify-start gap-3 sm:gap-4 lg:gap-8 px-2 sm:px-3 md:px-6'>
              <div className='border-r-2 border-[#E0E0E0] pr-2 w-[60%] flex flex-col py-3 sm:py-4 lg:py-6'>
                <div className='flex flex-col gap-2 sm:gap-3 lg:gap-4'>
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>Discount Applied</p>
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>Shipping Fee</p>
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>Payment Method</p>
                  <p className='text-[#212121] font-semibold font-darker-grotesque text-sm sm:text-base lg:text-[26px]'>Tracking Number</p>
                </div>
              </div>
              
              <div className='flex flex-col gap-2 sm:gap-3 lg:gap-4 h-full w-full py-3 sm:py-4 lg:py-6'>
                <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>
                  {transformedOrder.discountApplications?.edges[0]?.node.code || '-'}
                </p>
                <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>
                  {transformedOrder.shippingLine ? formatCurrency(transformedOrder.shippingLine.price, transformedOrder.totalPriceSet.shopMoney.currencyCode) : '-'}
                </p>
                <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>
                  {transformedOrder.paymentGatewayNames?.[0] || '-'}
                </p>
                <p className='text-black text-sm sm:text-base lg:text-[26px] font-regular font-darker-grotesque break-words'>
                  {transformedOrder.fulfillments?.[0]?.trackingInfo.number || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 