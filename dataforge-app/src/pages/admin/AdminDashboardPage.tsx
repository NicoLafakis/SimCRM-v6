import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col">
        <div className="flex h-full grow flex-row">
          <aside className="flex h-full flex-col w-64 bg-white dark:bg-background-dark border-r border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-4 p-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
              <nav className="flex flex-col gap-2">
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary dark:bg-primary/20" href="#">
                  <span className="material-symbols-outlined">dashboard</span>
                  <span className="text-sm font-medium">Dashboard</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" href="#">
                  <span className="material-symbols-outlined">group</span>
                  <span className="text-sm font-medium">Users</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" href="#">
                  <span className="material-symbols-outlined">settings</span>
                  <span className="text-sm font-medium">Settings</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" href="#">
                  <span className="material-symbols-outlined">monitoring</span>
                  <span className="text-sm font-medium">Activity</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" href="#">
                  <span className="material-symbols-outlined">description</span>
                  <span className="text-sm font-medium">Logs</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" href="#">
                  <span className="material-symbols-outlined">credit_card</span>
                  <span className="text-sm font-medium">Credits</span>
                </a>
              </nav>
            </div>
          </aside>
          <main className="flex-1 overflow-x-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Management</h2>
                <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th className="px-6 py-3">User</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">Role</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['Liam Harper', 'liam.harper@example.com', 'Admin', 'Active'],
                          ['Olivia Bennett', 'olivia.bennett@example.com', 'User', 'Active'],
                          ['Noah Carter', 'noah.carter@example.com', 'User', 'Inactive'],
                          ['Ava Mitchell', 'ava.mitchell@example.com', 'User', 'Active'],
                          ['Ethan Parker', 'ethan.parker@example.com', 'User', 'Active'],
                        ].map((row) => (
                          <tr key={row[1]} className="bg-white dark:bg-background-dark border-b dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{row[0]}</td>
                            <td className="px-6 py-4">{row[1]}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{row[2]}</span></td>
                            <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{row[3]}</span></td>
                            <td className="px-6 py-4"><a className="font-medium text-primary hover:underline" href="#">Edit</a> | <a className="font-medium text-red-600 dark:text-red-500 hover:underline" href="#">Delete</a></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4"><button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Add User</button></div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-background-dark p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="appName">Application Name</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" id="appName" type="text" />
                  </div>
                  <div className="bg-white dark:bg-background-dark p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="apiKey">API Key</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" id="apiKey" type="text" />
                  </div>
                </div>
                <div className="mt-6"><button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Save Settings</button></div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Activity Monitoring</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-background-dark p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Data Generated</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">12,345</p>
                  </div>
                  <div className="bg-white dark:bg-background-dark p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">25</p>
                  </div>
                  <div className="bg-white dark:bg-background-dark p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Errors</h3>
                    <p className="mt-2 text-3xl font-semibold text-red-600 dark:text-red-500">5</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Logs and Error Reports</h2>
                <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th className="px-6 py-3">Timestamp</th>
                          <th className="px-6 py-3">User</th>
                          <th className="px-6 py-3">Action</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white dark:bg-background-dark border-b dark:border-gray-700">
                          <td className="px-6 py-4">2024-01-15 10:00</td>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Liam Harper</td>
                          <td className="px-6 py-4">Data Generation</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Success</span></td>
                        </tr>
                        <tr className="bg-white dark:bg-background-dark border-b dark:border-gray-700">
                          <td className="px-6 py-4">2024-01-15 10:05</td>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Olivia Bennett</td>
                          <td className="px-6 py-4">User Login</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Success</span></td>
                        </tr>
                        <tr className="bg-white dark:bg-background-dark">
                          <td className="px-6 py-4">2024-01-15 10:10</td>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Noah Carter</td>
                          <td className="px-6 py-4">Data Generation</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Error</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4"><button className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">View Full Logs</button></div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Credits</h2>
                <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th className="px-6 py-3">User</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">Credits</th>
                          <th className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white dark:bg-background-dark border-b dark:border-gray-700">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Liam Harper</td>
                          <td className="px-6 py-4">liam.harper@example.com</td>
                          <td className="px-6 py-4">1000</td>
                          <td className="px-6 py-4"><a className="font-medium text-primary hover:underline" href="#">Modify</a></td>
                        </tr>
                        <tr className="bg-white dark:bg-background-dark border-b dark:border-gray-700">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Olivia Bennett</td>
                          <td className="px-6 py-4">olivia.bennett@example.com</td>
                          <td className="px-6 py-4">500</td>
                          <td className="px-6 py-4"><a className="font-medium text-primary hover:underline" href="#">Modify</a></td>
                        </tr>
                        <tr className="bg-white dark:bg-background-dark border-b dark:border-gray-700">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Noah Carter</td>
                          <td className="px-6 py-4">noah.carter@example.com</td>
                          <td className="px-6 py-4">200</td>
                          <td className="px-6 py-4"><a className="font-medium text-primary hover:underline" href="#">Modify</a></td>
                        </tr>
                        <tr className="bg-white dark:bg-background-dark border-b dark:border-gray-700">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Ava Mitchell</td>
                          <td className="px-6 py-4">ava.mitchell@example.com</td>
                          <td className="px-6 py-4">750</td>
                          <td className="px-6 py-4"><a className="font-medium text-primary hover:underline" href="#">Modify</a></td>
                        </tr>
                        <tr className="bg-white dark:bg-background-dark">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Ethan Parker</td>
                          <td className="px-6 py-4">ethan.parker@example.com</td>
                          <td className="px-6 py-4">300</td>
                          <td className="px-6 py-4"><a className="font-medium text-primary hover:underline" href="#">Modify</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
