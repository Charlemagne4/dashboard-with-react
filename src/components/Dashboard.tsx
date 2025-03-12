import Sidebar from './Sidebar';
import Table from './Table';

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1">
        <Table />
      </div>
    </div>
  );
}
export default Dashboard;
