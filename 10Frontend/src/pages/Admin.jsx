

import { NavLink } from "react-router";
import { Plus, Pencil, Trash2, Video } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white px-6 py-12">
     
      <h1 className="text-4xl font-bold text-center mb-2">Admin Panel</h1>
      <p className="text-center text-gray-400 mb-12">
        Manage coding problems on your platform
      </p>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

       
        <div className="bg-[#111827] rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition">
          <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-emerald-900/40">
            <Plus size={26} />
          </div>

          <h2 className="text-xl font-semibold mb-2">Create Problem</h2>
          <p className="text-gray-400 mb-6">
            Add a new coding problem to the platform
          </p>

          <NavLink
            to="/admin/create"
            className="btn w-full bg-emerald-500 hover:bg-emerald-600 text-black"
          >
            Create Problem
          </NavLink>
        </div>

       
        <div className="bg-[#111827] rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition">
          <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-yellow-900/40">
            <Pencil size={26} />
          </div>

          <h2 className="text-xl font-semibold mb-2">Update Problem</h2>
          <p className="text-gray-400 mb-6">
            Edit existing problems and their details
          </p>

          <NavLink
            to="/admin/update-list"
            className="btn w-full bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            Update Problem
          </NavLink>
        </div>

        
        <div className="bg-[#111827] rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition">
          <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-rose-900/40">
            <Trash2 size={26} />
          </div>

          <h2 className="text-xl font-semibold mb-2">Delete Problem</h2>
          <p className="text-gray-400 mb-6">
            Remove problems from the platform
          </p>

          <NavLink
            to="/admin/delete"
            className="btn w-full bg-rose-500 hover:bg-rose-600 text-black"
          >
            Delete Problem
          </NavLink>
        </div>

        
        <div className="bg-[#111827] rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition md:col-span-1">
          <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-emerald-900/40">
            <Video size={26} />
          </div>

          <h2 className="text-xl font-semibold mb-2">Video Problem</h2>
          <p className="text-gray-400 mb-6">
            Upload and delete solution videos
          </p>

          <NavLink
            to="/admin/video"
            className="btn w-full bg-emerald-500 hover:bg-emerald-600 text-black"
          >
            Video Problem
          </NavLink>
        </div>

      </div>
    </div>
  );
};

export default Admin;
