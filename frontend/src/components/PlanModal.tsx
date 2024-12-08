import React, { useState, useEffect } from "react";

interface PlanDetails {
  name: string;
  amount: number;
  duration: string;
  description: string;
}

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (plan: PlanDetails) => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, onCreatePlan }) => {
  const [planDetails, setPlanDetails] = useState<PlanDetails>({
    name: "",
    amount: 0,
    duration: "",
    description: "",
  });

  // Reset the form when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setPlanDetails({
        name: "",
        amount: 0,
        duration: "",
        description: "",
      });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlanDetails({ ...planDetails, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (planDetails.name && planDetails.amount && planDetails.duration && planDetails.description) {
      onCreatePlan(planDetails);
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? "block" : "hidden"}`}
    >
      <div className="bg-zinc-950 p-8 rounded-xl w-96 border-running shadow-3xl shadow-orange-400">
        <h2 className="text-2xl font-light text-zinc-300 text-center mb-6">Create New Plan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-orange-300">Plan Name</label>
            <input
              type="text"
              name="name"
              value={planDetails.name}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 bg-zinc-900 text-white rounded-lg focus:border-[1px] focus:border-orange-300 "
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-orange-300">Amount</label>
            <input
              type="number"
              name="amount"
              value={planDetails.amount}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 bg-zinc-900 text-white rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-orange-300">Duration (Months)</label>
            <input
              type="text"
              name="duration"
              value={planDetails.duration}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 bg-zinc-900 text-white rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-orange-300">Description</label>
            <textarea
              name="description"
              value={planDetails.description}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 bg-zinc-900 text-white rounded-lg"
              required
            />
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="bg-zinc-800 text-white py-2 px-4 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="bg-orange-400 text-white py-2 px-4 rounded-lg">
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
