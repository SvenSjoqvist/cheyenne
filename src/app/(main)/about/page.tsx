export default function About() {
  return (
    <div className="flex flex-col items-center mt-32 pb-32">
      <h1 className="text-[40px] font-[bero] text-center px-4">
        designed on the California coast, artisan made in Bali.
      </h1>
      <div className="flex flex-row m-20">
        <div className="w-4/12">
          <h2 className="text-[32px] font-[bero] font-bold">About us</h2>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-1 w-full flex-col px-4 md:px-0 mr-20">
              <p className="text-xl md:text-2xl pr-4 md:pr-14 font-darker-grotesque font-medium">
                Kilaeko emerged from coastal roots and a shared vision for
                redefining luxury swimwear. An upbringing surrounded by ocean
                waters and endless summer days instilled an appreciation for
                beauty in its most authentic form. Our environment shaped how we
                view elegance and memorable experiences. We discovered that true
                luxury isn't just about the product—it’s about the story behind
                it and the attention to small details that make it special.
              </p>
              <br />
              <p className="text-xl md:text-2xl pr-4 md:pr-14 font-darker-grotesque font-medium">
                At Kilaeko, we curate more than swimwear—we craft characters
                within a larger narrative. Each piece possesses its own distinct
                personality, designed to complement your unique story while
                embodying our core values of authenticity, timelessness, and
                freedom. We see each design as having its own soul. When a woman
                chooses Kilaeko, she's not just selecting a swimsuit—she's
                adopting a character that resonates with her own narrative and
                becomes part of her most cherished memories.
              </p>
              <br />
              <p className="text-xl md:text-2xl pr-4 md:pr-14 font-darker-grotesque font-medium">
                With the vibrant energy of youth driving our creative vision,
                Kilaeko cultivates an exclusive community of discerning
                individuals who appreciate the value of limited-edition luxury.
                Our curated collections invite you into a space where each piece
                becomes a representation of your most meaningful moments. Being
                young founders gives us the freedom to challenge conventions.
                We're not bound by traditional approaches to luxury—we're
                redefining it through our lens of authenticity, limited
                availability, and emotional connection, creating a sanctuary
                where individual beauty flourishes beyond societal expectations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
