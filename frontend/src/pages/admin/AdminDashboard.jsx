import { Award, Home, Book, FileText, User, LogOut, Menu, ChevronRight, MapPin, Phone, Calendar, Edit, Users, Search, Plus } from "react-feather";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
	return (
		<div className="flex h-screen overflow-hidden">
			{/* side bar */}
			<div className="sidebar bg-white w-64 shadow-sm hidden md:block">
				<div className="p-4 border-b border-gray-200">
					<div className="flex items-center">
						<Award size={32} className="text-blue-600 mr-2"/>
						<span className="text-xl font-bold text-gray-800">FAST-C Admin</span>
					</div>
				</div>
				{/* navigation */}
				<nav className="p-4 space-y-1">
					<Link to="" className="nav-active flex items-center px-4 py-3 text-sm font-medium rounded-lg">
						<Home size={20} className="mr-3"/>
						Dashboard
					</Link>
					<Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
						<Users size={20} className="mr-3"/>
						Users
					</Link>
					<Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
						<Book size={20} className="mr-3"/>
						Courses
					</Link>
					<Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
						<FileText size={20} className="mr-3"/>
						Certificates
					</Link>
					<Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
						<Search size={20} className="mr-3"/>
						Job Matching
					</Link>
					<Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
						<User size={20} className="mr-3"/>
						Profile
					</Link>
					<Link to="" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg">
						<LogOut size={20} className="mr-3"/>
						Logout
					</Link>
				</nav>
			</div>

			{/* main content */}
			<div className="flex-1 overflow-auto">

				{/* top navigation */}
				<header className="bg-white shadow-sm">
					<div className="flex justify-between items-center px-6 py-4">
						<div className="md:hidden">
							<button className="text-gray-600">
								<Menu size={24}/>
							</button>
						</div>
						<div className="flex items-center space-x-4">
							<div className="flex items-center">
								<img src="pic.png" alt="Profile" className="w-8 h-8 rounded-full"/>
								<span className="ml-2 text-sm font-medium">Juan Dela Cruz</span>
							</div>
						</div>
					</div>
				</header>

				{/* main content area */}
				<main className="p-6">
					{/* welcome header */}
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-gray-800">Welcome back, Juan</h1>
						<p className="text-gray-600">Quick stats: 45 active trainees today • 8 active courses</p>
					</div>

					{/* quick actions */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
						<Link to="" className="bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center font-medium hover:bg-blue-700">
							<Plus size={20} className="mr-2"/>
							Add New Course
						</Link>
						<Link to="" className="bg-green-600 text-white p-4 rounded-lg flex items-center justify-center font-medium hover:bg-green-700">
							<Users size={20} className="mr-2"/>
							Manage Trainees
						</Link>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* left column */}
						<div className="lg:col-span-2 space-y-6">

							{/* quick overviews */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="bg-white rounded-xl shadow-sm p-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-2">Total Trainees</h3>
                                	<p className="text-3xl font-bold text-blue-600">223</p>
								</div>
								<div className="bg-white rounded-xl shadow-sm p-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-2">Active Courses</h3>
                                	<p className="text-3xl font-bold text-blue-600">2</p>
									<Link to="" className="text-sm text-blue-600 mt-1 flex items-center">
										View all
										<ChevronRight size={16} className="ml-1" />
									</Link>
								</div>
							</div>

							{/* active trainees */}
							<div className="bg-white rounded-xl shadow-sm p-6">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-xl font-semibold text-gray-800">Active Trainees</h2>
								</div>

								<table className="w-full text-sm text-left text-gray-600">
									<thead className="border-b  border-gray-300">
										<tr>
											<th className="pb-2">Name</th>
											<th className="pb-2">Email</th>
											<th className="pb-2">Status</th>
										</tr>
									</thead>
									
									<tbody>
										<tr className="border-b border-gray-300">
											<td class="py-2">Juan Dela Cruz</td>
                                        	<td class="py-2">juan@email.com</td>
                                        	<td class="py-2"><span class="text-green-600">Active</span></td>
										</tr>
										<tr className="border-b border-gray-300">
											<td class="py-2">Ana Reyes</td>
                                        	<td class="py-2">ana@email.com</td>
                                        	<td class="py-2"><span class="text-green-600">Active</span></td>
										</tr>
									</tbody>
								</table>
							</div>

							{/* active courses */}
							<div className="bg-white rounded-xl shadow-sm p-6">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-xl font-semibold text-gray-800">Active Courses</h2>
								</div>

								<div className="space-y-4">
									<div className="border-b pb-2 border-gray-300">
										<h3 className="font-medium">Basic Welding</h3>
                                    	<p className="text-sm text-gray-600">Mon/Wed/Fri • 25 enrollees</p>
									</div>
									<div className="border-b pb-2 border-gray-300">
										<h3 className="font-medium">Pastry Making</h3>
                                    	<p className="text-sm text-gray-600">Tue/Thu • 15 enrollees</p>
									</div>
								</div>
							</div>
								
						</div>

						{/* right columnb */}
						<div className="space-y-6">
							{/* profile overview */}
							<div className="bg-white rounded-xl shadow-sm p-6">
								<div className="flex items-center mb-4">
									<img src="pic.png" alt="Profile" className="w-16 h-16 rounded-full"/>

									<div className="ml-4">
										<h2 className="font-semibold text-gray-800">Juan Dela Cruz</h2>
										<p className="text-sm text-gray-600">juandelacruz@email.com</p>
									</div>
								</div>

								<div className="space-y-3 text-sm">
									<div className="flex items-center">
										<MapPin size={16} className="text-gray-500 mr-2"/>
										<span>San Fernando, Pampanga</span>
									</div>
									<div className="flex items-center">
										<Phone size={16} className="text-gray-500 mr-2"/>
										<span>63 912 345 6789</span>
									</div>
									<div className="flex items-center">
										<Calendar size={16} className="text-gray-500 mr-2"/>
										<span>Joined: January 2025</span>
									</div>
								</div>

								<Link to="" className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
									<Edit size={16} className="w-4 h-4 mr-2"/>
									Edit Profile
								</Link>
							</div>
						</div>
					</div>
				</main>

				{/* footer */}
				<footer class="bg-gray-50 border-t border-gray-200 py-4 px-6">
					<p class="text-xs text-center text-gray-500">
					Developed for Fernandino Assessment and Skills Training Center (FAST-C), City of San Fernando, Pampanga — in partnership with PESO and local companies.
				</p>
				</footer>
			</div>
		</div>
	);
};

export default AdminDashboard;