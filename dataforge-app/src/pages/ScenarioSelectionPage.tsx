import React from 'react';

const scenarios = [
  { title: 'B2B Tech Company', customers: 150, companies: 75, deals: 50, description: 'A standard sales pipeline for a company selling software subscriptions.' },
  { title: 'E-commerce Store', customers: 500, companies: 25, deals: 250, description: 'Simulates a direct-to-consumer business with a large customer base and sales orders.' },
  { title: 'Marketing Campaign Launch', customers: 50, companies: 50, deals: 10, description: 'A fresh set of marketing-qualified individuals from a recent campaign, ready for nurturing.' },
  { title: 'Startup Seed Round', customers: 75, companies: 40, deals: 20, description: 'A small dataset focused on tracking potential investors and early-stage interest.' },
  { title: 'Real Estate Agency', customers: 200, companies: 10, deals: 40, description: 'Data for managing property listings, potential buyers, and sellers.' },
  { title: 'Financial Services', customers: 250, companies: 100, deals: 60, description: 'A client and household-based model for a wealth management firm.' },
  { title: 'Customer Support Center', customers: 300, companies: 100, deals: 0, description: 'Populates the CRM with customers and companies, along with open support cases.' },
  { title: 'Non-Profit Organization', customers: 400, companies: 20, deals: 100, description: 'A dataset for tracking donors, volunteers, and fundraising campaigns.' },
  { title: 'Trade Show Follow-up', customers: 0, companies: 0, deals: 0, description: 'A simple, flat list of new prospects captured from a recent industry event.' },
  { title: 'CRM Demo Quick Start', customers: 50, companies: 20, deals: 15, description: 'A small, balanced set of records perfect for a quick product demonstration.' },
  { title: 'Massive Data Test', customers: 2500, companies: 500, deals: 800, description: 'A large-scale data set designed for stress-testing CRM performance and reporting.' },
];

const ScenarioCard: React.FC<{title: string; description: string; customers: number; companies: number; deals: number}> = ({ title, description, customers, companies, deals }) => {
  return (
    <div className="bg-white dark:bg-background-dark/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <p><b>Customers:</b> {customers}</p>
        <p><b>Companies:</b> {companies}</p>
        <p><b>Deals:</b> {deals}</p>
      </div>
    </div>
  );
};

const ScenarioSelectionPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor" />
              <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">DataForge</h1>
        </div>
        <nav className="flex items-center gap-6">
          <a className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="#">Dashboard</a>
          <a className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="#">Settings</a>
          <a className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="#">Help</a>
          <div className="w-10 h-10 bg-center bg-no-repeat bg-cover rounded-full" style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_yMO9Z9fMwy1DHPd-9reVh3Gd7dVYsXJkvXKcnKtrbol-ThfpSWbdceN9H5gwDMB-S8Tcs2VIqTFO0eYJMkFiGFjzIKt6pvgllkQwR-yCf5Kud-4GgoEk95h4mF3KFQD9bXxgR8uVksbyvRLRiGTfCMbx-gF-ZCdJWSIcZERVOp4Ehz0tYxsisCHRfleWEMgfhwifr5e0AY1NWyUhdiK80YEkZ4D7r3SekSDOTo0hdg5P--8Q730jB6l4BXhwGl--wv-KWG_uVo8")`}} />
        </nav>
      </div>

      <main className="flex-1 w-full max-w-7xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Choose a Data Scenario</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Select a pre-made scenario to instantly populate your CRM with realistic data, or build your own custom configuration.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map((s) => (
            <ScenarioCard key={s.title} title={s.title} description={s.description} customers={s.customers} companies={s.companies} deals={s.deals} />
          ))}

          <a className="bg-primary/10 dark:bg-primary/20 border-2 border-dashed border-primary dark:border-primary/50 rounded-xl shadow-md hover:shadow-lg hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300 cursor-pointer p-6 flex flex-col items-center justify-center text-center" href="#">
            <span className="material-symbols-outlined text-5xl text-primary">add_circle</span>
            <h3 className="mt-4 text-lg font-bold text-primary dark:text-white">Custom Configuration</h3>
            <p className="mt-2 text-sm text-primary/80 dark:text-gray-300">Manually specify record quantities, properties, and object relationships for full control.</p>
          </a>
        </div>
      </main>
    </div>
  );
};

export default ScenarioSelectionPage;
