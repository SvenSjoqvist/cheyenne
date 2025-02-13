import React from 'react';

const CompleteSet: React.FC = () => {
  return (
    <section className="flex flex-col items-center self-center mt-5 ml-12 w-full max-w-[1176px] max-md:max-w-full">
      <h2 className="self-end mt-14 mr-28 text-3xl font-bold tracking-widest leading-none text-neutral-800 max-md:mt-10 max-md:mr-2.5">
        complete the set
      </h2>
      <div className="self-stretch max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[69%] max-md:ml-0 max-md:w-full">
            <div className="flex overflow-hidden flex-col grow pt-48 pr-2 pb-2 pl-20 w-full text-xl font-medium tracking-wider leading-none text-center bg-gray-200 text-zinc-200 max-md:pt-24 max-md:pl-5 max-md:mt-10 max-md:max-w-full">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/d6d164023a13ed0c3e335b33c318817824695da4f7b932cdd10afb83055a65ca?apiKey=df24f938eeb948889fe9ad55656873a2&"
                alt="Play Video"
                className="object-contain self-center aspect-square w-[51px]"
              />
              <p className="self-end mt-40 max-md:mt-10">
                snippet of bikini from short film
              </p>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[31%] max-md:ml-0 max-md:w-full">
            <div className="flex shrink-0 mx-auto max-w-full bg-zinc-100 h-[428px] w-[342px] max-md:mt-10" />
          </div>
        </div>
      </div>
      <button className="self-end px-2.5 py-2.5 mt-8 mr-7 max-w-full text-xl font-medium tracking-wider leading-none text-center rounded-xl border border-solid bg-neutral-100 border-neutral-800 min-h-[44px] text-neutral-800 w-[287px] max-md:mr-2.5">
        select size
      </button>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/c6721804faba99ca8e3cace269183a5c4d7e714d6bc455a7a1089faa31c584f3?apiKey=df24f938eeb948889fe9ad55656873a2&"
        alt="Dropdown Indicator"
        className="object-contain z-10 self-end mt-0 mr-11 w-3 aspect-[1.72] max-md:mr-2.5"
      />
      <button className="self-end px-2.5 py-2.5 mt-10 mr-7 text-xl font-medium tracking-wider leading-none text-center rounded-xl border border-solid bg-neutral-100 border-neutral-800 min-h-[44px] text-neutral-800 max-md:mr-2.5">
        add to luggage
      </button>
      <div className="flex gap-5 justify-between mt-28 max-w-full w-[891px] max-md:mt-10">
        <div className="flex flex-col self-start">
          <div className="flex shrink-0 self-end bg-zinc-100 h-[177px] w-[142px]" />
          <div className="flex gap-2.5 justify-center items-center mt-12 max-w-full min-h-[22px] w-[257px] max-md:mt-10">
            <span className="self-stretch my-auto text-xl font-bold tracking-wider leading-none text-neutral-800 w-[11px]">
              5
            </span>
            <div className="flex gap-1 items-center self-stretch my-auto">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/fee35a224eacaf207a6e5be57b498ac43dbbf2e8520388269cd88029c0fc284b?apiKey=df24f938eeb948889fe9ad55656873a2&"
                alt="Star Rating"
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/e58e0bbe2f931a458b070bba563c23ea5bc784a382a5f8df140757a9eed95623?apiKey=df24f938eeb948889fe9ad55656873a2&"
                alt="Star Rating"
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/2945e8841a5e16e8db006ecb9ee5631a96a4a29570b8f2c858921187e42273c2?apiKey=df24f938eeb948889fe9ad55656873a2&"
                alt="Star Rating"
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/8c0569fec453b67038822f0e986723882ecf585a43832415d6968c3205caca64?apiKey=df24f938eeb948889fe9ad55656873a2&"
                alt="Star Rating"
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/ea61d8cf244421b3de997194783c5bcf2b75ac4b2e86f3f6b31a8cfaf0703279?apiKey=df24f938eeb948889fe9ad55656873a2&"
                alt="Star Rating"
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              />
            </div>
            <span className="self-stretch my-auto text-sm font-medium tracking-wider leading-none text-stone-500 w-[118px]">
              based on 3 reviews
            </span>
          </div>
        </div>
        <div className="flex gap-5 font-medium leading-none text-neutral-800">
          <div className="flex flex-col">
            <div className="flex shrink-0 bg-zinc-100 h-[177px] w-[142px]" />
            <div className="flex flex-col self-end mt-8">
              <h3 className="self-start text-base tracking-wider">
                sizing
              </h3>
              <p className="mt-5 text-sm tracking-wider">runs small</p>
            </div>
          </div>
          <div className="flex flex-col text-sm tracking-wider">
            <div className="flex shrink-0 bg-zinc-100 h-[177px] w-[142px] max-md:mr-1.5" />
            <div className="flex flex-col items-end pl-8 mt-16 max-md:pl-5 max-md:mt-10">
              <div className="flex shrink-0 mr-7 rounded-full border border-solid bg-neutral-800 border-neutral-800 h-[9px] w-[9px] max-md:mr-2.5" />
              <p>true to size</p>
            </div>
          </div>
        </div>
        <p className="self-end mt-60 text-sm font-medium tracking-wider leading-none text-neutral-800 max-md:mt-10">
          runs large
        </p>
      </div>
    </section>
  );
};

export default CompleteSet;