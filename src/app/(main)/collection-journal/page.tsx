import React from 'react';
import Image from 'next/image';

export default async function CollectionJournalPage() {
  return (
    <div className="">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center font-[bero] mt-10 md:mt-20">
        the runaway collection: <br />
        a journey of self-discovery
      </h1>
      <div className="flex justify-center items-center mt-6 md:mt-10 flex-col">
        <iframe 
          style={{borderRadius: "12px"}} 
          src="https://open.spotify.com/embed/playlist/50Ln1bXzaVUuQ3OhXz3J2A?utm_source=generator&theme=0" 
          width="100%" 
          height="352" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          className="w-full max-w-[800px]"
        />
        <p className="text-center text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque max-w-[960px] mt-8 md:mt-15 px-4">
          The Runaway Collection began with a feeling we all know: the urge to escape everything familiar and find freedom. It captures those perfect summer afternoons when warm sand meets your feet and salt air settles on your skin. These moments exist outside of time, where authenticity is personified through swimwear.
        </p>
        <Image
          src="/images/bikine.jpg"
          alt="the runaway collection: a journey of self-discovery"
          width={361}
          height={542}
          className="mt-8 md:mt-10 w-full max-w-[361px]"
        />
        <p className="text-center text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque max-w-[960px] mt-8 md:mt-15 px-4">
          &quot;Runaway&quot; speaks to the woman who steps beyond boundaries. She understands that true freedom comes from embracing who she really is. This collection celebrates running toward something greater, toward moments of joy that become treasured memories.
        </p>
        <Image
          src="/images/socialpicture.jpg"
          alt="the runaway collection: a journey of self-discovery"
          width={624}
          height={383}
          className="mt-8 md:mt-10 w-full max-w-[624px]"
        />
        <p className="text-center text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque max-w-[960px] mt-8 md:mt-15 px-4">
          Because this collection is our first, it&apos;s personal. There&apos;s an unfinished edge to it&mdash;a looseness in how things came together. But the vision was always clear. Even without a polished blueprint, we knew what we were trying to say and stayed close to that feeling the whole way through. Each piece is built to move with the body and feel right without needing adjustment. The fabrics are soft, but strong enough to handle long days in the sun. We&apos;re not rushing anything. Every decision is intentional, led by a feeling we trust when we see it come to life.
        </p>
      </div>
      <div className="flex justify-center items-center mt-8 md:mt-10 bg-[#212121] text-white w-full min-h-[457px] py-12 px-4">
        <h1 className="text-center text-xl md:text-2xl lg:text-3xl font-light text-[#F7F7F7] font-darker-grotesque max-w-[472px] leading-normal">
          Each design invites you to embrace your individual story. This is swimwear for women who refuse to apologize for taking up space, who understand that true luxury is the freedom to be completely yourself.
        </h1>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mt-8 md:mt-10">
        <Image
          src="/images/col1.JPG"
          alt="the runaway collection: a journey of self-discovery"
          width={361}
          height={542}
          className="w-full max-w-[361px]"
        />
        <Image
          src="/images/col2.JPG"
          alt="the runaway collection: a journey of self-discovery"
          width={361}
          height={542}
          className="w-full max-w-[361px]"
        />
        <Image
          src="/images/col3.JPG"
          alt="the runaway collection: a journey of self-discovery"
          width={361}
          height={542}
          className="w-full max-w-[361px]"
        />
      </div>
      <div className="flex justify-center items-center mt-8 md:mt-10 flex-col px-4">
        <p className="text-center text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque max-w-[960px] italic">
          &quot;Working on the first collection was an experience to remember. Connecting with our closest friends who believe in the brand is truly something we appreciate so deeply. Getting together, trying on the bikinis, and creating elaborate sets to take the perfect photos is so core to what this brand stands for&mdash;intimacy, intention, and joy. I won&apos;t forget the smiles on all of our faces, seeing the vision come to life.&quot;
        </p>
        <p className="text-center text-base md:text-lg lg:text-xl font-light font-darker-grotesque mt-4">
          &mdash; Note from the Founders
        </p>
      </div>
      <div className="flex justify-center items-center mt-8 md:mt-10 bg-[#212121] w-screen min-h-[703px] py-12">
        <h1 className="text-center text-xl md:text-2xl lg:text-3xl font-light text-[#F7F7F7] font-darker-grotesque max-w-[472px] leading-normal">
          Every detail serves a greater purpose: to celebrate the remarkable woman who will wear these pieces. We&apos;re honored to create swimwear that becomes part of your most treasured experiences, holding within them summer laughter, unexpected connections, and the quiet confidence that comes from knowing you belong exactly where you are.
        </h1>
      </div>
    </div>
  );
}
