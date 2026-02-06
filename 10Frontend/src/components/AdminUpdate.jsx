

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { useParams, useNavigate } from "react-router";

const AdminUpdate = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  
  useEffect(() => {
    const loadProblem = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${id}`);
        reset(data); 
        setLoading(false);
      } catch (err) {
        alert("Failed to load problem");
      }
    };
    loadProblem();
  }, [id, reset]);

 
  const onSubmit = async (formData) => {
    try {
      await axiosClient.put(`/problem/update/${id}`, formData);
      alert("Problem updated successfully");
      navigate("/admin/delete");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input
          {...register("title")}
          className="input input-bordered w-full"
          placeholder="Title"
        />

        <textarea
          {...register("description")}
          className="textarea textarea-bordered w-full h-32"
          placeholder="Description"
        />

        <select {...register("difficulty")} className="select select-bordered w-full">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select {...register("tags")} className="select select-bordered w-full">
          <option value="array">Array</option>
          <option value="linkedList">Linked List</option>
          <option value="graph">Graph</option>
          <option value="dp">DP</option>
        </select>

        <button type="submit" className="btn btn-primary w-full">
          Update Problem
        </button>
      </form>
    </div>
  );
};

export default AdminUpdate;
