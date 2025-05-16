import ListingDetailsPage from "@/components/listing-client";
import { fetchCarById } from "@/server actions/actions";

const page = async ({ params }: { params: Promise<{ _id: string }> }) => {
  const { _id } = await params;
  const car = await fetchCarById(_id);
  console.log("This is the car for the car detials: ", car);
  return (
    <ListingDetailsPage car={car}/>
  );
};

export default page;
