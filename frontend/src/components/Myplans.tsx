interface Plan {
    name: string;
    amount: number;
    duration: string;
    description: string;
  }
  
  interface MyplansProps {
    plans: Plan[];
  }
  
  const Myplans: React.FC<MyplansProps> = ({ plans }) => {
    return (
        <div className="w-[40%] h-60  bg-zinc-950 rounded-2xl p-6 shadow-lg border-x-[1px] border-orange-300">
        <h2 className="text-2xl font-light text-center text-zinc-300 mb-4">
          Company Plans
        </h2>
  
        <div className="h-[80%] overflow-y-auto scrollbar-hidden">
          <table className="w-full text-left text-zinc-300">
            <thead className="sticky top-0 bg-zinc-950">
              <tr>
                <th className=" py-2 border-b text-center border-orange-300">Plan Name</th>
                <th className=" py-2 border-b text-center border-orange-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr key={index} className="hover:bg-zinc-800 text-center">
                  <td className=" py-2 border-b border-gray-700">
                    {plan.name}
                  </td>
                  <td className="py-2 border-b border-gray-700">
                    {plan.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Myplans;
  