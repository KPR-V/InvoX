interface AnalyticscardProps {
    Header: string;
    Number: string;
}


const Analyticscard: React.FC<AnalyticscardProps> = ({
    Header,Number
  }) => {
  return (
    <>
    <div className=" bg-zinc-900 rounded-xl pt-10 pb-5  pl-5 text-left">
    <div className="value text-4xl text-orange-300">{Number}</div>
        <div className="header text-2xl font-light text-zinc-400 ">{Header}</div>
        
    </div>
    </>
  )
}

export default Analyticscard