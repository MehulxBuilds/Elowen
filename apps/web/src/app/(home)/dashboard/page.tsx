import { redirect } from "next/navigation";

const DashboardPage = () => {
  return redirect('/dashboard/settings');
}

export default DashboardPage;