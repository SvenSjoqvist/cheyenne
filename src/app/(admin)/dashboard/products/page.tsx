import AddProductForm from '@/app/components/admin/AddProductForm';


export default async function ProductsPage({
}) {

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <AddProductForm />
    </div>
  );
}