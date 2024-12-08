import { TextHoverEffect } from "./ui/text-hover-effect";

const Hero = () => {
  return (
    <div className="w-[100%] bg-zinc-950 h-fit py-10 ">
      <div className="flex justify-center items-center py-6">
        <div className=" text-[8rem] justify-self-center font-title font-extrabold ">
          <div className="flex">
         <div className="my-auto font-normal"><TextHoverEffect text="INVO" duration={5}></TextHoverEffect></div><div className="text-[16rem] font-extrabold text-orange-500">X</div>
         </div>
        </div>

        
      </div>

      <div className="transition ease-in-out delay-150 bg-gradient-to-r from-zinc-950 from-10% via-orange-400  via-50% to-zinc-950 to-90% px-96 text-center text-black text-bold  tracking-tighter">
        Empower your business with secure, transparent, and seamless
        subscription management powered by blockchain technology.{" "}
        <span className="text-white font-montserrat">INVOX </span>is a platform
        that streamlines invoicing, payments, and renewals, ensuring complete
        transparency and trust between businesses and customers.
      </div>
    </div>
  );
};

export default Hero;
